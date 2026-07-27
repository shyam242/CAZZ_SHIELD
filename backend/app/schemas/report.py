"""CAZZ SHIELD — Report Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReportResponse(BaseModel):
    id: str
    report_id: str
    title: str
    report_type: str
    status: str
    summary: Optional[str] = None
    metrics: Optional[dict] = None
    findings: Optional[list] = None
    recommendations: Optional[list] = None
    period_start: datetime
    period_end: datetime
    departments_covered: Optional[list] = None
    total_events: int
    total_incidents: int
    total_violations: int
    compliance_score: float
    generated_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    reports: list[ReportResponse]
    total: int


class ReportGenerateRequest(BaseModel):
    report_type: str
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    departments: Optional[list] = None
