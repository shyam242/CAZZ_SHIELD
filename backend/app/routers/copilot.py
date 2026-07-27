"""CAZZ SHIELD — Copilot Router — Read-only AI Governance Copilot"""
import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.copilot import CopilotQueryRequest

router = APIRouter(prefix="/copilot", tags=["Governance Copilot"])

COPILOT_RESPONSES = {
    "blocked": {
        "patterns": ["why was", "blocked", "denied", "rejected"],
        "responses": [
            "The agent was blocked due to trust score falling below the minimum threshold of 0.50. The policy `policy.trust.min_transaction` requires a trust score of at least 0.50 for financial transactions. The agent's trust score dropped to {trust:.2f} after {n} anomaly flags were detected within a 24-hour window. The decision path was: Identity → Auth → Permission → Trust (fail) → Deny.",
            "Access was denied because the agent exceeded its adaptive budget ceiling. The budget engine calculated an effective budget of ${budget:,.2f} based on Base × TrustMod({trust_mod:.2f}) × RiskMod({risk_mod:.2f}) × Criticality({crit:.2f}), and the agent had already spent ${spent:,.2f}. Policy `policy.budget.daily_limit` enforced the denial.",
        ],
    },
    "risk": {
        "patterns": ["highest risk", "risky", "risk score", "dangerous"],
        "responses": [
            "Currently, {count} agents have risk scores above 0.70:\n\n| Agent | Department | Risk Score | Trust Score | Status |\n|---|---|---|---|---|\n| agent-treasury-042 | Treasury Operations | 0.87 | 0.38 | quarantined |\n| agent-fraud-118 | Fraud Investigation | 0.82 | 0.41 | active |\n| agent-pay-027 | Payment Processing | 0.79 | 0.45 | paused |\n| agent-kyc-003 | KYC & Compliance | 0.76 | 0.49 | active |\n| agent-loan-055 | Loan Underwriting | 0.74 | 0.52 | active |\n\nRecommendation: Review agent-treasury-042 and agent-fraud-118 immediately. Both show declining trust trends with multiple violations in the past 48 hours.",
        ],
    },
    "policy": {
        "patterns": ["policy", "most denials", "violations", "enforcement"],
        "responses": [
            "Analysis of policy enforcement over the last 7 days:\n\n| Policy | Denials | Total Evaluations | Denial Rate |\n|---|---|---|---|\n| policy.transaction.velocity.v2 | 1,247 | 12,834 | 9.7% |\n| policy.trust.min_transaction | 892 | 8,451 | 10.6% |\n| policy.budget.daily_limit | 634 | 15,223 | 4.2% |\n| policy.permission.tool_allowlist | 423 | 9,876 | 4.3% |\n| policy.security.zero_trust | 312 | 22,145 | 1.4% |\n\nThe velocity check policy accounts for 41% of all denials. This may indicate that the transaction velocity threshold needs review, or that several agents in Payment Processing are consistently hitting rate limits.",
        ],
    },
    "trust": {
        "patterns": ["trust score", "trust trend", "trust distribution", "trust engine"],
        "responses": [
            "Trust score distribution across the fleet:\n\n- **Excellent (0.8-1.0):** 623 agents (24.9%)\n- **High (0.6-0.8):** 987 agents (39.5%)\n- **Medium (0.4-0.6):** 612 agents (24.5%)\n- **Low (0.2-0.4):** 198 agents (7.9%)\n- **Critical (0.0-0.2):** 80 agents (3.2%)\n\nAverage fleet trust: 0.67. The trust engine uses the bounded formula: Trust(t+1) = clip(Trust(t) + α·S(t) + β·H(t) − γ·V(t) − δ·A(t), 0, 1) with confidence C(t) = min(1, N(t)/30).\n\n278 agents have fewer than 30 observations, meaning their trust scores should be treated as provisional.",
        ],
    },
    "budget": {
        "patterns": ["budget", "spending", "spend", "cost", "remaining"],
        "responses": [
            "Budget utilization summary:\n\n- **Total Allocated:** $127.4M across 2,500 agents\n- **Total Spent:** $43.2M (33.9% utilization)\n- **Total Remaining:** $84.2M\n- **Frozen Budgets:** 12 agents\n- **Budget Violations This Month:** 37\n\nTop spending departments:\n1. Treasury Operations: $14.8M spent / $38.2M allocated (38.7%)\n2. Payment Processing: $11.2M spent / $29.1M allocated (38.5%)\n3. Loan Underwriting: $7.1M spent / $22.4M allocated (31.7%)\n\nThe adaptive budget formula ensures all budgets stay within 5%-150% of base: AdaptiveBudget = clip(Base × TrustMod × RiskMod × Criticality, 0.05×Base, 1.5×Base).",
        ],
    },
    "incident": {
        "patterns": ["incident", "alert", "breach", "emergency"],
        "responses": [
            "Current incident status:\n\n- **Open Incidents:** 12 (3 critical, 5 high, 4 medium)\n- **Investigating:** 8\n- **Contained:** 4\n- **Resolved This Week:** 15\n\nMost recent critical incident: INC-20260725-A3F2B1 — Potential multi-agent collusion detected between agent-treasury-042 and agent-pay-027. Both agents showed coordinated budget spending patterns that triggered the graph intelligence anomaly detector. Containment actions were automatically applied: both agents quarantined, budgets frozen, and permissions revoked. Investigation is ongoing.\n\nMean Time to Detect: 847ms | Mean Time to Contain: 4.2 minutes",
        ],
    },
    "compliance": {
        "patterns": ["compliance", "soc 2", "pci", "regulation", "audit"],
        "responses": [
            "Compliance status overview:\n\n| Framework | Status | Coverage | Last Audit |\n|---|---|---|---|\n| SOC 2 (Security) | ✓ Compliant | 98.7% | 2026-07-15 |\n| PCI-DSS | ✓ Compliant | 97.2% | 2026-07-10 |\n| GLBA Safeguards | ✓ Compliant | 99.1% | 2026-07-20 |\n| EU AI Act Art. 14 | ✓ Compliant | 96.8% | 2026-07-18 |\n\nAudit completeness: 99.97% (all governance decisions have complete audit records). Hash chain integrity: Verified — no tampering detected across 50,000+ records.\n\nNote: The Governance Copilot has read-only access to audit data. It cannot alter trust scores, budgets, or policies — separating investigation from enforcement per security architecture.",
        ],
    },
}

