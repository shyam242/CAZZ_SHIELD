"""
CAZZ SHIELD — Policy Model
OPA-style policy-as-code with versioning, rollback, and simulation
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class PolicyStatus(str, enum.Enum):
    DRAFT = "draft"
    SIMULATING = "simulating"
    PEER_REVIEW = "peer_review"
    CANARY = "canary"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ROLLBACK = "rollback"
    ARCHIVED = "archived"


class PolicySeverity(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class PolicyCategory(str, enum.Enum):
    TRUST = "trust"
    BUDGET = "budget"
    PERMISSION = "permission"
    COMPLIANCE = "compliance"
    SECURITY = "security"
    OPERATIONAL = "operational"
    DATA_ACCESS = "data_access"
    TRANSACTION = "transaction"


class Policy(Base):
    __tablename__ = "policies"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    policy_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), default="medium")
    status: Mapped[PolicyStatus] = mapped_column(Enum(PolicyStatus), default=PolicyStatus.DRAFT)
    version: Mapped[int] = mapped_column(Integer, default=1)
    
    # Policy content (OPA/Rego style)
    policy_code: Mapped[str] = mapped_column(Text, nullable=False)
    policy_language: Mapped[str] = mapped_column(String(50), default="rego")
    
    # Targeting
    target_departments: Mapped[list | None] = mapped_column(JSON, nullable=True)
    target_agent_classes: Mapped[list | None] = mapped_column(JSON, nullable=True)
    target_risk_levels: Mapped[list | None] = mapped_column(JSON, nullable=True)
    
    # Metadata
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    reviewer: Mapped[str | None] = mapped_column(String(255), nullable=True)
    approved_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    # Stats
    total_evaluations: Mapped[int] = mapped_column(Integer, default=0)
    total_denials: Mapped[int] = mapped_column(Integer, default=0)
    total_allows: Mapped[int] = mapped_column(Integer, default=0)
    denial_rate: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Simulation
    simulation_report_ref: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_simulated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    simulation_pass: Mapped[bool | None] = mapped_column(nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    archived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class PolicyVersion(Base):
    __tablename__ = "policy_versions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    policy_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    policy_code: Mapped[str] = mapped_column(Text, nullable=False)
    change_summary: Mapped[str] = mapped_column(Text, nullable=True)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
