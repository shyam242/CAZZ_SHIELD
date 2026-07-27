"""CAZZ SHIELD — Incidents Router"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.incident import Incident

router = APIRouter(prefix="/incidents", tags=["Incident Center"])


@router.get("")
async def list_incidents(
    page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=100),
    severity: Optional[str] = None, status: Optional[str] = None,
    incident_type: Optional[str] = None, department: Optional[str] = None,
    db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user),
):
    query = select(Incident)
    count_query = select(func.count(Incident.id))
    
    if severity:
        query = query.where(Incident.severity == severity)
        count_query = count_query.where(Incident.severity == severity)
    if status:
        query = query.where(Incident.status == status)
        count_query = count_query.where(Incident.status == status)
    if incident_type:
        query = query.where(Incident.incident_type == incident_type)
        count_query = count_query.where(Incident.incident_type == incident_type)
    if department:
        query = query.where(Incident.department == department)
        count_query = count_query.where(Incident.department == department)
    
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Incident.detected_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    incidents = result.scalars().all()
    
    return {
        "incidents": [{
            "id": str(i.id), "incident_id": i.incident_id, "title": i.title,
            "description": i.description, "incident_type": i.incident_type,
            "severity": i.severity.value if hasattr(i.severity, 'value') else i.severity,
            "status": i.status.value if hasattr(i.status, 'value') else i.status,
            "agent_ids": i.agent_ids, "department": i.department,
            "affected_systems": i.affected_systems, "assigned_to": i.assigned_to,
            "resolution": i.resolution, "root_cause": i.root_cause,
            "actions_taken": i.actions_taken,
            "detection_time_ms": i.detection_time_ms,
            "containment_time_ms": i.containment_time_ms,
            "detected_at": i.detected_at.isoformat() if i.detected_at else None,
            "contained_at": i.contained_at.isoformat() if i.contained_at else None,
            "resolved_at": i.resolved_at.isoformat() if i.resolved_at else None,
            "created_at": i.created_at.isoformat() if i.created_at else None,
        } for i in incidents],
        "total": total, "page": page, "page_size": page_size,
    }


@router.get("/stats")
async def get_incident_stats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    total = (await db.execute(select(func.count(Incident.id)))).scalar() or 0
    open_count = (await db.execute(select(func.count(Incident.id)).where(Incident.status.in_(["open", "investigating"])))).scalar() or 0
    critical = (await db.execute(select(func.count(Incident.id)).where(Incident.severity == "critical"))).scalar() or 0
    resolved = (await db.execute(select(func.count(Incident.id)).where(Incident.status.in_(["resolved", "closed"])))).scalar() or 0
    avg_detection = (await db.execute(select(func.avg(Incident.detection_time_ms)))).scalar() or 0
    
    return {
        "total": total, "open": open_count, "critical": critical,
        "resolved": resolved, "avg_detection_ms": round(float(avg_detection), 0),
    }


@router.get("/{incident_id}")
async def get_incident(incident_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Incident).where(Incident.incident_id == incident_id))
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {
        "id": str(incident.id), "incident_id": incident.incident_id, "title": incident.title,
        "description": incident.description, "incident_type": incident.incident_type,
        "severity": incident.severity.value if hasattr(incident.severity, 'value') else incident.severity,
        "status": incident.status.value if hasattr(incident.status, 'value') else incident.status,
        "agent_ids": incident.agent_ids, "department": incident.department,
        "affected_systems": incident.affected_systems, "assigned_to": incident.assigned_to,
        "resolution": incident.resolution, "root_cause": incident.root_cause,
        "actions_taken": incident.actions_taken,
        "detection_time_ms": incident.detection_time_ms,
        "containment_time_ms": incident.containment_time_ms,
        "resolution_time_ms": incident.resolution_time_ms,
        "detected_at": incident.detected_at.isoformat() if incident.detected_at else None,
        "contained_at": incident.contained_at.isoformat() if incident.contained_at else None,
        "resolved_at": incident.resolved_at.isoformat() if incident.resolved_at else None,
        "created_at": incident.created_at.isoformat() if incident.created_at else None,
    }
