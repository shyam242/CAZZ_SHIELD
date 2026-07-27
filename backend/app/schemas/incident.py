"""CAZZ SHIELD — Incident Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class IncidentResponse(BaseModel):
    id: str
    incident_id: str
    title: str
    description: Optional[str] = None
    incident_type: str
    severity: str
    status: str
    agent_ids: Optional[list] = None
    department: Optional[str] = None
    affected_systems: Optional[list] = None
    assigned_to: Optional[str] = None
    resolution: Optional[str] = None
    root_cause: Optional[str] = None
    actions_taken: Optional[list] = None
    detection_time_ms: Optional[int] = None
    containment_time_ms: Optional[int] = None
    resolution_time_ms: Optional[int] = None
    detected_at: datetime
    contained_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class IncidentListResponse(BaseModel):
    incidents: list[IncidentResponse]
    total: int
    page: int
    page_size: int


class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    incident_type: str
    severity: str
    agent_ids: Optional[list] = None
    department: Optional[str] = None


class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    resolution: Optional[str] = None
    root_cause: Optional[str] = None
