"""
CAZZ SHIELD — Mock Data Generator
Generates 2500+ agents, 50000+ audit records, 300+ policies, and all supporting data
Uses realistic financial institution data
"""
import uuid
import random
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any

# ============================================================
# CONSTANTS
# ============================================================

DEPARTMENTS = [
    "Treasury Operations", "Payment Processing", "KYC & Compliance",
    "Fraud Investigation", "Loan Underwriting", "Regulatory Compliance",
    "Customer Support", "Investment Advisory", "Risk Management", "Internal Audit"
]

AGENT_CLASSES = [
    "transaction-processor", "compliance-checker", "fraud-detector",
    "risk-assessor", "document-analyzer", "customer-service",
    "portfolio-manager", "audit-reviewer", "payment-validator",
    "identity-verifier", "loan-processor", "treasury-manager",
    "report-generator", "data-aggregator", "alert-handler"
]

AGENT_NAME_PREFIXES = [
    "Sentinel", "Guardian", "Watchdog", "Shield", "Falcon",
    "Eagle", "Hawk", "Vanguard", "Cortex", "Nexus",
    "Atlas", "Prism", "Cipher", "Vector", "Quantum",
    "Aegis", "Bastion", "Citadel", "Rampart", "Bulwark"
]

OWNERS = [
    "Sarah Chen", "James Rodriguez", "Maria Santos", "David Kim",
    "Emily Watson", "Robert Singh", "Lisa Park", "Michael Brown",
    "Jennifer Lee", "Thomas Anderson", "Rachel Green", "Christopher Wong",
    "Amanda Foster", "Daniel Martinez", "Katherine Liu", "Brian O'Connor",
    "Michelle Patel", "Steven Taylor", "Rebecca Johnson", "Andrew Cooper"
]

MODEL_PROVIDERS = ["OpenAI", "Anthropic", "Google", "Azure OpenAI", "AWS Bedrock", "Cohere"]
MODEL_NAMES = ["gpt-4-turbo", "claude-3-opus", "gemini-1.5-pro", "gpt-4o", "claude-3.5-sonnet", "command-r-plus"]

REGIONS = ["US-East", "US-West", "EU-West", "EU-Central", "AP-Southeast", "AP-Northeast"]
GEOGRAPHIES = ["North America", "Europe", "Asia Pacific", "Latin America"]

TOOLS = [
    "wire_transfer_api", "payment_gateway", "kyc_verification",
    "credit_scoring", "fraud_detection_ml", "document_parser",
    "email_sender", "sms_gateway", "database_query",
    "reporting_engine", "risk_calculator", "compliance_checker",
    "customer_lookup", "account_manager", "ledger_writer",
    "notification_service", "audit_logger", "data_exporter"
]

APIS = [
    "/api/v1/payments/transfer", "/api/v1/accounts/balance",
    "/api/v1/kyc/verify", "/api/v1/fraud/check",
    "/api/v1/loans/evaluate", "/api/v1/treasury/position",
    "/api/v1/compliance/report", "/api/v1/customers/lookup",
    "/api/v1/risk/assess", "/api/v1/audit/log",
    "/api/v1/reports/generate", "/api/v1/notifications/send"
]

ACTIONS = [
    "initiate_wire_transfer", "process_payment", "verify_identity",
    "check_fraud_score", "evaluate_loan", "query_account_balance",
    "generate_compliance_report", "update_customer_record",
    "assess_credit_risk", "execute_trade", "approve_transaction",
    "reject_transaction", "escalate_to_human", "run_audit_check",
    "send_notification", "export_data", "modify_permissions",
    "access_sensitive_data", "batch_process_payments", "archive_records"
]

POLICY_CATEGORIES = [
    "trust", "budget", "permission", "compliance",
    "security", "operational", "data_access", "transaction"
]

