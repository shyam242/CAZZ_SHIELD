"""CAZZ SHIELD — Copilot Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CopilotQueryRequest(BaseModel):
    query: str
    context: Optional[dict] = None


class CopilotResponse(BaseModel):
    query: str
    response: str
    response_type: str  # text, table, chart, list
    data: Optional[dict] = None
    sources: list[str]
    confidence: float
    timestamp: datetime


class CopilotSuggestion(BaseModel):
    id: str
    text: str
    category: str
    icon: str
