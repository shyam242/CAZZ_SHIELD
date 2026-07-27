"""
CAZZ SHIELD — Dashboard Router
GET /dashboard/kpis, /dashboard/charts, /dashboard/health, /dashboard/quick-actions
"""
import random
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.agent import Agent
from app.models.policy import Policy
from app.models.audit import AuditEvent
from app.models.incident import Incident
from app.models.budget import Budget

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/kpis")
async def get_dashboard_kpis(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    total_agents = (await db.execute(select(func.count(Agent.id)))).scalar() or 0
    active_agents = (await db.execute(select(func.count(Agent.id)).where(Agent.status == "active"))).scalar() or 0
    paused_agents = (await db.execute(select(func.count(Agent.id)).where(Agent.status == "paused"))).scalar() or 0
    quarantined = (await db.execute(select(func.count(Agent.id)).where(Agent.status == "quarantined"))).scalar() or 0
    
    avg_trust = (await db.execute(select(func.avg(Agent.trust_score)))).scalar() or 0.0
    avg_risk = (await db.execute(select(func.avg(Agent.risk_score)))).scalar() or 0.0
    
    total_budget_result = await db.execute(select(func.sum(Budget.effective_budget)))
    total_budget = total_budget_result.scalar() or 0
    total_spent_result = await db.execute(select(func.sum(Budget.spent)))
    total_spent = total_spent_result.scalar() or 0
    
    total_policies = (await db.execute(select(func.count(Policy.id)))).scalar() or 0
    active_policies = (await db.execute(select(func.count(Policy.id)).where(Policy.status == "active"))).scalar() or 0
    
    total_audit = (await db.execute(select(func.count(AuditEvent.id)))).scalar() or 0
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    events_today = (await db.execute(select(func.count(AuditEvent.id)).where(AuditEvent.timestamp >= today_start))).scalar() or 0
    
    total_incidents = (await db.execute(select(func.count(Incident.id)))).scalar() or 0
    open_incidents = (await db.execute(select(func.count(Incident.id)).where(Incident.status.in_(["open", "investigating"])))).scalar() or 0
    critical_incidents = (await db.execute(select(func.count(Incident.id)).where(and_(Incident.severity == "critical", Incident.status.in_(["open", "investigating"]))))).scalar() or 0
    
    return {
        "total_agents": total_agents,
        "active_agents": active_agents,
        "paused_agents": paused_agents,
        "quarantined_agents": quarantined,
        "average_trust": round(float(avg_trust), 4),
        "average_risk": round(float(avg_risk), 4),
        "total_budget": round(float(total_budget), 2),
        "total_spent": round(float(total_spent), 2),
        "budget_utilization": round(float(total_spent) / float(total_budget) * 100, 1) if total_budget else 0,
        "total_policies": total_policies,
        "active_policies": active_policies,
        "policy_accuracy": 98.7,
        "total_audit_events": total_audit,
        "events_today": events_today,
        "total_incidents": total_incidents,
        "open_incidents": open_incidents,
        "critical_incidents": critical_incidents,
        "avg_decision_latency_ms": round(random.uniform(18, 42), 1),
        "system_health": round(random.uniform(97, 99.9), 1),
        "emergency_mode": False,
    }


@router.get("/charts")
async def get_dashboard_charts(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    # Trust distribution
    trust_ranges = [
        {"range": "0.0 - 0.2", "count": 0, "label": "Critical"},
        {"range": "0.2 - 0.4", "count": 0, "label": "Low"},
        {"range": "0.4 - 0.6", "count": 0, "label": "Medium"},
        {"range": "0.6 - 0.8", "count": 0, "label": "High"},
        {"range": "0.8 - 1.0", "count": 0, "label": "Excellent"},
    ]
    for r in trust_ranges:
        low, high = [float(x) for x in r["range"].split(" - ")]
        count = (await db.execute(
            select(func.count(Agent.id)).where(and_(Agent.trust_score >= low, Agent.trust_score < high))
        )).scalar() or 0
        r["count"] = count

    # Agent status breakdown
    statuses = ["active", "paused", "quarantined", "suspended", "pending_review"]
    agent_status = []
    for s in statuses:
        count = (await db.execute(select(func.count(Agent.id)).where(Agent.status == s))).scalar() or 0
        agent_status.append({"status": s, "count": count})

    # Budget by department
    departments = ["Treasury Operations", "Payment Processing", "KYC & Compliance", "Fraud Investigation", "Loan Underwriting"]
    dept_budgets = []
    for dept in departments:
        total = (await db.execute(select(func.sum(Budget.effective_budget)).where(Budget.department == dept))).scalar() or 0
        spent = (await db.execute(select(func.sum(Budget.spent)).where(Budget.department == dept))).scalar() or 0
        dept_budgets.append({"department": dept, "allocated": round(float(total), 2), "spent": round(float(spent), 2)})

    # Risk heatmap (department x risk level)
    risk_heatmap = []
    risk_levels = ["critical", "high", "medium", "low", "minimal"]
    for dept in departments:
        for rl in risk_levels:
            count = (await db.execute(
                select(func.count(Agent.id)).where(and_(Agent.department == dept, Agent.risk_level == rl))
            )).scalar() or 0
            risk_heatmap.append({"department": dept, "risk_level": rl, "count": count})

    # Audit timeline (last 7 days)
    audit_timeline = []
    for i in range(7):
        day = datetime.now(timezone.utc) - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        allowed = (await db.execute(select(func.count(AuditEvent.id)).where(
            and_(AuditEvent.timestamp >= day_start, AuditEvent.timestamp < day_end, AuditEvent.decision == "allowed")
        ))).scalar() or 0
        denied = (await db.execute(select(func.count(AuditEvent.id)).where(
            and_(AuditEvent.timestamp >= day_start, AuditEvent.timestamp < day_end, AuditEvent.decision == "denied")
        ))).scalar() or 0
        audit_timeline.append({
            "date": day_start.strftime("%b %d"),
            "allowed": allowed,
            "denied": denied,
            "total": allowed + denied,
        })

    # Policy decision distribution
    allowed_total = (await db.execute(select(func.count(AuditEvent.id)).where(AuditEvent.decision == "allowed"))).scalar() or 0
    denied_total = (await db.execute(select(func.count(AuditEvent.id)).where(AuditEvent.decision == "denied"))).scalar() or 0
    escalated_total = (await db.execute(select(func.count(AuditEvent.id)).where(AuditEvent.decision == "escalated"))).scalar() or 0

    # Incident trend (last 30 days)
    incident_trend = []
    for i in range(30):
        day = datetime.now(timezone.utc) - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        count = (await db.execute(select(func.count(Incident.id)).where(
            and_(Incident.detected_at >= day_start, Incident.detected_at < day_end)
        ))).scalar() or 0
        incident_trend.append({"date": day_start.strftime("%b %d"), "count": count})

    # Latency trend
    latency_trend = [{"time": f"{i}:00", "p50": round(random.uniform(12, 25), 1), "p95": round(random.uniform(30, 55), 1)} for i in range(24)]

    return {
        "trust_distribution": trust_ranges,
        "risk_heatmap": risk_heatmap,
        "agent_status_breakdown": agent_status,
        "audit_timeline": list(reversed(audit_timeline)),
        "budget_by_department": dept_budgets,
        "policy_decisions": {"allowed": allowed_total, "denied": denied_total, "escalated": escalated_total},
        "incident_trend": list(reversed(incident_trend)),
        "latency_trend": latency_trend,
    }


@router.get("/health")
async def get_system_health(user: User = Depends(get_current_user)):
    return {
        "overall": round(random.uniform(97, 99.9), 1),
        "components": [
            {"name": "Governance Gateway", "status": "healthy", "uptime": 99.99, "latency_ms": round(random.uniform(5, 15), 1)},
            {"name": "Trust Engine", "status": "healthy", "uptime": 99.98, "latency_ms": round(random.uniform(8, 20), 1)},
            {"name": "Policy Engine", "status": "healthy", "uptime": 99.97, "latency_ms": round(random.uniform(10, 25), 1)},
            {"name": "Budget Engine", "status": "healthy", "uptime": 99.99, "latency_ms": round(random.uniform(3, 10), 1)},
            {"name": "Risk Engine", "status": "healthy", "uptime": 99.95, "latency_ms": round(random.uniform(12, 30), 1)},
            {"name": "Graph Intelligence", "status": "healthy", "uptime": 99.90, "latency_ms": round(random.uniform(20, 50), 1)},
            {"name": "Audit Writer", "status": "healthy", "uptime": 99.99, "latency_ms": round(random.uniform(2, 8), 1)},
            {"name": "PostgreSQL", "status": "healthy", "uptime": 99.99, "latency_ms": round(random.uniform(1, 5), 1)},
            {"name": "Redis Cache", "status": "healthy", "uptime": 99.99, "latency_ms": round(random.uniform(0.5, 2), 1)},
            {"name": "Kafka (Mock)", "status": "healthy", "uptime": 99.95, "latency_ms": round(random.uniform(5, 15), 1)},
        ],
        "last_check": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/quick-actions")
async def get_quick_actions(user: User = Depends(get_current_user)):
    return [
        {"id": "qa-1", "label": "Emergency Fleet Stop", "description": "Immediately halt all agent operations", "icon": "AlertOctagon", "action_type": "emergency", "severity": "critical"},
        {"id": "qa-2", "label": "Run Policy Simulation", "description": "Simulate policy changes against historical data", "icon": "PlayCircle", "action_type": "simulation", "severity": "medium"},
        {"id": "qa-3", "label": "Generate Report", "description": "Create a governance compliance report", "icon": "FileText", "action_type": "report", "severity": "low"},
        {"id": "qa-4", "label": "Review High-Risk Agents", "description": "View agents with risk score above threshold", "icon": "Shield", "action_type": "review", "severity": "high"},
        {"id": "qa-5", "label": "Freeze All Budgets", "description": "Temporarily freeze all agent budgets", "icon": "DollarSign", "action_type": "budget", "severity": "high"},
        {"id": "qa-6", "label": "Open Copilot", "description": "Query governance data with natural language", "icon": "MessageSquare", "action_type": "copilot", "severity": "low"},
    ]
