"""CAZZ SHIELD — Permissions Router"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.permission import Permission

router = APIRouter(prefix="/permissions", tags=["Permission Engine"])


@router.get("")
async def list_permissions(
    page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=100),
    permission_type: Optional[str] = None, scope: Optional[str] = None,
    agent_id: Optional[str] = None, department: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user),
):
    query = select(Permission)
    count_query = select(func.count(Permission.id))
    
    if permission_type:
        query = query.where(Permission.permission_type == permission_type)
        count_query = count_query.where(Permission.permission_type == permission_type)
    if scope:
        query = query.where(Permission.scope == scope)
        count_query = count_query.where(Permission.scope == scope)
    if agent_id:
        query = query.where(Permission.agent_id == agent_id)
        count_query = count_query.where(Permission.agent_id == agent_id)
    if department:
        query = query.where(Permission.department == department)
        count_query = count_query.where(Permission.department == department)
    if search:
        sf = or_(Permission.name.ilike(f"%{search}%"), Permission.resource.ilike(f"%{search}%"))
        query = query.where(sf)
        count_query = count_query.where(sf)
    
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Permission.priority.asc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    perms = result.scalars().all()
    
    return {
        "permissions": [{
            "id": str(p.id), "permission_id": p.permission_id, "name": p.name,
            "description": p.description, "permission_type": p.permission_type.value if hasattr(p.permission_type, 'value') else p.permission_type,
            "scope": p.scope, "resource": p.resource, "agent_id": p.agent_id,
            "department": p.department, "agent_class": p.agent_class,
            "conditions": p.conditions, "is_active": p.is_active, "priority": p.priority,
            "created_by": p.created_by,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "expires_at": p.expires_at.isoformat() if p.expires_at else None,
        } for p in perms],
        "total": total, "page": page, "page_size": page_size,
    }


@router.get("/stats")
async def get_permission_stats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    total = (await db.execute(select(func.count(Permission.id)))).scalar() or 0
    allow_count = (await db.execute(select(func.count(Permission.id)).where(Permission.permission_type == "allow"))).scalar() or 0
    deny_count = (await db.execute(select(func.count(Permission.id)).where(Permission.permission_type == "deny"))).scalar() or 0
    conditional_count = (await db.execute(select(func.count(Permission.id)).where(Permission.permission_type == "conditional"))).scalar() or 0
    active_count = (await db.execute(select(func.count(Permission.id)).where(Permission.is_active == True))).scalar() or 0
    
    return {
        "total": total, "allow": allow_count, "deny": deny_count,
        "conditional": conditional_count, "active": active_count,
        "inactive": total - active_count,
    }
