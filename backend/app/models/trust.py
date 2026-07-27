"""
CAZZ SHIELD — Trust Score Model
Trust(t+1) = clip(Trust(t) + α·S(t) + β·H(t) − γ·V(t) − δ·A(t), 0, 1)
Confidence(t) = min(1, N(t) / N_min)
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, Enum, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class TrustEventType(str, enum.Enum):
    SUCCESS = "success"
    VIOLATION = "violation"
    ANOMALY = "anomaly"
    HUMAN_APPROVAL = "human_approval"
    DECAY = "decay"
    RECOVERY = "recovery"
    RESET = "reset"
    PENALTY = "penalty"


class TrustScore(Base):
    __tablename__ = "trust_scores"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    previous_score: Mapped[float] = mapped_column(Float, nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    observations: Mapped[int] = mapped_column(Integer, default=0)
    delta: Mapped[float] = mapped_column(Float, default=0.0)
    reason: Mapped[str] = mapped_column(Text, nullable=True)
    event_type: Mapped[str] = mapped_column(String(50), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, index=True)


class TrustEvent(Base):
    __tablename__ = "trust_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    event_type: Mapped[TrustEventType] = mapped_column(Enum(TrustEventType), nullable=False)
    trust_before: Mapped[float] = mapped_column(Float, nullable=False)
    trust_after: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_before: Mapped[float] = mapped_column(Float, default=0.0)
    confidence_after: Mapped[float] = mapped_column(Float, default=0.0)
    delta: Mapped[float] = mapped_column(Float, default=0.0)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    action_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    policy_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    triggered_by: Mapped[str] = mapped_column(String(255), default="system")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