POLICY_TEMPLATES = {
    "trust": [
        ("Minimum Trust for Transactions", "policy.trust.min_transaction", "Agents must maintain trust score ≥ 0.50 for financial transactions"),
        ("Trust Decay on Inactivity", "policy.trust.decay", "Trust score decays by 0.001 per hour of inactivity"),
        ("Trust Recovery Gate", "policy.trust.recovery", "Recovery requires 10 consecutive safe actions + human sign-off"),
        ("High-Value Trust Threshold", "policy.trust.high_value", "Trust ≥ 0.75 required for transactions exceeding $50,000"),
        ("Trust Score Transparency", "policy.trust.transparency", "Trust score changes must be logged with full context"),
    ],
    "budget": [
        ("Daily Spend Limit", "policy.budget.daily_limit", "No agent may exceed its daily adaptive budget ceiling"),
        ("Emergency Budget Freeze", "policy.budget.emergency_freeze", "All budgets freeze during emergency mode"),
        ("Department Budget Cap", "policy.budget.dept_cap", "Department total spend may not exceed aggregate ceiling"),
        ("Adaptive Ceiling Enforcement", "policy.budget.adaptive", "Budget = clip(Base × TrustMod × RiskMod × Criticality, 5%, 150%)"),
        ("Budget Violation Penalty", "policy.budget.violation_penalty", "Budget violations reduce trust score by γ=0.15"),
    ],
    "permission": [
        ("Least Privilege Default", "policy.permission.least_privilege", "Agents receive minimum required permissions for current task"),
        ("Tool Allowlist Enforcement", "policy.permission.tool_allowlist", "Agents may only invoke tools on their approved list"),
        ("API Rate Limiting", "policy.permission.api_rate_limit", "Maximum 100 API calls per minute per agent"),
        ("Data Access Classification", "policy.permission.data_classification", "PII access requires trust ≥ 0.70 and department match"),
        ("Cross-Department Access", "policy.permission.cross_dept", "Cross-department data access requires explicit approval"),
    ],
    "compliance": [
        ("SOC 2 Audit Trail", "policy.compliance.soc2_audit", "All governance decisions must generate complete audit records"),
        ("PCI-DSS Data Protection", "policy.compliance.pci_dss", "Payment card data must be masked in logs and audit trails"),
        ("GLBA Safeguards", "policy.compliance.glba", "Financial data access must be logged and monitored"),
        ("EU AI Act Transparency", "policy.compliance.eu_ai_act", "AI decisions must be explainable with full decision path"),
        ("Regulatory Report Generation", "policy.compliance.reg_reporting", "Monthly compliance reports auto-generated for audit team"),
    ],
    "security": [
        ("Zero Trust Verification", "policy.security.zero_trust", "Every action requires fresh identity verification"),
        ("Prompt Injection Detection", "policy.security.prompt_injection", "Deny actions with detected prompt injection patterns"),
        ("Privilege Escalation Prevention", "policy.security.priv_escalation", "Agents cannot request permissions beyond their class"),
        ("Session Token Rotation", "policy.security.token_rotation", "Agent tokens rotate every 15 minutes"),
        ("Anomaly Detection Alert", "policy.security.anomaly_alert", "Anomalous behavior patterns trigger immediate review"),
    ],
    "operational": [
        ("Agent Health Check", "policy.operational.health_check", "Agents must respond to health probes within 5 seconds"),
        ("Graceful Degradation", "policy.operational.graceful_degrade", "Agents must fail safely when dependent services are unavailable"),
        ("Action Timeout", "policy.operational.timeout", "Agent actions exceeding 30 seconds are automatically terminated"),
        ("Retry Limit", "policy.operational.retry_limit", "Maximum 3 retries per action before escalation"),
        ("Concurrency Control", "policy.operational.concurrency", "Maximum 10 concurrent actions per agent"),
    ],
    "data_access": [
        ("Sensitive Data Encryption", "policy.data.encryption", "All sensitive data must be encrypted at rest and in transit"),
        ("Data Retention Policy", "policy.data.retention", "Audit records retained for minimum 7 years"),
        ("Data Masking", "policy.data.masking", "PII fields masked in non-production environments"),
        ("Access Logging", "policy.data.access_logging", "All data access events logged with full context"),
        ("Data Classification Enforcement", "policy.data.classification", "Data classified as Confidential requires two-factor approval"),
    ],
    "transaction": [
        ("Wire Transfer Limit", "policy.transaction.wire_limit", "Single wire transfers capped at $1M without human approval"),
        ("Velocity Check", "policy.transaction.velocity", "No more than 50 transactions per hour per agent"),
        ("Multi-Agent Coordination", "policy.transaction.multi_agent", "Multi-agent transactions require coordinator approval"),
        ("Reversal Window", "policy.transaction.reversal", "Transactions reversible within 15-minute window"),
        ("High-Risk Transaction Review", "policy.transaction.high_risk_review", "Transactions flagged high-risk require human sign-off"),
    ],
}

REGO_TEMPLATE = '''package cazz.{category}

import future.keywords.if
import future.keywords.in

# {name}
# {description}

default allow := false

allow if {{
    input.agent.trust_score >= {trust_threshold}
    input.agent.risk_score <= {risk_threshold}
    input.agent.status == "active"
    input.action.type in {allowed_actions}
    input.budget.remaining > input.action.cost
}}

deny if {{
    input.agent.trust_score < {deny_trust}
}}

deny if {{
    input.agent.status != "active"
}}

escalate if {{
    input.agent.trust_score >= {escalate_low}
    input.agent.trust_score < {escalate_high}
    input.action.risk_level == "high"
}}

# Metadata
metadata := {{
    "policy_id": "{policy_id}",
    "version": {version},
    "category": "{category}",
    "severity": "{severity}",
    "author": "{author}"
}}'''


def generate_agent_id(dept_code: str, num: int) -> str:
    return f"agent-{dept_code}-{num:04d}"


