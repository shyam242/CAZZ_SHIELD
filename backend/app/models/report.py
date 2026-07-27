"""
CAZZ SHIELD — Report Model
Governance reports: Daily, Weekly, Monthly with PDF/CSV export
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class ReportType(str, enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    CUSTOM = "custom"


class ReportStatus(str, enum.Enum):
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


class GovernanceReport(Base):
    __tablename__ = "governance_reports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    report_type: Mapped[ReportType] = mapped_column(Enum(ReportType), nullable=False)
    status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus), default=ReportStatus.COMPLETED)
    
    # Content
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    metrics: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    findings: Mapped[list | None] = mapped_column(JSON, nullable=True)
    recommendations: Mapped[list | None] = mapped_column(JSON, nullable=True)
    
    # Coverage
    period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    departments_covered: Mapped[list | None] = mapped_column(JSON, nullable=True)
    
    # Stats
    total_events: Mapped[int] = mapped_column(Integer, default=0)
    total_incidents: Mapped[int] = mapped_column(Integer, default=0)
    total_violations: Mapped[int] = mapped_column(Integer, default=0)
    compliance_score: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Metadata
    generated_by: Mapped[str] = mapped_column(String(255), default="system")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
