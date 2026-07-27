"""
CAZZ SHIELD — Incident Model
Incident response & recovery workflow: detection → triage → containment → root cause → recovery → post-incident review
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class IncidentSeverity(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class IncidentStatus(str, enum.Enum):
    OPEN = "open"
    INVESTIGATING = "investigating"
    CONTAINED = "contained"
    RESOLVED = "resolved"
    CLOSED = "closed"
    FALSE_POSITIVE = "false_positive"


class IncidentType(str, enum.Enum):
    TRUST_VIOLATION = "trust_violation"
    BUDGET_BREACH = "budget_breach"
    POLICY_VIOLATION = "policy_violation"
    UNAUTHORIZED_ACCESS = "unauthorized_access"
    ANOMALOUS_BEHAVIOR = "anomalous_behavior"
    COLLUSION_DETECTED = "collusion_detected"
    PRIVILEGE_ESCALATION = "privilege_escalation"
    EMERGENCY_TRIGGERED = "emergency_triggered"
    SYSTEM_ANOMALY = "system_anomaly"


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    incident_type: Mapped[str] = mapped_column(String(100), nullable=False)
    severity: Mapped[IncidentSeverity] = mapped_column(Enum(IncidentSeverity), nullable=False)
    status: Mapped[IncidentStatus] = mapped_column(Enum(IncidentStatus), default=IncidentStatus.OPEN)
    
    # Affected entities
    agent_ids: Mapped[list | None] = mapped_column(JSON, nullable=True)
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    affected_systems: Mapped[list | None] = mapped_column(JSON, nullable=True)
    
    # Response
    assigned_to: Mapped[str | None] = mapped_column(String(255), nullable=True)
    escalated_to: Mapped[str | None] = mapped_column(String(255), nullable=True)
    resolution: Mapped[str | None] = mapped_column(Text, nullable=True)
    root_cause: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Actions taken
    actions_taken: Mapped[list | None] = mapped_column(JSON, nullable=True)
    containment_actions: Mapped[list | None] = mapped_column(JSON, nullable=True)
    
    # Metrics
    detection_time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    containment_time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    resolution_time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    
    # Timeline
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    contained_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