def generate_agents(count: int = 2500) -> list[dict]:
    agents = []
    dept_counts: dict[str, int] = {}
    
    dept_codes = {
        "Treasury Operations": "treasury",
        "Payment Processing": "pay",
        "KYC & Compliance": "kyc",
        "Fraud Investigation": "fraud",
        "Loan Underwriting": "loan",
        "Regulatory Compliance": "compliance",
        "Customer Support": "support",
        "Investment Advisory": "invest",
        "Risk Management": "risk",
        "Internal Audit": "audit",
    }
    
    for i in range(count):
        dept = random.choice(DEPARTMENTS)
        dept_code = dept_codes[dept]
        dept_counts[dept_code] = dept_counts.get(dept_code, 0) + 1
        
        agent_class = random.choice(AGENT_CLASSES)
        prefix = random.choice(AGENT_NAME_PREFIXES)
        
        trust = round(random.betavariate(5, 2) * 0.6 + 0.3, 4)
        trust = min(max(trust, 0.0), 1.0)
        risk = round(1.0 - trust + random.uniform(-0.15, 0.15), 4)
        risk = min(max(risk, 0.0), 1.0)
        observations = random.randint(5, 5000)
        confidence = round(min(1.0, observations / 30), 4)
        
        base_budget = random.choice([25000, 50000, 75000, 100000, 150000, 200000, 500000, 1000000])
        trust_mod = round(0.5 + trust, 4)
        risk_mod = round(1.5 - risk, 4)
        criticality = round(random.uniform(0.5, 1.5), 4)
        effective = round(max(base_budget * 0.05, min(base_budget * 1.5, base_budget * trust_mod * risk_mod * criticality)), 2)
        spent_pct = random.betavariate(2, 5)
        spent = round(effective * spent_pct, 2)
        
        total_actions = random.randint(100, 50000)
        violation_rate = max(0, (1 - trust) * 0.1 + random.uniform(-0.02, 0.02))
        total_violations = int(total_actions * violation_rate)
        total_denials = int(total_actions * violation_rate * 1.5)
        
        days_ago = random.randint(1, 365)
        onboarded = datetime.now(timezone.utc) - timedelta(days=days_ago)
        last_action = datetime.now(timezone.utc) - timedelta(minutes=random.randint(1, 10000))
        
        statuses = ["active"] * 80 + ["paused"] * 8 + ["quarantined"] * 5 + ["suspended"] * 3 + ["pending_review"] * 4
        status = random.choice(statuses)
        
        risk_levels = {
            "critical": risk > 0.8,
            "high": 0.6 < risk <= 0.8,
            "medium": 0.3 < risk <= 0.6,
            "low": 0.1 < risk <= 0.3,
            "minimal": risk <= 0.1,
        }
        risk_level = next((k for k, v in risk_levels.items() if v), "medium")
        
        owner = random.choice(OWNERS)
        model_provider = random.choice(MODEL_PROVIDERS)
        model_name = random.choice(MODEL_NAMES)
        
        n_tools = random.randint(2, 8)
        n_apis = random.randint(2, 6)
        
        agent = {
            "id": str(uuid.uuid4()),
            "agent_id": generate_agent_id(dept_code, dept_counts[dept_code]),
            "name": f"{prefix}-{agent_class.split('-')[0].title()}-{dept_code[:3].upper()}-{dept_counts[dept_code]:03d}",
            "description": f"Autonomous {agent_class.replace('-', ' ')} agent operating in {dept} department",
            "agent_class": agent_class,
            "department": dept,
            "status": status,
            "risk_level": risk_level,
            "trust_score": trust,
            "trust_confidence": confidence,
            "trust_observations": observations,
            "risk_score": risk,
            "risk_factors": {
                "behavioral": round(random.uniform(0, 1), 3),
                "transactional": round(random.uniform(0, 1), 3),
                "compliance": round(random.uniform(0, 1), 3),
                "operational": round(random.uniform(0, 1), 3),
            },
            "base_budget": base_budget,
            "current_budget": effective,
            "budget_spent": spent,
            "budget_window": random.choice(["daily", "weekly", "monthly"]),
            "owner": owner,
            "owner_email": f"{owner.lower().replace(' ', '.')}@cazzbank.com",
            "version": f"{random.randint(1,3)}.{random.randint(0,9)}.{random.randint(0,9)}",
            "model_provider": model_provider,
            "model_name": model_name,
            "identity_provider_ref": f"idp-{uuid.uuid4().hex[:8]}",
            "allowed_tools": random.sample(TOOLS, n_tools),
            "allowed_apis": random.sample(APIS, n_apis),
            "allowed_actions": random.sample(ACTIONS, random.randint(3, 10)),
            "policy_ids": [f"policy.{random.choice(POLICY_CATEGORIES)}.{uuid.uuid4().hex[:8]}" for _ in range(random.randint(2, 6))],
            "total_actions": total_actions,
            "total_violations": total_violations,
            "total_denials": total_denials,
            "last_action_at": last_action.isoformat(),
            "last_violation_at": (last_action - timedelta(hours=random.randint(1, 720))).isoformat() if total_violations > 0 else None,
            "region": random.choice(REGIONS),
            "geography": random.choice(GEOGRAPHIES),
            "onboarded_at": onboarded.isoformat(),
            "is_emergency_stopped": False,
        }
        agents.append(agent)
    
    return agents


