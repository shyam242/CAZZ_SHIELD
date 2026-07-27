"""CAZZ SHIELD — Settings Router"""
from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.models.user import User
from app.config import settings

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("")
async def get_settings(user: User = Depends(get_current_user)):
    return {
        "app": {"name": settings.APP_NAME, "version": settings.APP_VERSION, "description": settings.APP_DESCRIPTION},
        "trust_engine": {
            "alpha": settings.TRUST_ALPHA, "beta": settings.TRUST_BETA,
            "gamma": settings.TRUST_GAMMA, "delta": settings.TRUST_DELTA,
            "decay_rate": settings.TRUST_DECAY_RATE, "min_observations": settings.TRUST_MIN_OBSERVATIONS,
            "default_score": settings.TRUST_DEFAULT,
        },
        "budget_engine": {
            "floor_multiplier": settings.BUDGET_FLOOR_MULTIPLIER,
            "ceiling_multiplier": settings.BUDGET_CEILING_MULTIPLIER,
        },
        "roles": ["admin", "operator", "auditor", "risk_officer", "ai_engineer", "security_admin"],
        "departments": [
            "Treasury Operations", "Payment Processing", "KYC & Compliance",
            "Fraud Investigation", "Loan Underwriting", "Regulatory Compliance",
            "Customer Support", "Investment Advisory", "Risk Management", "Internal Audit",
        ],
    }


@router.get("/roles")
async def get_roles(user: User = Depends(get_current_user)):
    return {
        "roles": [
            {"id": "admin", "name": "Administrator", "description": "Full system access", "permissions": ["all"]},
            {"id": "operator", "name": "Operator", "description": "Operational management", "permissions": ["read", "manage_agents", "manage_policies"]},
            {"id": "auditor", "name": "Auditor", "description": "Read-only audit access", "permissions": ["read", "export"]},
            {"id": "risk_officer", "name": "Risk Officer", "description": "Risk and trust management", "permissions": ["read", "manage_risk", "manage_trust"]},
            {"id": "ai_engineer", "name": "AI Engineer", "description": "Agent development and testing", "permissions": ["read", "manage_agents", "simulate"]},
            {"id": "security_admin", "name": "Security Admin", "description": "Security and compliance", "permissions": ["read", "manage_security", "emergency"]},
        ]
    }
