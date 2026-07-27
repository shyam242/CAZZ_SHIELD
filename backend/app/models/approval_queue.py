"""
CAZZ SHIELD — Approval Queue Model
Human-in-the-Loop Trust Approval Queue for agent actions requiring human sign-off
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, Enum, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


class ApprovalQueue(Base):
    __tablename__ = "approval_queue"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    agent_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    agent_name: Mapped[str] = mapped_column(String(255), nullable=False)
    requested_operation: Mapped[str] = mapped_column(Text, nullable=False)
    trust_before: Mapped[float] = mapped_column(Float, nullable=False)
    trust_after: Mapped[float] = mapped_column(Float, nullable=True)
    confidence_before: Mapped[float] = mapped_column(Float, default=0.0)
    confidence_after: Mapped[float] = mapped_column(Float, nullable=True)
    status: Mapped[ApprovalStatus] = mapped_column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING, index=True)
    priority: Mapped[str] = mapped_column(String(20), default="medium")  # low, medium, high, critical
    requested_by: Mapped[str] = mapped_column(String(255), nullable=False)  # agent or system
    approved_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    action_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    policy_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    reviewed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
