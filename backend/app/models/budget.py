"""
CAZZ SHIELD — Budget Model
AdaptiveBudget = clip(Base × TrustMod × RiskMod × Criticality, 0.05×Base, 1.5×Base)
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class BudgetTransactionType(str, enum.Enum):
    ALLOCATION = "allocation"
    SPEND = "spend"
    ADJUSTMENT = "adjustment"
    FREEZE = "freeze"
    UNFREEZE = "unfreeze"
    RESET = "reset"
    EMERGENCY_FREEZE = "emergency_freeze"


class Budget(Base):
    __tablename__ = "budgets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    base_budget: Mapped[float] = mapped_column(Float, nullable=False)
    trust_modifier: Mapped[float] = mapped_column(Float, default=1.0)
    risk_modifier: Mapped[float] = mapped_column(Float, default=1.0)
    criticality: Mapped[float] = mapped_column(Float, default=1.0)
    effective_budget: Mapped[float] = mapped_column(Float, nullable=False)
    spent: Mapped[float] = mapped_column(Float, default=0.0)
    remaining: Mapped[float] = mapped_column(Float, nullable=False)
    window: Mapped[str] = mapped_column(String(50), default="monthly")
    window_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    window_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_frozen: Mapped[bool] = mapped_column(default=False)
    frozen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    frozen_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    violation_count: Mapped[int] = mapped_column(Integer, default=0)
    last_violation_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    department: Mapped[str] = mapped_column(String(100), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)


class BudgetTransaction(Base):
    __tablename__ = "budget_transactions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    transaction_type: Mapped[BudgetTransactionType] = mapped_column(Enum(BudgetTransactionType), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    balance_before: Mapped[float] = mapped_column(Float, nullable=False)
    balance_after: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    action_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    approved_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
