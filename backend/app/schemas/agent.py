"""
CAZZ SHIELD — Agent Schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AgentResponse(BaseModel):
    id: str
    agent_id: str
    name: str
    description: Optional[str] = None
    agent_class: str
    department: str
    status: str
    risk_level: str
    trust_score: float
    trust_confidence: float
    trust_observations: int
    risk_score: float
    base_budget: float
    current_budget: float
    budget_spent: float
    budget_window: str
    owner: str
    owner_email: Optional[str] = None
    version: str
    model_provider: Optional[str] = None
    model_name: Optional[str] = None
    allowed_tools: Optional[list] = None
    allowed_apis: Optional[list] = None
    total_actions: int
    total_violations: int
    total_denials: int
    last_action_at: Optional[datetime] = None
    region: str
    geography: str
    onboarded_at: datetime
    is_emergency_stopped: bool
    policy_ids: Optional[list] = None

    class Config:
        from_attributes = True


class AgentListResponse(BaseModel):
    agents: list[AgentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class AgentFilters(BaseModel):
    department: Optional[str] = None
    status: Optional[str] = None
    risk_level: Optional[str] = None
    trust_min: Optional[float] = None
    trust_max: Optional[float] = None
    search: Optional[str] = None
    owner: Optional[str] = None


class AgentUpdate(BaseModel):
    status: Optional[str] = None
    risk_level: Optional[str] = None
    owner: Optional[str] = None
    description: Optional[str] = None
    allowed_tools: Optional[list] = None
    allowed_apis: Optional[list] = None


class AgentActionRequest(BaseModel):
    agent_id: str
    action: str
    resource: Optional[str] = None
    parameters: Optional[dict] = None


class AgentActionResponse(BaseModel):
    decision: str
    agent_id: str
    action: str
    trust_score: float
    risk_score: float
    budget_remaining: float
    policy_matched: Optional[str] = None
    decision_path: str
    timestamp: datetime
