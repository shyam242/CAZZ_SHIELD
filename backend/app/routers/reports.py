"""CAZZ SHIELD — Reports Router"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.report import GovernanceReport

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("")
async def list_reports(
    page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=100),
    report_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user),
):
    query = select(GovernanceReport)
    count_query = select(func.count(GovernanceReport.id))
    
    if report_type:
        query = query.where(GovernanceReport.report_type == report_type)
        count_query = count_query.where(GovernanceReport.report_type == report_type)
    
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(GovernanceReport.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    reports = result.scalars().all()
    
    return {
        "reports": [{
            "id": str(r.id), "report_id": r.report_id, "title": r.title,
            "report_type": r.report_type.value if hasattr(r.report_type, 'value') else r.report_type,
            "status": r.status.value if hasattr(r.status, 'value') else r.status,
            "summary": r.summary, "metrics": r.metrics, "findings": r.findings,
            "recommendations": r.recommendations,
            "period_start": r.period_start.isoformat() if r.period_start else None,
            "period_end": r.period_end.isoformat() if r.period_end else None,
            "departments_covered": r.departments_covered,
            "total_events": r.total_events, "total_incidents": r.total_incidents,
            "total_violations": r.total_violations, "compliance_score": r.compliance_score,
            "generated_by": r.generated_by,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        } for r in reports],
        "total": total,
    }


@router.get("/{report_id}")
async def get_report(report_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(GovernanceReport).where(GovernanceReport.report_id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Report not found")
    return {
        "id": str(report.id), "report_id": report.report_id, "title": report.title,
        "report_type": report.report_type.value if hasattr(report.report_type, 'value') else report.report_type,
        "status": report.status.value if hasattr(report.status, 'value') else report.status,
        "summary": report.summary, "metrics": report.metrics, "findings": report.findings,
        "recommendations": report.recommendations,
        "period_start": report.period_start.isoformat() if report.period_start else None,
        "period_end": report.period_end.isoformat() if report.period_end else None,
        "departments_covered": report.departments_covered,
        "total_events": report.total_events, "total_incidents": report.total_incidents,
        "total_violations": report.total_violations, "compliance_score": report.compliance_score,
        "generated_by": report.generated_by,
        "created_at": report.created_at.isoformat() if report.created_at else None,
    }
