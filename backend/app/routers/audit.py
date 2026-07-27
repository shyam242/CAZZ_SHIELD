"""CAZZ SHIELD — Audit Router — Hash-chained audit log search and export"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from datetime import datetime, timezone
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.audit import AuditEvent

router = APIRouter(prefix="/audit", tags=["Audit Explorer"])


@router.get("/events")
async def list_audit_events(
    page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=100),
    agent_id: Optional[str] = None, decision: Optional[str] = None,
    category: Optional[str] = None, severity: Optional[str] = None,
    department: Optional[str] = None, search: Optional[str] = None,
    date_from: Optional[str] = None, date_to: Optional[str] = None,
    db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user),
):
    query = select(AuditEvent)
    count_query = select(func.count(AuditEvent.id))
    
    if agent_id:
        query = query.where(AuditEvent.agent_id == agent_id)
        count_query = count_query.where(AuditEvent.agent_id == agent_id)
    if decision:
        query = query.where(AuditEvent.decision == decision)
        count_query = count_query.where(AuditEvent.decision == decision)
    if severity:
        query = query.where(AuditEvent.severity == severity)
        count_query = count_query.where(AuditEvent.severity == severity)
    if department:
        query = query.where(AuditEvent.department == department)
        count_query = count_query.where(AuditEvent.department == department)
    if search:
        sf = or_(AuditEvent.action.ilike(f"%{search}%"), AuditEvent.agent_id.ilike(f"%{search}%"), AuditEvent.event_id.ilike(f"%{search}%"))
        query = query.where(sf)
        count_query = count_query.where(sf)
    if date_from:
        dt = datetime.fromisoformat(date_from)
        query = query.where(AuditEvent.timestamp >= dt)
        count_query = count_query.where(AuditEvent.timestamp >= dt)
    if date_to:
        dt = datetime.fromisoformat(date_to)
        query = query.where(AuditEvent.timestamp <= dt)
        count_query = count_query.where(AuditEvent.timestamp <= dt)
    
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(AuditEvent.timestamp.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    events = result.scalars().all()
    
    return {
        "events": [{
            "id": str(e.id), "event_id": e.event_id, "agent_id": e.agent_id,
            "agent_name": e.agent_name, "department": e.department, "action": e.action,
            "action_category": e.action_category, "resource": e.resource,
            "decision": e.decision.value if hasattr(e.decision, 'value') else e.decision,
            "category": e.category, "policy_matched": e.policy_matched,
            "policy_rule": e.policy_rule, "trust_score": e.trust_score,
            "risk_score": e.risk_score, "budget_status": e.budget_status,
            "budget_remaining": e.budget_remaining, "decision_path": e.decision_path,
            "operator": e.operator, "operator_type": e.operator_type,
            "severity": e.severity, "record_hash": e.record_hash,
            "prev_hash": e.prev_hash, "sequence_number": e.sequence_number,
            "timestamp": e.timestamp.isoformat() if e.timestamp else None,
        } for e in events],
        "total": total, "page": page, "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }


@router.get("/events/{event_id}")
async def get_audit_event(event_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(AuditEvent).where(AuditEvent.event_id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Audit event not found")
    return {
        "id": str(event.id), "event_id": event.event_id, "agent_id": event.agent_id,
        "agent_name": event.agent_name, "department": event.department, "action": event.action,
        "decision": event.decision.value if hasattr(event.decision, 'value') else event.decision,
        "policy_matched": event.policy_matched, "trust_score": event.trust_score,
        "risk_score": event.risk_score, "budget_status": event.budget_status,
        "decision_path": event.decision_path, "operator": event.operator,
        "severity": event.severity, "record_hash": event.record_hash,
        "prev_hash": event.prev_hash, "sequence_number": event.sequence_number,
        "timestamp": event.timestamp.isoformat() if event.timestamp else None,
    }


@router.get("/stats")
async def get_audit_stats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    total = (await db.execute(select(func.count(AuditEvent.id)))).scalar() or 0
    allowed = (await db.execute(select(func.count(AuditEvent.id)).where(AuditEvent.decision == "allowed"))).scalar() or 0
    denied = (await db.execute(select(func.count(AuditEvent.id)).where(AuditEvent.decision == "denied"))).scalar() or 0
    escalated = (await db.execute(select(func.count(AuditEvent.id)).where(AuditEvent.decision == "escalated"))).scalar() or 0
    
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_count = (await db.execute(select(func.count(AuditEvent.id)).where(AuditEvent.timestamp >= today))).scalar() or 0
    
    return {
        "total_events": total, "total_allowed": allowed, "total_denied": denied,
        "total_escalated": escalated, "denial_rate": round(denied / total * 100, 1) if total else 0,
        "events_today": today_count,
        "decision_distribution": {"allowed": allowed, "denied": denied, "escalated": escalated},
    }
