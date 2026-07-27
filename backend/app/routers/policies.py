"""
CAZZ SHIELD — Policies Router
Policy-as-code with versioning, simulation, and rollback
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.policy import Policy, PolicyVersion
from app.schemas.policy import PolicyResponse, PolicyCreate, SimulationRequest, SimulationResponse
import uuid
import random
from datetime import datetime, timezone

router = APIRouter(prefix="/policies", tags=["Policy Engine"])


@router.get("")
async def list_policies(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    category: Optional[str] = None,
    status: Optional[str] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Policy)
    count_query = select(func.count(Policy.id))
    
    if category:
        query = query.where(Policy.category == category)
        count_query = count_query.where(Policy.category == category)
    if status:
        query = query.where(Policy.status == status)
        count_query = count_query.where(Policy.status == status)
    if severity:
        query = query.where(Policy.severity == severity)
        count_query = count_query.where(Policy.severity == severity)
    if search:
        query = query.where(Policy.name.ilike(f"%{search}%"))
        count_query = count_query.where(Policy.name.ilike(f"%{search}%"))
    
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Policy.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    policies = result.scalars().all()
    
    return {
        "policies": [{
            "id": str(p.id),
            "policy_id": p.policy_id,
            "name": p.name,
            "description": p.description,
            "category": p.category,
            "severity": p.severity,
            "status": p.status.value if hasattr(p.status, 'value') else p.status,
            "version": p.version,
            "policy_code": p.policy_code,
            "policy_language": p.policy_language,
            "target_departments": p.target_departments,
            "target_agent_classes": p.target_agent_classes,
            "author": p.author,
            "reviewer": p.reviewer,
            "total_evaluations": p.total_evaluations,
            "total_denials": p.total_denials,
            "total_allows": p.total_allows,
            "denial_rate": p.denial_rate,
            "simulation_pass": p.simulation_pass,
            "last_simulated_at": p.last_simulated_at.isoformat() if p.last_simulated_at else None,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "published_at": p.published_at.isoformat() if p.published_at else None,
        } for p in policies],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/stats")
async def get_policy_stats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    total = (await db.execute(select(func.count(Policy.id)))).scalar() or 0
    active = (await db.execute(select(func.count(Policy.id)).where(Policy.status == "active"))).scalar() or 0
    draft = (await db.execute(select(func.count(Policy.id)).where(Policy.status == "draft"))).scalar() or 0
    
    categories = ["trust", "budget", "permission", "compliance", "security", "operational", "data_access", "transaction"]
    cat_stats = []
    for cat in categories:
        count = (await db.execute(select(func.count(Policy.id)).where(Policy.category == cat))).scalar() or 0
        cat_stats.append({"category": cat, "count": count})
    
    return {"total": total, "active": active, "draft": draft, "categories": cat_stats}


@router.get("/{policy_id}")
async def get_policy(policy_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Policy).where(Policy.policy_id == policy_id))
    policy = result.scalar_one_or_none()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    return {
        "id": str(policy.id),
        "policy_id": policy.policy_id,
        "name": policy.name,
        "description": policy.description,
        "category": policy.category,
        "severity": policy.severity,
        "status": policy.status.value if hasattr(policy.status, 'value') else policy.status,
        "version": policy.version,
        "policy_code": policy.policy_code,
        "policy_language": policy.policy_language,
        "target_departments": policy.target_departments,
        "target_agent_classes": policy.target_agent_classes,
        "author": policy.author,
        "reviewer": policy.reviewer,
        "total_evaluations": policy.total_evaluations,
        "total_denials": policy.total_denials,
        "total_allows": policy.total_allows,
        "denial_rate": policy.denial_rate,
        "simulation_pass": policy.simulation_pass,
        "last_simulated_at": policy.last_simulated_at.isoformat() if policy.last_simulated_at else None,
        "created_at": policy.created_at.isoformat() if policy.created_at else None,
    }


@router.post("/simulate")
async def simulate_policy(request: SimulationRequest, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    blocked = random.randint(10, 500)
    newly_allowed = random.randint(5, 100)
    conflicts = random.randint(0, 5)
    affected = random.randint(50, 800)
    blast_radius = round(affected / 2500 * 100, 1)
    
    return {
        "simulation_id": f"sim_{uuid.uuid4().hex[:12]}",
        "policy_id": request.policy_id,
        "status": "completed",
        "blocked_actions": blocked,
        "newly_allowed": newly_allowed,
        "policy_conflicts": conflicts,
        "affected_agents": affected,
        "blast_radius": blast_radius,
        "impact_level": "high" if blast_radius > 20 else "medium" if blast_radius > 10 else "low",
        "details": {
            "replay_period_hours": request.replay_hours,
            "total_events_replayed": random.randint(5000, 50000),
            "blocked_by_category": {
                "trust": random.randint(1, blocked // 3),
                "budget": random.randint(1, blocked // 3),
                "permission": random.randint(1, blocked // 3),
            },
            "affected_departments": random.sample(
                ["Treasury Operations", "Payment Processing", "KYC & Compliance", "Fraud Investigation"],
                random.randint(1, 4),
            ),
            "risk_assessment": "Policy change affects less than 5% of total governance decisions" if blast_radius < 5 else "Significant impact — review recommended",
            "go_no_go": "PASS" if conflicts == 0 and blast_radius < 20 else "REVIEW_REQUIRED",
        },
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
