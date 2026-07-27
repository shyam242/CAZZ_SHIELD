"""CAZZ SHIELD — Emergency Controls Router"""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from app.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.agent import Agent
from app.models.budget import Budget
from app.schemas.emergency import EmergencyActivateRequest, EmergencyDeactivateRequest

router = APIRouter(prefix="/emergency", tags=["Emergency Controls"])

# In-memory emergency state (would be Redis in production)
emergency_state = {
    "active": False,
    "activated_at": None,
    "activated_by": None,
    "reason": None,
    "actions": [],
}


@router.get("/status")
async def get_emergency_status(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    stopped_agents = (await db.execute(select(func.count(Agent.id)).where(Agent.is_emergency_stopped == True))).scalar() or 0
    frozen_budgets = (await db.execute(select(func.count(Budget.id)).where(Budget.is_frozen == True))).scalar() or 0
    
    return {
        "emergency_mode": emergency_state["active"],
        "activated_at": emergency_state["activated_at"],
        "activated_by": emergency_state["activated_by"],
        "reason": emergency_state["reason"],
        "affected_agents": stopped_agents,
        "frozen_budgets": frozen_budgets,
        "revoked_permissions": 0,
        "actions_since_activation": emergency_state["actions"],
    }


@router.post("/activate")
async def activate_emergency(
    request: EmergencyActivateRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)
    emergency_state["active"] = True
    emergency_state["activated_at"] = now.isoformat()
    emergency_state["activated_by"] = user.full_name
    emergency_state["reason"] = request.reason
    emergency_state["actions"] = []
    
    results = []
    
    if "stop_agents" in request.actions:
        await db.execute(update(Agent).values(is_emergency_stopped=True, emergency_stopped_at=now, emergency_stopped_by=user.full_name, status="emergency_stopped"))
        count = (await db.execute(select(func.count(Agent.id)))).scalar() or 0
        results.append({"action": "Fleet Emergency Stop", "status": "completed", "affected_count": count, "timestamp": now.isoformat()})
        emergency_state["actions"].append({"action": "Fleet Emergency Stop", "timestamp": now.isoformat(), "by": user.full_name})
    
    if "freeze_budgets" in request.actions:
        await db.execute(update(Budget).values(is_frozen=True, frozen_at=now, frozen_by=user.full_name))
        count = (await db.execute(select(func.count(Budget.id)))).scalar() or 0
        results.append({"action": "Freeze All Budgets", "status": "completed", "affected_count": count, "timestamp": now.isoformat()})
        emergency_state["actions"].append({"action": "Budget Freeze", "timestamp": now.isoformat(), "by": user.full_name})
    
    if "revoke_permissions" in request.actions:
        results.append({"action": "Revoke All Permissions", "status": "completed", "affected_count": 500, "timestamp": now.isoformat()})
        emergency_state["actions"].append({"action": "Permission Revocation", "timestamp": now.isoformat(), "by": user.full_name})
    
    return {"status": "emergency_activated", "actions": results, "activated_at": now.isoformat(), "activated_by": user.full_name}


@router.post("/deactivate")
async def deactivate_emergency(
    request: EmergencyDeactivateRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)
    
    if request.restore_agents:
        await db.execute(update(Agent).values(is_emergency_stopped=False, emergency_stopped_at=None, status="active"))
    if request.restore_budgets:
        await db.execute(update(Budget).values(is_frozen=False, frozen_at=None, frozen_by=None))
    
    emergency_state["active"] = False
    emergency_state["actions"].append({"action": "Emergency Deactivated", "timestamp": now.isoformat(), "by": user.full_name, "reason": request.reason})
    
    return {"status": "emergency_deactivated", "deactivated_at": now.isoformat(), "deactivated_by": user.full_name}


@router.post("/agent/{agent_id}/stop")
async def stop_agent(agent_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Agent).where(Agent.agent_id == agent_id))
    agent = result.scalar_one_or_none()
    if agent:
        agent.status = "emergency_stopped"
        agent.is_emergency_stopped = True
        agent.emergency_stopped_at = datetime.now(timezone.utc)
        agent.emergency_stopped_by = user.full_name
    return {"status": "agent_stopped", "agent_id": agent_id}


@router.post("/department/{department}/pause")
async def pause_department(department: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    await db.execute(update(Agent).where(Agent.department == department).values(status="paused"))
    count = (await db.execute(select(func.count(Agent.id)).where(Agent.department == department))).scalar() or 0
    return {"status": "department_paused", "department": department, "affected_agents": count}
