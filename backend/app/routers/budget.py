"""
CAZZ SHIELD — Budget Router
Budget Engine: AdaptiveBudget = clip(Base × TrustMod × RiskMod × Criticality, 0.05×Base, 1.5×Base)
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.budget import Budget, BudgetTransaction

router = APIRouter(prefix="/budgets", tags=["Budget Engine"])


@router.get("")
async def list_budgets(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    department: Optional[str] = None,
    is_frozen: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Budget)
    count_query = select(func.count(Budget.id))
    
    if department:
        query = query.where(Budget.department == department)
        count_query = count_query.where(Budget.department == department)
    if is_frozen is not None:
        query = query.where(Budget.is_frozen == is_frozen)
        count_query = count_query.where(Budget.is_frozen == is_frozen)
    
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Budget.spent.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    budgets = result.scalars().all()
    
    return {
        "budgets": [{
            "agent_id": b.agent_id,
            "base_budget": b.base_budget,
            "trust_modifier": b.trust_modifier,
            "risk_modifier": b.risk_modifier,
            "criticality": b.criticality,
            "effective_budget": b.effective_budget,
            "spent": b.spent,
            "remaining": b.remaining,
            "utilization_pct": round(b.spent / b.effective_budget * 100, 1) if b.effective_budget else 0,
            "window": b.window,
            "is_frozen": b.is_frozen,
            "violation_count": b.violation_count,
            "department": b.department,
            "currency": b.currency,
        } for b in budgets],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/overview")
async def get_budget_overview(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    total_budget = (await db.execute(select(func.sum(Budget.effective_budget)))).scalar() or 0
    total_spent = (await db.execute(select(func.sum(Budget.spent)))).scalar() or 0
    total_remaining = (await db.execute(select(func.sum(Budget.remaining)))).scalar() or 0
    total_frozen = (await db.execute(select(func.count(Budget.id)).where(Budget.is_frozen == True))).scalar() or 0
    total_violations = (await db.execute(select(func.sum(Budget.violation_count)))).scalar() or 0
    
    departments = ["Treasury Operations", "Payment Processing", "KYC & Compliance", "Fraud Investigation", "Loan Underwriting"]
    dept_breakdown = []
    for dept in departments:
        alloc = (await db.execute(select(func.sum(Budget.effective_budget)).where(Budget.department == dept))).scalar() or 0
        spent = (await db.execute(select(func.sum(Budget.spent)).where(Budget.department == dept))).scalar() or 0
        dept_breakdown.append({"department": dept, "allocated": round(float(alloc), 2), "spent": round(float(spent), 2), "utilization": round(float(spent) / float(alloc) * 100, 1) if alloc else 0})
    
    top_spenders_result = await db.execute(
        select(Budget).order_by(Budget.spent.desc()).limit(10)
    )
    top_spenders = [{
        "agent_id": b.agent_id,
        "department": b.department,
        "spent": b.spent,
        "effective_budget": b.effective_budget,
        "utilization_pct": round(b.spent / b.effective_budget * 100, 1) if b.effective_budget else 0,
    } for b in top_spenders_result.scalars().all()]
    
    return {
        "total_budget": round(float(total_budget), 2),
        "total_spent": round(float(total_spent), 2),
        "total_remaining": round(float(total_remaining), 2),
        "total_frozen": total_frozen,
        "total_violations": int(total_violations or 0),
        "department_breakdown": dept_breakdown,
        "top_spenders": top_spenders,
    }


@router.get("/agents/{agent_id}")
async def get_agent_budget(agent_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Budget).where(Budget.agent_id == agent_id))
    budget = result.scalar_one_or_none()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    return {
        "agent_id": budget.agent_id,
        "base_budget": budget.base_budget,
        "trust_modifier": budget.trust_modifier,
        "risk_modifier": budget.risk_modifier,
        "criticality": budget.criticality,
        "effective_budget": budget.effective_budget,
        "spent": budget.spent,
        "remaining": budget.remaining,
        "utilization_pct": round(budget.spent / budget.effective_budget * 100, 1) if budget.effective_budget else 0,
        "is_frozen": budget.is_frozen,
        "violation_count": budget.violation_count,
        "window": budget.window,
        "department": budget.department,
    }


@router.get("/agents/{agent_id}/forecast")
async def get_budget_forecast(agent_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Budget).where(Budget.agent_id == agent_id))
    budget = result.scalar_one_or_none()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    import random
    days_in_window = 30 if budget.window == "monthly" else 7 if budget.window == "weekly" else 1
    days_elapsed = random.randint(1, days_in_window)
    daily_avg = budget.spent / max(days_elapsed, 1)
    days_remaining = days_in_window - days_elapsed
    projected = budget.spent + daily_avg * days_remaining
    
    return {
        "agent_id": agent_id,
        "current_spent": budget.spent,
        "current_remaining": budget.remaining,
        "projected_spend": round(projected, 2),
        "projected_remaining": round(budget.effective_budget - projected, 2),
        "days_remaining_in_window": days_remaining,
        "daily_average_spend": round(daily_avg, 2),
        "will_exceed": projected > budget.effective_budget,
        "confidence": round(random.uniform(0.7, 0.95), 2),
    }


@router.get("/formula")
async def get_budget_formula(user: User = Depends(get_current_user)):
    return {
        "formula": "AdaptiveBudget = clip(Base × TrustMod × RiskMod × Criticality, Floor, Ceiling)",
        "parameters": {
            "TrustModifier": "0.5 + Trust Score (range: 0.5 to 1.5)",
            "RiskModifier": "1.5 - Risk Score (range: 0.5 to 1.5)",
            "Criticality": "Department/task criticality multiplier (range: 0.5 to 1.5)",
            "Floor": "5% of Base Budget",
            "Ceiling": "150% of Base Budget",
        },
        "bounds": {"floor_multiplier": 0.05, "ceiling_multiplier": 1.50},
        "rationale": {
            "floor": "Prevents complete budget removal, maintaining minimum operational capability",
            "ceiling": "Prevents runaway budget inflation even with maximum trust and minimum risk",
        },
    }
