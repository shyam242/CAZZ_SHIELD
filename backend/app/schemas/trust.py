"""
CAZZ SHIELD — Trust Schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TrustScoreResponse(BaseModel):
    agent_id: str
    score: float
    confidence: float
    observations: int
    trend: str  # improving, declining, stable
    last_updated: datetime

    class Config:
        from_attributes = True


class TrustHistoryResponse(BaseModel):
    records: list["TrustHistoryRecord"]
    agent_id: str
    total: int


class TrustHistoryRecord(BaseModel):
    score: float
    previous_score: Optional[float] = None
    confidence: float
    delta: float
    event_type: str
    reason: Optional[str] = None
    recorded_at: datetime


class TrustEventResponse(BaseModel):
    id: str
    agent_id: str
    event_type: str
    trust_before: float
    trust_after: float
    confidence_before: float
    confidence_after: float
    delta: float
    description: Optional[str] = None
    triggered_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class TrustTimelineResponse(BaseModel):
    agent_id: str
    timeline: list[dict]
    current_score: float
    current_confidence: float
    trend: str


class TrustDistributionResponse(BaseModel):
    ranges: list[dict]
    total_agents: int
    average_trust: float
    median_trust: float
