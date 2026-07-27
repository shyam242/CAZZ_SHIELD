"""
CAZZ SHIELD — Approval Queue Router
Human-in-the-Loop Trust Approval Queue for agent actions requiring human sign-off
"""
from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from pydantic import BaseModel
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.approval_queue import ApprovalQueue, ApprovalStatus
from app.models.agent import Agent
from app.models.trust import TrustEvent
from app.config import settings

router = APIRouter(prefix="/approvals", tags=["Approval Queue"])


class ApprovalRequest(BaseModel):
    request_id: str
    agent_id: str
    agent_name: str
    requested_operation: str
    trust_before: float
    priority: str = "medium"
    action_id: Optional[str] = None
    policy_id: Optional[str] = None


class ApprovalAction(BaseModel):
    approved: bool
    rejection_reason: Optional[str] = None


@router.get("/queue")
async def list_approval_queue(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """List all approval requests with optional filters"""
    query = select(ApprovalQueue)
    count_query = select(ApprovalQueue.id)
    
    if status:
        try:
            status_enum = ApprovalStatus(status)
            query = query.where(ApprovalQueue.status == status_enum)
            count_query = count_query.where(ApprovalQueue.status == status_enum)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status}")
    
    if priority:
        query = query.where(ApprovalQueue.priority == priority)
        count_query = count_query.where(ApprovalQueue.priority == priority)
    
    # Exclude expired requests
    query = query.where(
        or_(
            ApprovalQueue.expires_at.is_(None),
            ApprovalQueue.expires_at > datetime.utcnow()
        )
    )
    count_query = count_query.where(
        or_(
            ApprovalQueue.expires_at.is_(None),
            ApprovalQueue.expires_at > datetime.utcnow()
        )
    )
    
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(ApprovalQueue.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    approvals = result.scalars().all()
    
    return {
        "approvals": [{
            "id": str(a.id),
            "request_id": a.request_id,
            "agent_id": a.agent_id,
            "agent_name": a.agent_name,
            "requested_operation": a.requested_operation,
            "trust_before": a.trust_before,
            "trust_after": a.trust_after,
            "confidence_before": a.confidence_before,
            "confidence_after": a.confidence_after,
            "status": a.status.value,
            "priority": a.priority,
            "requested_by": a.requested_by,
            "approved_by": a.approved_by,
            "rejection_reason": a.rejection_reason,
            "action_id": a.action_id,
            "policy_id": a.policy_id,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "reviewed_at": a.reviewed_at.isoformat() if a.reviewed_at else None,
            "expires_at": a.expires_at.isoformat() if a.expires_at else None,
            "time_ago": _time_ago(a.created_at) if a.created_at else None,
        } for a in approvals],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("/queue")
async def create_approval_request(
    request: ApprovalRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Create a new approval request (typically called by system on escalation)"""
    # Check if request_id already exists
    existing = await db.execute(
        select(ApprovalQueue).where(ApprovalQueue.request_id == request.request_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Request ID already exists")
    
    # Verify agent exists
    agent_result = await db.execute(
        select(Agent).where(Agent.agent_id == request.agent_id)
    )
    agent = agent_result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Set expiration time (24 hours from now)
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    approval = ApprovalQueue(
        request_id=request.request_id,
        agent_id=request.agent_id,
        agent_name=request.agent_name,
        requested_operation=request.requested_operation,
        trust_before=request.trust_before,
        confidence_before=agent.trust_confidence,
        status=ApprovalStatus.PENDING,
        priority=request.priority,
        requested_by="system",
        action_id=request.action_id,
        policy_id=request.policy_id,
        expires_at=expires_at,
    )
    
    db.add(approval)
    await db.commit()
    await db.refresh(approval)
    
    return {
        "id": str(approval.id),
        "request_id": approval.request_id,
        "status": approval.status.value,
        "message": "Approval request created successfully",
    }


@router.post("/queue/{request_id}/action")
async def process_approval_action(
    request_id: str,
    action: ApprovalAction,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Approve or reject an approval request"""
    result = await db.execute(
        select(ApprovalQueue).where(ApprovalQueue.request_id == request_id)
    )
    approval = result.scalar_one_or_none()
    
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    if approval.status != ApprovalStatus.PENDING:
        raise HTTPException(status_code=400, detail=f"Request already {approval.status.value}")
    
    # Check if expired
    if approval.expires_at and approval.expires_at < datetime.utcnow():
        approval.status = ApprovalStatus.EXPIRED
        await db.commit()
        raise HTTPException(status_code=400, detail="Request has expired")
    
    if action.approved:
        # Approve - update trust score with beta boost
        approval.status = ApprovalStatus.APPROVED
        approval.approved_by = user.email or user.username
        approval.reviewed_at = datetime.utcnow()
        
        # Calculate trust boost using beta parameter
        trust_boost = settings.TRUST_BETA
        approval.trust_after = round(min(1.0, approval.trust_before + trust_boost), 4)
        
        # Update agent's trust score
        agent_result = await db.execute(
            select(Agent).where(Agent.agent_id == approval.agent_id)
        )
        agent = agent_result.scalar_one_or_none()
        if agent:
            agent.trust_score = approval.trust_after
            agent.trust_observations += 1
            agent.trust_confidence = min(1.0, agent.trust_observations / 30)
            
            # Log trust event
            trust_event = TrustEvent(
                agent_id=approval.agent_id,
                event_type="human_approval",
                trust_before=approval.trust_before,
                trust_after=approval.trust_after,
                confidence_before=approval.confidence_before,
                confidence_after=agent.trust_confidence,
                delta=trust_boost,
                description=f"Human approval for request {request_id}: {approval.requested_operation}",
                action_id=approval.action_id,
                policy_id=approval.policy_id,
                triggered_by=user.email or user.username,
            )
            db.add(trust_event)
    else:
        # Reject
        approval.status = ApprovalStatus.REJECTED
        approval.approved_by = user.email or user.username
        approval.rejection_reason = action.rejection_reason
        approval.reviewed_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(approval)
    
    return {
        "request_id": approval.request_id,
        "status": approval.status.value,
        "trust_before": approval.trust_before,
        "trust_after": approval.trust_after,
        "message": f"Request {action.approved and 'approved' or 'rejected'} successfully",
    }


@router.get("/queue/{request_id}")
async def get_approval_request(
    request_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get details of a specific approval request"""
    result = await db.execute(
        select(ApprovalQueue).where(ApprovalQueue.request_id == request_id)
    )
    approval = result.scalar_one_or_none()
    
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    return {
        "id": str(approval.id),
        "request_id": approval.request_id,
        "agent_id": approval.agent_id,
        "agent_name": approval.agent_name,
        "requested_operation": approval.requested_operation,
        "trust_before": approval.trust_before,
        "trust_after": approval.trust_after,
        "confidence_before": approval.confidence_before,
        "confidence_after": approval.confidence_after,
        "status": approval.status.value,
        "priority": approval.priority,
        "requested_by": approval.requested_by,
        "approved_by": approval.approved_by,
        "rejection_reason": approval.rejection_reason,
        "action_id": approval.action_id,
        "policy_id": approval.policy_id,
        "created_at": approval.created_at.isoformat() if approval.created_at else None,
        "reviewed_at": approval.reviewed_at.isoformat() if approval.reviewed_at else None,
        "expires_at": approval.expires_at.isoformat() if approval.expires_at else None,
    }


@router.get("/stats")
async def get_approval_stats(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get approval queue statistics"""
    total = (await db.execute(select(ApprovalQueue.id))).scalar() or 0
    pending = (await db.execute(
        select(ApprovalQueue.id).where(ApprovalQueue.status == ApprovalStatus.PENDING)
    )).scalar() or 0
    approved = (await db.execute(
        select(ApprovalQueue.id).where(ApprovalQueue.status == ApprovalStatus.APPROVED)
    )).scalar() or 0
    rejected = (await db.execute(
        select(ApprovalQueue.id).where(ApprovalQueue.status == ApprovalStatus.REJECTED)
    )).scalar() or 0
    
    # Calculate average time to approval
    approved_result = await db.execute(
        select(ApprovalQueue).where(ApprovalQueue.status == ApprovalStatus.APPROVED)
    )
    approved_items = approved_result.scalars().all()
    
    if approved_items:
        avg_time_seconds = sum(
            (a.reviewed_at - a.created_at).total_seconds()
            for a in approved_items if a.reviewed_at and a.created_at
        ) / len(approved_items)
        avg_time_minutes = round(avg_time_seconds / 60, 2)
    else:
        avg_time_minutes = 0
    
    return {
        "total_requests": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "approval_rate": round(approved / total * 100, 1) if total > 0 else 0,
        "avg_approval_time_minutes": avg_time_minutes,
    }


def _time_ago(dt: datetime) -> str:
    """Format datetime as 'X ago' string"""
    if not dt:
        return "Unknown"
    
    delta = datetime.utcnow() - dt
    seconds = int(delta.total_seconds())
    
    if seconds < 60:
        return f"{seconds}s ago"
    elif seconds < 3600:
        return f"{seconds // 60}m ago"
    elif seconds < 86400:
        return f"{seconds // 3600}h ago"
    else:
        return f"{seconds // 86400}d ago"
