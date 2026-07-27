"""CAZZ SHIELD — Audit Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AuditEventResponse(BaseModel):
    id: str
    event_id: str
    agent_id: str
    agent_name: Optional[str] = None
    department: Optional[str] = None
    action: str
    action_category: Optional[str] = None
    resource: Optional[str] = None
    decision: str
    category: str
    policy_matched: Optional[str] = None
    policy_rule: Optional[str] = None
    trust_score: Optional[float] = None
    risk_score: Optional[float] = None
    budget_status: Optional[str] = None
    budget_remaining: Optional[float] = None
    decision_path: Optional[str] = None
    operator: str
    operator_type: str
    severity: str
    record_hash: str
    prev_hash: str
    sequence_number: int
    timestamp: datetime

    class Config:
        from_attributes = True


class AuditListResponse(BaseModel):
    events: list[AuditEventResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class AuditFilters(BaseModel):
    agent_id: Optional[str] = None
    decision: Optional[str] = None
    category: Optional[str] = None
    severity: Optional[str] = None
    department: Optional[str] = None
    search: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None


class AuditStatsResponse(BaseModel):
    total_events: int
    total_allowed: int
    total_denied: int
    total_escalated: int
    denial_rate: float
    events_today: int
    events_this_week: int
    top_agents: list[dict]
    top_actions: list[dict]
    decision_distribution: dict
    hourly_distribution: list[dict]
