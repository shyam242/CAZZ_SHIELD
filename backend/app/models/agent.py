"""
CAZZ SHIELD — Agent Model
AI Agent entity with trust, risk, budget, and compliance attributes
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class AgentStatus(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    QUARANTINED = "quarantined"
    SUSPENDED = "suspended"
    DECOMMISSIONED = "decommissioned"
    PENDING_REVIEW = "pending_review"
    EMERGENCY_STOPPED = "emergency_stopped"


class AgentDepartment(str, enum.Enum):
    TREASURY = "Treasury Operations"
    PAYMENTS = "Payment Processing"
    KYC = "KYC & Compliance"
    FRAUD = "Fraud Investigation"
    LENDING = "Loan Underwriting"
    COMPLIANCE = "Regulatory Compliance"
    SUPPORT = "Customer Support"
    INVESTMENT = "Investment Advisory"
    RISK = "Risk Management"
    AUDIT = "Internal Audit"


class AgentRiskLevel(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    MINIMAL = "minimal"


class Agent(Base):
    __tablename__ = "agents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    agent_class: Mapped[str] = mapped_column(String(100), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    status: Mapped[AgentStatus] = mapped_column(Enum(AgentStatus), default=AgentStatus.ACTIVE, index=True)
    risk_level: Mapped[str] = mapped_column(String(50), default="medium")

    # Trust
    trust_score: Mapped[float] = mapped_column(Float, default=0.50)
    trust_confidence: Mapped[float] = mapped_column(Float, default=0.0)
    trust_observations: Mapped[int] = mapped_column(Integer, default=0)

    # Risk
    risk_score: Mapped[float] = mapped_column(Float, default=0.30)
    risk_factors: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # Budget
    base_budget: Mapped[float] = mapped_column(Float, default=100000.0)
    current_budget: Mapped[float] = mapped_column(Float, default=100000.0)
    budget_spent: Mapped[float] = mapped_column(Float, default=0.0)
    budget_window: Mapped[str] = mapped_column(String(50), default="monthly")

    # Metadata
    owner: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_email: Mapped[str] = mapped_column(String(255), nullable=True)
    version: Mapped[str] = mapped_column(String(50), default="1.0.0")
    model_provider: Mapped[str] = mapped_column(String(100), nullable=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=True)
    identity_provider_ref: Mapped[str] = mapped_column(String(255), nullable=True)

    # Permissions
    allowed_tools: Mapped[list | None] = mapped_column(JSON, nullable=True)
    allowed_apis: Mapped[list | None] = mapped_column(JSON, nullable=True)
    allowed_actions: Mapped[list | None] = mapped_column(JSON, nullable=True)
    policy_ids: Mapped[list | None] = mapped_column(JSON, nullable=True)

    # Operational
    total_actions: Mapped[int] = mapped_column(Integer, default=0)
    total_violations: Mapped[int] = mapped_column(Integer, default=0)
    total_denials: Mapped[int] = mapped_column(Integer, default=0)
    last_action_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_violation_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Geographic
    region: Mapped[str] = mapped_column(String(100), default="US-East")
    geography: Mapped[str] = mapped_column(String(100), default="North America")

    # Timestamps
    onboarded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Emergency
    is_emergency_stopped: Mapped[bool] = mapped_column(Boolean, default=False)
    emergency_stopped_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    emergency_stopped_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
