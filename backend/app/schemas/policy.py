"""CAZZ SHIELD — Policy Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PolicyResponse(BaseModel):
    id: str
    policy_id: str
    name: str
    description: Optional[str] = None
    category: str
    severity: str
    status: str
    version: int
    policy_code: str
    policy_language: str
    target_departments: Optional[list] = None
    target_agent_classes: Optional[list] = None
    author: str
    reviewer: Optional[str] = None
    total_evaluations: int
    total_denials: int
    total_allows: int
    denial_rate: float
    simulation_pass: Optional[bool] = None
    last_simulated_at: Optional[datetime] = None
    created_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PolicyListResponse(BaseModel):
    policies: list[PolicyResponse]
    total: int
    page: int
    page_size: int


class PolicyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    severity: str = "medium"
    policy_code: str
    policy_language: str = "rego"
    target_departments: Optional[list] = None
    target_agent_classes: Optional[list] = None


class PolicyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    policy_code: Optional[str] = None
    status: Optional[str] = None


class PolicyVersionResponse(BaseModel):
    id: str
    policy_id: str
    version: int
    policy_code: str
    change_summary: Optional[str] = None
    author: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class SimulationRequest(BaseModel):
    policy_id: Optional[str] = None
    policy_code: str
    target_departments: Optional[list] = None
    replay_hours: int = 24


class SimulationResponse(BaseModel):
    simulation_id: str
    policy_id: Optional[str] = None
    status: str
    blocked_actions: int
    newly_allowed: int
    policy_conflicts: int
    affected_agents: int
    blast_radius: float
    impact_level: str
    details: dict
    created_at: datetime