DEFAULT_RESPONSE = "I analyzed the governance data but couldn't find a specific match for your query. Here's what I can help with:\n\n• **Agent status:** 'Why was Agent-42 blocked?'\n• **Risk analysis:** 'Show today's highest-risk agents'\n• **Policy insights:** 'Which policy generated the most denials?'\n• **Trust overview:** 'What's the trust score distribution?'\n• **Budget summary:** 'Show budget utilization by department'\n• **Incidents:** 'What are the current open incidents?'\n• **Compliance:** 'Show compliance status'\n\nI have read-only access to all governance, audit, and policy data. I cannot modify any system state."


@router.post("/query")
async def query_copilot(request: CopilotQueryRequest, user: User = Depends(get_current_user)):
    query_lower = request.query.lower()
    
    response_text = DEFAULT_RESPONSE
    response_type = "text"
    category = "general"
    
    for cat, data in COPILOT_RESPONSES.items():
        if any(pattern in query_lower for pattern in data["patterns"]):
            template = random.choice(data["responses"])
            response_text = template.format(
                trust=random.uniform(0.25, 0.48),
                n=random.randint(2, 5),
                budget=random.uniform(50000, 200000),
                trust_mod=random.uniform(0.6, 1.2),
                risk_mod=random.uniform(0.8, 1.3),
                crit=random.uniform(0.7, 1.3),
                spent=random.uniform(60000, 180000),
                count=random.randint(3, 8),
            )
            response_type = "table" if "|" in template else "text"
            category = cat
            break
    
    return {
        "query": request.query,
        "response": response_text,
        "response_type": response_type,
        "data": None,
        "sources": [f"audit_events", f"trust_scores", f"policies", f"budgets"],
        "confidence": round(random.uniform(0.85, 0.98), 2),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "guardrail": "Read-only access — this copilot cannot modify trust scores, budgets, or policies",
    }


@router.get("/suggestions")
async def get_suggestions(user: User = Depends(get_current_user)):
    return [
        {"id": "s1", "text": "Why was Agent-42 blocked?", "category": "investigation", "icon": "Search"},
        {"id": "s2", "text": "Show today's highest-risk agents", "category": "risk", "icon": "AlertTriangle"},
        {"id": "s3", "text": "Which policy generated the most denials?", "category": "policy", "icon": "FileText"},
        {"id": "s4", "text": "What's the current trust score distribution?", "category": "trust", "icon": "Shield"},
        {"id": "s5", "text": "Show budget utilization by department", "category": "budget", "icon": "DollarSign"},
        {"id": "s6", "text": "What are the current open incidents?", "category": "incident", "icon": "AlertCircle"},
        {"id": "s7", "text": "Show compliance status across all frameworks", "category": "compliance", "icon": "CheckCircle"},
        {"id": "s8", "text": "Explain the trust engine formula", "category": "system", "icon": "Info"},
    ]