def generate_policies(count: int = 320) -> list[dict]:
    policies = []
    policy_num = 0
    
    for category, templates in POLICY_TEMPLATES.items():
        for name, policy_id, description in templates:
            policy_num += 1
            version = random.randint(1, 5)
            total_evals = random.randint(500, 100000)
            denial_rate = random.uniform(0.02, 0.35)
            
            statuses = ["active"] * 70 + ["draft"] * 10 + ["inactive"] * 10 + ["canary"] * 5 + ["peer_review"] * 5
            
            policy = {
                "id": str(uuid.uuid4()),
                "policy_id": policy_id,
                "name": name,
                "description": description,
                "category": category,
                "severity": random.choice(["critical", "high", "medium", "low"]),
                "status": random.choice(statuses),
                "version": version,
                "policy_code": REGO_TEMPLATE.format(
                    category=category,
                    name=name,
                    description=description,
                    trust_threshold=round(random.uniform(0.4, 0.7), 2),
                    risk_threshold=round(random.uniform(0.5, 0.8), 2),
                    allowed_actions=str(random.sample(ACTIONS, 5)),
                    deny_trust=round(random.uniform(0.2, 0.4), 2),
                    escalate_low=round(random.uniform(0.4, 0.5), 2),
                    escalate_high=round(random.uniform(0.5, 0.7), 2),
                    policy_id=policy_id,
                    version=version,
                    severity=random.choice(["critical", "high", "medium"]),
                    author=random.choice(OWNERS),
                ),
                "policy_language": "rego",
                "target_departments": random.sample(DEPARTMENTS, random.randint(1, 4)),
                "target_agent_classes": random.sample(AGENT_CLASSES, random.randint(1, 3)),
                "target_risk_levels": random.sample(["critical", "high", "medium", "low"], random.randint(1, 3)),
                "author": random.choice(OWNERS),
                "reviewer": random.choice(OWNERS),
                "approved_by": random.choice(OWNERS),
                "total_evaluations": total_evals,
                "total_denials": int(total_evals * denial_rate),
                "total_allows": int(total_evals * (1 - denial_rate)),
                "denial_rate": round(denial_rate, 4),
                "simulation_pass": random.choice([True, True, True, False]),
                "last_simulated_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30))).isoformat(),
                "created_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(30, 365))).isoformat(),
                "published_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30))).isoformat(),
            }
            policies.append(policy)
    
    # Generate additional policies to reach count
    while len(policies) < count:
        cat = random.choice(POLICY_CATEGORIES)
        policy_num += 1
        name = f"Auto-Generated Policy {policy_num}"
        policy_id = f"policy.{cat}.auto_{policy_num:04d}"
        version = random.randint(1, 5)
        total_evals = random.randint(100, 50000)
        denial_rate = random.uniform(0.02, 0.35)
        
        policy = {
            "id": str(uuid.uuid4()),
            "policy_id": policy_id,
            "name": name,
            "description": f"Automated governance policy for {cat} enforcement",
            "category": cat,
            "severity": random.choice(["critical", "high", "medium", "low"]),
            "status": random.choice(["active", "active", "active", "draft", "inactive"]),
            "version": version,
            "policy_code": REGO_TEMPLATE.format(
                category=cat, name=name, description=f"Auto policy {policy_num}",
                trust_threshold=round(random.uniform(0.4, 0.7), 2),
                risk_threshold=round(random.uniform(0.5, 0.8), 2),
                allowed_actions=str(random.sample(ACTIONS, 5)),
                deny_trust=round(random.uniform(0.2, 0.4), 2),
                escalate_low=round(random.uniform(0.4, 0.5), 2),
                escalate_high=round(random.uniform(0.5, 0.7), 2),
                policy_id=policy_id, version=version,
                severity=random.choice(["critical", "high", "medium"]),
                author=random.choice(OWNERS),
            ),
            "policy_language": "rego",
            "target_departments": random.sample(DEPARTMENTS, random.randint(1, 4)),
            "target_agent_classes": random.sample(AGENT_CLASSES, random.randint(1, 3)),
            "target_risk_levels": random.sample(["critical", "high", "medium", "low"], random.randint(1, 3)),
            "author": random.choice(OWNERS),
            "reviewer": random.choice(OWNERS),
            "total_evaluations": total_evals,
            "total_denials": int(total_evals * denial_rate),
            "total_allows": int(total_evals * (1 - denial_rate)),
            "denial_rate": round(denial_rate, 4),
            "simulation_pass": random.choice([True, True, True, False]),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(30, 365))).isoformat(),
        }
        policies.append(policy)
    
    return policies


