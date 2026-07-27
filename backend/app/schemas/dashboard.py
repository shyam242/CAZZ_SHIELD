"""CAZZ SHIELD — Dashboard Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DashboardKPIs(BaseModel):
    total_agents: int
    active_agents: int
    paused_agents: int
    quarantined_agents: int
    average_trust: float
    average_risk: float
    total_budget: float
    total_spent: float
    budget_utilization: float
    total_policies: int
    active_policies: int
    policy_accuracy: float
    total_audit_events: int
    events_today: int
    total_incidents: int
    open_incidents: int
    critical_incidents: int
    avg_decision_latency_ms: float
    system_health: float
    emergency_mode: bool


class DashboardChartData(BaseModel):
    trust_distribution: list[dict]
    risk_heatmap: list[dict]
    agent_status_breakdown: list[dict]
    audit_timeline: list[dict]
    budget_by_department: list[dict]
    policy_decisions: list[dict]
    incident_trend: list[dict]
    latency_trend: list[dict]


class SystemHealthResponse(BaseModel):
    overall: float
    components: list[dict]
    last_check: datetime


class QuickAction(BaseModel):
    id: str
    label: str
    description: str
    icon: str
    action_type: str
    severity: str
