"""CAZZ SHIELD — Emergency Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EmergencyStatusResponse(BaseModel):
    emergency_mode: bool
    activated_at: Optional[datetime] = None
    activated_by: Optional[str] = None
    reason: Optional[str] = None
    affected_agents: int
    frozen_budgets: int
    revoked_permissions: int
    actions_since_activation: list[dict]


class EmergencyActivateRequest(BaseModel):
    reason: str
    scope: str = "fleet"  # fleet, department, agent
    target_id: Optional[str] = None
    actions: list[str] = ["stop_agents", "freeze_budgets", "revoke_permissions"]


class EmergencyDeactivateRequest(BaseModel):
    reason: str
    restore_agents: bool = True
    restore_budgets: bool = True
    restore_permissions: bool = True


class EmergencyActionResponse(BaseModel):
    action: str
    status: str
    affected_count: int
    timestamp: datetime
    details: Optional[dict] = None