def generate_audit_events(agents: list[dict], count: int = 50000) -> list[dict]:
    events = []
    prev_hash = "0" * 64
    
    decision_weights = ["allowed"] * 65 + ["denied"] * 25 + ["escalated"] * 7 + ["conditional"] * 3
    severity_weights = ["info"] * 50 + ["low"] * 25 + ["medium"] * 15 + ["high"] * 8 + ["critical"] * 2
    
    for seq in range(count):
        agent = random.choice(agents)
        action = random.choice(ACTIONS)
        decision = random.choice(decision_weights)
        
        event_id = f"evt_{uuid.uuid4().hex[:12]}"
        timestamp = datetime.now(timezone.utc) - timedelta(
            seconds=random.randint(0, 90 * 24 * 3600)
        )
        
        decision_paths = [
            "Identity → Auth → Permission → Trust → Policy → Budget → Allow",
            "Identity → Auth → Permission → Trust (fail) → Deny",
            "Identity → Auth → Permission → Trust → Policy (fail) → Deny",
            "Identity → Auth → Permission → Trust → Policy → Budget (exceeded) → Deny",
            "Identity → Auth → Permission → Trust → Policy → Escalate → Human Approve",
            "Identity → Auth → Permission → Trust → Policy → Budget → Graph Check → Allow",
        ]
        
        if decision == "denied":
            path = random.choice([p for p in decision_paths if "Deny" in p or "fail" in p])
        elif decision == "escalated":
            path = random.choice([p for p in decision_paths if "Escalate" in p])
        else:
            path = random.choice([p for p in decision_paths if "Allow" in p])
        
        budget_remaining = round(agent["current_budget"] - agent["budget_spent"] + random.uniform(-5000, 5000), 2)
        
        record_data = f"{event_id}|{agent['agent_id']}|{action}|{decision}|{timestamp.isoformat()}|{prev_hash}"
        record_hash = hashlib.sha256(record_data.encode()).hexdigest()
        
        event = {
            "id": str(uuid.uuid4()),
            "event_id": event_id,
            "agent_id": agent["agent_id"],
            "agent_name": agent["name"],
            "department": agent["department"],
            "action": action,
            "action_category": random.choice(POLICY_CATEGORIES),
            "resource": random.choice(APIS),
            "decision": decision,
            "category": "governance",
            "policy_matched": f"policy.{random.choice(POLICY_CATEGORIES)}.{uuid.uuid4().hex[:8]}, rule {random.randint(1, 20)}",
            "policy_rule": f"rule {random.randint(1, 20)}",
            "trust_score": agent["trust_score"],
            "risk_score": agent["risk_score"],
            "budget_status": f"${max(0, budget_remaining):,.2f} / ${agent['current_budget']:,.2f} remaining",
            "budget_remaining": max(0, budget_remaining),
            "decision_path": path,
            "operator": random.choice(["auto", "auto", "auto", f"ops-{random.choice(OWNERS).split()[1].lower()}"]),
            "operator_type": "system",
            "severity": random.choice(severity_weights),
            "record_hash": record_hash,
            "prev_hash": prev_hash,
            "sequence_number": seq,
            "timestamp": timestamp.isoformat(),
        }
        events.append(event)
        prev_hash = record_hash
    
    return events


def generate_incidents(agents: list[dict], count: int = 150) -> list[dict]:
    incidents = []
    
    incident_types = [
        ("trust_violation", "Trust Score Below Threshold", "critical"),
        ("budget_breach", "Budget Ceiling Exceeded", "high"),
        ("policy_violation", "Policy Rule Violation Detected", "high"),
        ("unauthorized_access", "Unauthorized API Access Attempt", "critical"),
        ("anomalous_behavior", "Anomalous Behavior Pattern Detected", "medium"),
        ("collusion_detected", "Potential Multi-Agent Collusion", "critical"),
        ("privilege_escalation", "Privilege Escalation Attempt", "critical"),
        ("system_anomaly", "System Performance Anomaly", "medium"),
    ]
    
    statuses = ["open"] * 20 + ["investigating"] * 25 + ["contained"] * 15 + ["resolved"] * 30 + ["closed"] * 10
    
    for i in range(count):
        inc_type, title_prefix, default_sev = random.choice(incident_types)
        agent = random.choice(agents)
        detected = datetime.now(timezone.utc) - timedelta(hours=random.randint(0, 720))
        
        status = random.choice(statuses)
        contained = detected + timedelta(minutes=random.randint(5, 120)) if status in ["contained", "resolved", "closed"] else None
        resolved = contained + timedelta(hours=random.randint(1, 48)) if status in ["resolved", "closed"] and contained else None
        
        incident = {
            "id": str(uuid.uuid4()),
            "incident_id": f"INC-{detected.strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}",
            "title": f"{title_prefix} — {agent['name']}",
            "description": f"Automated detection: {agent['agent_id']} in {agent['department']} triggered {inc_type.replace('_', ' ')} alert. Trust: {agent['trust_score']:.2f}, Risk: {agent['risk_score']:.2f}.",
            "incident_type": inc_type,
            "severity": random.choice([default_sev, "high", "medium"]),
            "status": status,
            "agent_ids": [agent["agent_id"]] + [random.choice(agents)["agent_id"] for _ in range(random.randint(0, 2))],
            "department": agent["department"],
            "affected_systems": random.sample(["Payment Gateway", "KYC Service", "Fraud Engine", "Treasury System", "Audit Logger", "Risk Calculator"], random.randint(1, 3)),
            "assigned_to": random.choice(OWNERS),
            "resolution": f"Agent {agent['agent_id']} quarantined and permissions revoked. Root cause identified as {inc_type.replace('_', ' ')}." if status in ["resolved", "closed"] else None,
            "root_cause": f"Analysis revealed {inc_type.replace('_', ' ')} originating from behavioral drift in {agent['department']} department." if status in ["resolved", "closed"] else None,
            "actions_taken": [
                {"action": "Agent quarantined", "timestamp": detected.isoformat()},
                {"action": "Permissions revoked", "timestamp": (detected + timedelta(minutes=2)).isoformat()},
                {"action": "Budget frozen", "timestamp": (detected + timedelta(minutes=3)).isoformat()},
            ] if status != "open" else [],
            "detection_time_ms": random.randint(50, 2000),
            "containment_time_ms": random.randint(5000, 300000) if contained else None,
            "resolution_time_ms": random.randint(3600000, 172800000) if resolved else None,
            "detected_at": detected.isoformat(),
            "contained_at": contained.isoformat() if contained else None,
            "resolved_at": resolved.isoformat() if resolved else None,
            "created_at": detected.isoformat(),
        }
        incidents.append(incident)
    
    return incidents


