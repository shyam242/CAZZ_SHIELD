"""CAZZ SHIELD — Budget Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BudgetResponse(BaseModel):
    agent_id: str
    base_budget: float
    trust_modifier: float
    risk_modifier: float
    criticality: float
    effective_budget: float
    spent: float
    remaining: float
    utilization_pct: float
    window: str
    is_frozen: bool
    violation_count: int
    department: Optional[str] = None
    currency: str

    class Config:
        from_attributes = True


class BudgetListResponse(BaseModel):
    budgets: list[BudgetResponse]
    total: int
    total_allocated: float
    total_spent: float
    total_remaining: float


class BudgetTransactionResponse(BaseModel):
    id: str
    agent_id: str
    transaction_type: str
    amount: float
    balance_before: float
    balance_after: float
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BudgetForecastResponse(BaseModel):
    agent_id: str
    current_spent: float
    current_remaining: float
    projected_spend: float
    projected_remaining: float
    days_remaining_in_window: int
    daily_average_spend: float
    will_exceed: bool
    confidence: float


class BudgetOverviewResponse(BaseModel):
    total_budget: float
    total_spent: float
    total_remaining: float
    total_frozen: int
    total_violations: int
    department_breakdown: list[dict]
    top_spenders: list[dict]
