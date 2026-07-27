"""
CAZZ SHIELD — Agents Router
Full CRUD + fleet operations for 2500+ AI agents
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.agent import Agent
from app.schemas.agent import AgentResponse, AgentListResponse

router = APIRouter(prefix="/agents", tags=["Agent Fleet"])


@router.get("", response_model=AgentListResponse)
async def list_agents(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    department: Optional[str] = None,
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    trust_min: Optional[float] = None,
    trust_max: Optional[float] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "trust_score",
    sort_order: Optional[str] = "desc",
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Agent)
    count_query = select(func.count(Agent.id))
    
    if department:
        query = query.where(Agent.department == department)
        count_query = count_query.where(Agent.department == department)
    if status:
        query = query.where(Agent.status == status)
        count_query = count_query.where(Agent.status == status)
    if risk_level:
        query = query.where(Agent.risk_level == risk_level)
        count_query = count_query.where(Agent.risk_level == risk_level)
    if trust_min is not None:
        query = query.where(Agent.trust_score >= trust_min)
        count_query = count_query.where(Agent.trust_score >= trust_min)
    if trust_max is not None:
        query = query.where(Agent.trust_score <= trust_max)
        count_query = count_query.where(Agent.trust_score <= trust_max)
    if search:
        search_filter = or_(
            Agent.name.ilike(f"%{search}%"),
            Agent.agent_id.ilike(f"%{search}%"),
            Agent.owner.ilike(f"%{search}%"),
            Agent.department.ilike(f"%{search}%"),
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)
    
    total = (await db.execute(count_query)).scalar() or 0
    
    sort_column = getattr(Agent, sort_by, Agent.trust_score)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())
    
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    agents = result.scalars().all()
    
    return AgentListResponse(
        agents=[AgentResponse(
            id=str(a.id), agent_id=a.agent_id, name=a.name, description=a.description,
            agent_class=a.agent_class, department=a.department, status=a.status.value if hasattr(a.status, 'value') else a.status,
            risk_level=a.risk_level, trust_score=a.trust_score, trust_confidence=a.trust_confidence,
            trust_observations=a.trust_observations, risk_score=a.risk_score,
            base_budget=a.base_budget, current_budget=a.current_budget, budget_spent=a.budget_spent,
            budget_window=a.budget_window, owner=a.owner, owner_email=a.owner_email,
            version=a.version, model_provider=a.model_provider, model_name=a.model_name,
            allowed_tools=a.allowed_tools, allowed_apis=a.allowed_apis,
            total_actions=a.total_actions, total_violations=a.total_violations,
            total_denials=a.total_denials, last_action_at=a.last_action_at,
            region=a.region, geography=a.geography, onboarded_at=a.onboarded_at,
            is_emergency_stopped=a.is_emergency_stopped, policy_ids=a.policy_ids,
        ) for a in agents],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    )


@router.get("/stats")
async def get_agent_stats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    total = (await db.execute(select(func.count(Agent.id)))).scalar() or 0
    
    dept_stats = []
    departments = ["Treasury Operations", "Payment Processing", "KYC & Compliance", "Fraud Investigation",
                    "Loan Underwriting", "Regulatory Compliance", "Customer Support", "Investment Advisory",
                    "Risk Management", "Internal Audit"]
    for dept in departments:
        count = (await db.execute(select(func.count(Agent.id)).where(Agent.department == dept))).scalar() or 0
        avg_trust = (await db.execute(select(func.avg(Agent.trust_score)).where(Agent.department == dept))).scalar() or 0
        avg_risk = (await db.execute(select(func.avg(Agent.risk_score)).where(Agent.department == dept))).scalar() or 0
        dept_stats.append({"department": dept, "count": count, "avg_trust": round(float(avg_trust), 3), "avg_risk": round(float(avg_risk), 3)})
    
    status_stats = {}
    for s in ["active", "paused", "quarantined", "suspended", "pending_review"]:
        count = (await db.execute(select(func.count(Agent.id)).where(Agent.status == s))).scalar() or 0
        status_stats[s] = count
    
    return {"total": total, "departments": dept_stats, "statuses": status_stats}


@router.get("/departments")
async def get_departments(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Agent.department, func.count(Agent.id)).group_by(Agent.department))
    return [{"department": row[0], "count": row[1]} for row in result.all()]


@router.get("/{agent_id}")
async def get_agent(agent_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Agent).where(Agent.agent_id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return AgentResponse(
        id=str(agent.id), agent_id=agent.agent_id, name=agent.name, description=agent.description,
        agent_class=agent.agent_class, department=agent.department,
        status=agent.status.value if hasattr(agent.status, 'value') else agent.status,
        risk_level=agent.risk_level, trust_score=agent.trust_score, trust_confidence=agent.trust_confidence,
        trust_observations=agent.trust_observations, risk_score=agent.risk_score,
        base_budget=agent.base_budget, current_budget=agent.current_budget, budget_spent=agent.budget_spent,
        budget_window=agent.budget_window, owner=agent.owner, owner_email=agent.owner_email,
        version=agent.version, model_provider=agent.model_provider, model_name=agent.model_name,
        allowed_tools=agent.allowed_tools, allowed_apis=agent.allowed_apis,
        total_actions=agent.total_actions, total_violations=agent.total_violations,
        total_denials=agent.total_denials, last_action_at=agent.last_action_at,
        region=agent.region, geography=agent.geography, onboarded_at=agent.onboarded_at,
        is_emergency_stopped=agent.is_emergency_stopped, policy_ids=agent.policy_ids,
    )


@router.patch("/{agent_id}/status")
async def update_agent_status(agent_id: str, status: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Agent).where(Agent.agent_id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent.status = status
    return {"message": f"Agent {agent_id} status updated to {status}"}