def generate_trust_history(agents: list[dict], per_agent: int = 20) -> list[dict]:
    history = []
    
    for agent in agents[:500]:  # Generate detailed history for first 500 agents
        score = agent["trust_score"]
        for i in range(per_agent):
            event_types = ["success", "success", "success", "violation", "anomaly", "human_approval", "decay"]
            event_type = random.choice(event_types)
            
            if event_type == "success":
                delta = round(random.uniform(0.01, 0.05), 4)
            elif event_type == "violation":
                delta = round(-random.uniform(0.05, 0.15), 4)
            elif event_type == "anomaly":
                delta = round(-random.uniform(0.03, 0.08), 4)
            elif event_type == "human_approval":
                delta = round(random.uniform(0.02, 0.04), 4)
            else:
                delta = round(-random.uniform(0.001, 0.005), 4)
            
            prev_score = score
            score = round(min(1.0, max(0.0, score + delta)), 4)
            
            record = {
                "id": str(uuid.uuid4()),
                "agent_id": agent["agent_id"],
                "score": score,
                "previous_score": prev_score,
                "confidence": agent["trust_confidence"],
                "observations": agent["trust_observations"] - (per_agent - i),
                "delta": delta,
                "event_type": event_type,
                "reason": f"Trust {'increased' if delta > 0 else 'decreased'} due to {event_type.replace('_', ' ')}",
                "recorded_at": (datetime.now(timezone.utc) - timedelta(hours=(per_agent - i) * random.randint(1, 12))).isoformat(),
            }
            history.append(record)
    
    return history


def generate_graph_data(agents: list[dict]) -> tuple[list[dict], list[dict]]:
    nodes = []
    edges = []
    
    # Create agent nodes (sample for graph viz)
    sample_agents = agents[:200]
    for agent in sample_agents:
        node = {
            "id": str(uuid.uuid4()),
            "node_id": agent["agent_id"],
            "node_type": "agent",
            "label": agent["name"],
            "properties": {
                "department": agent["department"],
                "trust": agent["trust_score"],
                "risk": agent["risk_score"],
                "status": agent["status"],
            },
            "cluster_id": f"cluster-{agent['department'].lower().replace(' ', '-')[:10]}",
            "risk_score": agent["risk_score"],
            "is_suspicious": agent["risk_score"] > 0.7,
            "degree_centrality": round(random.uniform(0.1, 0.9), 3),
            "department": agent["department"],
        }
        nodes.append(node)
    
    # Create service/API nodes
    for api in APIS[:8]:
        node = {
            "id": str(uuid.uuid4()),
            "node_id": f"api-{api.split('/')[-1]}",
            "node_type": "api",
            "label": api.split("/")[-1].replace("_", " ").title(),
            "properties": {"endpoint": api},
            "cluster_id": "cluster-apis",
            "risk_score": round(random.uniform(0.1, 0.5), 3),
            "is_suspicious": False,
            "degree_centrality": round(random.uniform(0.3, 0.9), 3),
            "department": None,
        }
        nodes.append(node)
    
    # Create vendor nodes
    vendors = ["DataVendor-A", "CloudProvider-B", "PaymentRail-C", "IdentityService-D", "RiskFeed-E"]
    for vendor in vendors:
        node = {
            "id": str(uuid.uuid4()),
            "node_id": f"vendor-{vendor.lower()}",
            "node_type": "vendor",
            "label": vendor,
            "properties": {"type": "external"},
            "cluster_id": "cluster-vendors",
            "risk_score": round(random.uniform(0.2, 0.6), 3),
            "is_suspicious": False,
            "degree_centrality": round(random.uniform(0.2, 0.7), 3),
            "department": None,
        }
        nodes.append(node)
    
    # Create edges
    edge_types = ["calls", "accesses", "shares_data", "delegates_to", "depends_on"]
    for agent in sample_agents:
        n_edges = random.randint(2, 6)
        targets = random.sample([n["node_id"] for n in nodes if n["node_id"] != agent["agent_id"]], min(n_edges, len(nodes) - 1))
        for target in targets:
            is_sus = random.random() < 0.05
            edge = {
                "id": str(uuid.uuid4()),
                "source_id": agent["agent_id"],
                "target_id": target,
                "edge_type": random.choice(edge_types),
                "weight": round(random.uniform(0.1, 1.0), 3),
                "label": None,
                "properties": {},
                "is_suspicious": is_sus,
                "observed_at": (datetime.now(timezone.utc) - timedelta(hours=random.randint(0, 720))).isoformat(),
            }
            edges.append(edge)
    
    return nodes, edges


