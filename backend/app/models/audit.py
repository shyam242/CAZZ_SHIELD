"""
CAZZ SHIELD — Audit Event Model
Hash-chained immutable audit records (Merkle-style append-only log)
Fields from PRD Slide 16: timestamp, agent, action, policy_matched, decision, trust_score, risk_score, budget_status, decision_path, operator, prev_hash
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class AuditDecision(str, enum.Enum):
    ALLOWED = "allowed"
    DENIED = "denied"
    ESCALATED = "escalated"
    QUARANTINED = "quarantined"
    CONDITIONAL = "conditional"


class AuditCategory(str, enum.Enum):
    GOVERNANCE = "governance"
    TRUST = "trust"
    BUDGET = "budget"
    POLICY = "policy"
    PERMISSION = "permission"
    EMERGENCY = "emergency"
    AUTHENTICATION = "authentication"
    SYSTEM = "system"
    INCIDENT = "incident"


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    
    # Agent context
    agent_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    agent_name: Mapped[str] = mapped_column(String(255), nullable=True)
    department: Mapped[str] = mapped_column(String(100), nullable=True)
    
    # Action
    action: Mapped[str] = mapped_column(String(255), nullable=False)
    action_category: Mapped[str] = mapped_column(String(100), nullable=True)
    resource: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # Decision
    decision: Mapped[AuditDecision] = mapped_column(Enum(AuditDecision), nullable=False)
    category: Mapped[str] = mapped_column(String(100), default="governance")
    
    # Governance context (from PRD Slide 16)
    policy_matched: Mapped[str | None] = mapped_column(String(255), nullable=True)
    policy_rule: Mapped[str | None] = mapped_column(String(255), nullable=True)
    trust_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    budget_status: Mapped[str | None] = mapped_column(String(255), nullable=True)
    budget_remaining: Mapped[float | None] = mapped_column(Float, nullable=True)
    decision_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    # Operator
    operator: Mapped[str] = mapped_column(String(255), default="auto")
    operator_type: Mapped[str] = mapped_column(String(50), default="system")
    
    # Details
    details: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    severity: Mapped[str] = mapped_column(String(50), default="info")
    
    # Hash chain (Merkle-style)
    record_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    prev_hash: Mapped[str] = mapped_column(String(64), nullable=False, default="0" * 64)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    
    # IP / Source
    source_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    # Timestamps
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
