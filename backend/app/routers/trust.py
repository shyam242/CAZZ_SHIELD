"""
CAZZ SHIELD — Trust Router
Trust Engine: Trust(t+1) = clip(Trust(t) + α·S(t) + β·H(t) − γ·V(t) − δ·A(t), 0, 1)
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.agent import Agent
from app.models.trust import TrustScore, TrustEvent

router = APIRouter(prefix="/trust", tags=["Trust Engine"])


@router.get("/scores")
async def list_trust_scores(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    department: Optional[str] = None,
    min_score: Optional[float] = None,
    max_score: Optional[float] = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Agent)
    count_query = select(func.count(Agent.id))
    
    if department:
        query = query.where(Agent.department == department)
        count_query = count_query.where(Agent.department == department)
    if min_score is not None:
        query = query.where(Agent.trust_score >= min_score)
        count_query = count_query.where(Agent.trust_score >= min_score)
    if max_score is not None:
        query = query.where(Agent.trust_score <= max_score)
        count_query = count_query.where(Agent.trust_score <= max_score)
    
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Agent.trust_score.asc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    agents = result.scalars().all()
    
    return {
        "scores": [{
            "agent_id": a.agent_id,
            "name": a.name,
            "department": a.department,
            "score": a.trust_score,
            "confidence": a.trust_confidence,
            "observations": a.trust_observations,
            "risk_score": a.risk_score,
            "status": a.status.value if hasattr(a.status, 'value') else a.status,
            "trend": "improving" if a.trust_score > 0.6 else "declining" if a.trust_score < 0.4 else "stable",
        } for a in agents],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/distribution")
async def get_trust_distribution(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    ranges = []
    bounds = [(0, 0.2, "Critical"), (0.2, 0.4, "Low"), (0.4, 0.6, "Medium"), (0.6, 0.8, "High"), (0.8, 1.01, "Excellent")]
    
    total = (await db.execute(select(func.count(Agent.id)))).scalar() or 1
    avg = (await db.execute(select(func.avg(Agent.trust_score)))).scalar() or 0
    
    for low, high, label in bounds:
        count = (await db.execute(
            select(func.count(Agent.id)).where(and_(Agent.trust_score >= low, Agent.trust_score < high))
        )).scalar() or 0
        ranges.append({"range": f"{low:.1f} - {high:.1f}", "label": label, "count": count, "percentage": round(count / total * 100, 1)})
    
    return {"ranges": ranges, "total_agents": total, "average_trust": round(float(avg), 4), "median_trust": 0.65}


@router.get("/agents/{agent_id}")
async def get_agent_trust(agent_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Agent).where(Agent.agent_id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return {
        "agent_id": agent.agent_id,
        "name": agent.name,
        "score": agent.trust_score,
        "confidence": agent.trust_confidence,
        "observations": agent.trust_observations,
        "trend": "improving" if agent.trust_score > 0.6 else "declining" if agent.trust_score < 0.4 else "stable",
        "last_updated": agent.updated_at.isoformat() if agent.updated_at else None,
    }


@router.get("/agents/{agent_id}/history")
async def get_agent_trust_history(
    agent_id: str,
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(TrustScore)
        .where(TrustScore.agent_id == agent_id)
        .order_by(TrustScore.recorded_at.desc())
        .limit(limit)
    )
    records = result.scalars().all()
    
    return {
        "agent_id": agent_id,
        "records": [{
            "score": r.score,
            "previous_score": r.previous_score,
            "confidence": r.confidence,
            "delta": r.delta,
            "event_type": r.event_type,
            "reason": r.reason,
            "recorded_at": r.recorded_at.isoformat() if r.recorded_at else None,
        } for r in reversed(list(records))],
        "total": len(records),
    }


@router.get("/formula")
async def get_trust_formula(user: User = Depends(get_current_user)):
    return {
        "formula": "Trust(t+1) = clip(Trust(t) + α·S(t) + β·H(t) − γ·V(t) − δ·A(t), 0, 1)",
        "confidence": "C(t) = min(1, N(t) / N_min)",
        "parameters": {
            "alpha": {"value": 0.05, "description": "Success weight — reward for successful compliant actions"},
            "beta": {"value": 0.03, "description": "Human approval weight — reward for human-approved escalations"},
            "gamma": {"value": 0.15, "description": "Violation penalty — penalty for policy/budget violations"},
            "delta": {"value": 0.08, "description": "Anomaly penalty — penalty for detected anomalous behavior"},
            "decay_rate": {"value": 0.001, "description": "Time-based decay per hour of inactivity"},
            "N_min": {"value": 30, "description": "Minimum observations before trust score is considered reliable"},
        },
        "bounds": {"min": 0.0, "max": 1.0},
        "initial_score": 0.50,
    }