def generate_reports() -> list[dict]:
    reports = []
    now = datetime.now(timezone.utc)
    
    for i in range(30):
        if i < 7:
            rtype = "daily"
            start = now - timedelta(days=i+1)
            end = now - timedelta(days=i)
        elif i < 15:
            rtype = "weekly"
            start = now - timedelta(weeks=i-6)
            end = start + timedelta(weeks=1)
        else:
            rtype = "monthly"
            start = now - timedelta(days=30*(i-14))
            end = start + timedelta(days=30)
        
        compliance_score = round(random.uniform(92, 99.5), 1)
        
        report = {
            "id": str(uuid.uuid4()),
            "report_id": f"RPT-{start.strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}",
            "title": f"{rtype.title()} Governance Report — {start.strftime('%b %d, %Y')}",
            "report_type": rtype,
            "status": "completed",
            "summary": f"This {rtype} governance report covers the period from {start.strftime('%b %d')} to {end.strftime('%b %d, %Y')}. Overall compliance score: {compliance_score}%. System operated within expected parameters with {random.randint(0, 5)} incidents requiring attention.",
            "metrics": {
                "policy_enforcement_accuracy": round(random.uniform(97, 99.9), 1),
                "mean_time_to_revoke_ms": random.randint(500, 5000),
                "audit_completeness_pct": round(random.uniform(99.5, 100), 2),
                "false_positive_rate": round(random.uniform(0.5, 3.0), 2),
                "false_negative_rate": round(random.uniform(0.1, 1.0), 2),
                "avg_decision_latency_ms": random.randint(15, 50),
                "total_governance_decisions": random.randint(50000, 500000),
                "budget_enforcement_accuracy": round(random.uniform(98, 99.9), 1),
            },
            "findings": [
                f"{random.randint(1, 5)} agents flagged for trust score below threshold",
                f"{random.randint(0, 3)} budget violations detected and contained",
                f"{random.randint(0, 2)} policy conflicts identified and resolved",
                f"Average trust score: {round(random.uniform(0.65, 0.85), 2)}",
            ],
            "recommendations": [
                "Review agents with declining trust trends",
                "Update velocity check policies for payment processors",
                "Schedule quarterly compliance audit",
            ],
            "period_start": start.isoformat(),
            "period_end": end.isoformat(),
            "departments_covered": DEPARTMENTS,
            "total_events": random.randint(10000, 100000),
            "total_incidents": random.randint(0, 15),
            "total_violations": random.randint(10, 200),
            "compliance_score": compliance_score,
            "generated_by": "system",
            "created_at": end.isoformat(),
        }
        reports.append(report)
    
    return reports


def generate_permissions(agents: list[dict], count: int = 500) -> list[dict]:
    permissions = []
    
    permission_types = ["allow", "allow", "allow", "deny", "conditional"]
    scopes = ["tool", "api", "action", "data", "transaction", "system"]
    
    for i in range(count):
        ptype = random.choice(permission_types)
        scope = random.choice(scopes)
        agent = random.choice(agents) if random.random() < 0.6 else None
        
        conditions = None
        if ptype == "conditional":
            cond_types = ["time", "spend", "department", "geography", "approval"]
            conditions = {
                "type": random.choice(cond_types),
                "operator": random.choice(["eq", "gt", "lt", "in", "between"]),
                "value": str(random.randint(1000, 100000)) if scope == "transaction" else random.choice(DEPARTMENTS),
            }
        
        resource = random.choice(TOOLS) if scope == "tool" else random.choice(APIS) if scope == "api" else random.choice(ACTIONS)
        
        permission = {
            "id": str(uuid.uuid4()),
            "permission_id": f"perm-{uuid.uuid4().hex[:8]}",
            "name": f"{ptype.title()} {scope.title()} Access — {resource}",
            "description": f"{'Allows' if ptype == 'allow' else 'Denies' if ptype == 'deny' else 'Conditionally allows'} access to {resource}",
            "permission_type": ptype,
            "scope": scope,
            "resource": resource,
            "agent_id": agent["agent_id"] if agent else None,
            "department": agent["department"] if agent else random.choice(DEPARTMENTS),
            "agent_class": agent["agent_class"] if agent else None,
            "conditions": conditions,
            "is_active": random.random() < 0.9,
            "priority": random.choice([10, 50, 100, 200, 500]),
            "created_by": random.choice(OWNERS),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(1, 180))).isoformat(),
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=random.randint(30, 365))).isoformat() if random.random() < 0.3 else None,
        }
        permissions.append(permission)
    
    return permissions


def generate_budget_transactions(agents: list[dict], count: int = 5000) -> list[dict]:
    transactions = []
    
    for i in range(count):
        agent = random.choice(agents)
        tx_types = ["spend", "spend", "spend", "spend", "allocation", "adjustment"]
        tx_type = random.choice(tx_types)
        
        if tx_type == "spend":
            amount = round(random.uniform(10, 50000), 2)
        elif tx_type == "allocation":
            amount = round(random.uniform(10000, 200000), 2)
        else:
            amount = round(random.uniform(-5000, 5000), 2)
        
        balance_before = round(agent["current_budget"] - agent["budget_spent"] + random.uniform(-10000, 10000), 2)
        balance_after = round(balance_before - amount if tx_type == "spend" else balance_before + abs(amount), 2)
        
        transaction = {
            "id": str(uuid.uuid4()),
            "agent_id": agent["agent_id"],
            "transaction_type": tx_type,
            "amount": amount,
            "balance_before": max(0, balance_before),
            "balance_after": max(0, balance_after),
            "description": f"{'Spend on' if tx_type == 'spend' else 'Budget' if tx_type == 'allocation' else 'Manual'} {random.choice(ACTIONS).replace('_', ' ')}",
            "action_id": f"act_{uuid.uuid4().hex[:8]}",
            "approved_by": random.choice(OWNERS) if tx_type == "allocation" else "auto",
            "created_at": (datetime.now(timezone.utc) - timedelta(hours=random.randint(0, 720))).isoformat(),
        }
        transactions.append(transaction)
    
    return transactions


def generate_approval_queue(agents: list[dict], count: int = 50) -> list[dict]:
    """Generate approval queue requests for human-in-the-loop trust approvals"""
    approvals = []
    
    operations = [
        "Wire Transfer ${:,} to Deutsche Bank Clearing",
        "Open Derivatives Position ${:,}",
        "Approve Commercial Line Increase ${:,}",
        "Execute High-Value Trade ${:,}",
        "Process Cross-Border Payment ${:,}",
        "Grant Temporary Access to Sensitive Data",
        "Override Policy Constraint for Critical Transaction",
        "Approve Emergency Budget Allocation ${:,}",
        "Authorize API Key Generation",
        "Approve Multi-Agent Coordination Request",
    ]
    
    priorities = ["low", "medium", "medium", "high", "high", "critical"]
    statuses = ["pending"] * 60 + ["approved"] * 25 + ["rejected"] * 10 + ["expired"] * 5
    
    for i in range(count):
        agent = random.choice(agents)
        operation = random.choice(operations)
        
        # Format operation with random amount if it contains placeholder
        if "${:,}" in operation:
            amount = random.randint(10000, 2000000)
            operation = operation.format(amount)
        
        trust_before = round(agent["trust_score"], 4)
        status = random.choice(statuses)
        
        created_at = datetime.now(timezone.utc) - timedelta(
            minutes=random.randint(1, 720) if status == "pending" else random.randint(60, 1440)
        )
        
        approval = {
            "id": str(uuid.uuid4()),
            "request_id": f"appr-{uuid.uuid4().hex[:6].upper()}",
            "agent_id": agent["agent_id"],
            "agent_name": agent["name"],
            "requested_operation": operation,
            "trust_before": trust_before,
            "trust_after": round(min(1.0, trust_before + 0.03), 4) if status == "approved" else None,
            "confidence_before": agent["trust_confidence"],
            "confidence_after": agent["trust_confidence"] if status == "approved" else None,
            "status": status,
            "priority": random.choice(priorities),
            "requested_by": "system",
            "approved_by": random.choice(OWNERS) if status in ["approved", "rejected"] else None,
            "rejection_reason": "Risk threshold exceeded" if status == "rejected" else None,
            "action_id": f"act_{uuid.uuid4().hex[:8]}",
            "policy_id": f"policy.trust.{uuid.uuid4().hex[:8]}",
            "created_at": created_at.isoformat(),
            "reviewed_at": (created_at + timedelta(minutes=random.randint(5, 60))).isoformat() if status in ["approved", "rejected"] else None,
            "expires_at": (created_at + timedelta(hours=24)).isoformat(),
        }
        approvals.append(approval)
    
    return approvals


def generate_users() -> list[dict]:
    return [
        {"email": "admin@cazzshield.com", "password": "admin123", "full_name": "Alexandra Morgan", "role": "admin", "department": "Platform Engineering", "title": "Chief Security Officer"},
        {"email": "operator@cazzshield.com", "password": "operator123", "full_name": "Marcus Chen", "role": "operator", "department": "Operations Center", "title": "Senior Operations Engineer"},
        {"email": "auditor@cazzshield.com", "password": "auditor123", "full_name": "Priya Patel", "role": "auditor", "department": "Internal Audit", "title": "Lead Audit Analyst"},
        {"email": "risk@cazzshield.com", "password": "risk123", "full_name": "James Crawford", "role": "risk_officer", "department": "Risk Management", "title": "Chief Risk Officer"},
        {"email": "engineer@cazzshield.com", "password": "engineer123", "full_name": "Sarah Kim", "role": "ai_engineer", "department": "AI Engineering", "title": "Principal AI Engineer"},
        {"email": "security@cazzshield.com", "password": "security123", "full_name": "David Okonkwo", "role": "security_admin", "department": "Information Security", "title": "Security Architect"},
    ]
