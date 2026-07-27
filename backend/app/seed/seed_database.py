"""
CAZZ SHIELD — Database Seeder
Seeds the database with realistic mock data
"""
import asyncio
import random
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import async_session_factory, init_db
from app.models.user import User, UserRole
from app.models.agent import Agent
from app.models.trust import TrustScore
from app.models.budget import Budget, BudgetTransaction
from app.models.policy import Policy, PolicyVersion
from app.models.permission import Permission
from app.models.audit import AuditEvent
from app.models.incident import Incident
from app.models.report import GovernanceReport
from app.models.graph import GraphNode, GraphEdge
from app.models.approval_queue import ApprovalQueue, ApprovalStatus
from app.utils.security import hash_password
from app.utils.mock_data import (
    generate_agents, generate_policies, generate_audit_events,
    generate_incidents, generate_trust_history, generate_graph_data,
    generate_reports, generate_permissions, generate_budget_transactions,
    generate_users, generate_approval_queue,
)


async def seed_users(session: AsyncSession) -> list[User]:
    users_data = generate_users()
    users = []
    for u in users_data:
        user = User(
            email=u["email"],
            hashed_password=hash_password(u["password"]),
            full_name=u["full_name"],
            role=UserRole(u["role"]),
            department=u["department"],
            title=u["title"],
            is_active=True,
            is_verified=True,
        )
        session.add(user)
        users.append(user)
    await session.flush()
    print(f"  Seeded {len(users)} users")
    return users


async def seed_agents(session: AsyncSession) -> list[dict]:
    agents_data = generate_agents(2500)
    for a in agents_data:
        agent = Agent(
            agent_id=a["agent_id"],
            name=a["name"],
            description=a["description"],
            agent_class=a["agent_class"],
            department=a["department"],
            status=a["status"],
            risk_level=a["risk_level"],
            trust_score=a["trust_score"],
            trust_confidence=a["trust_confidence"],
            trust_observations=a["trust_observations"],
            risk_score=a["risk_score"],
            risk_factors=a["risk_factors"],
            base_budget=a["base_budget"],
            current_budget=a["current_budget"],
            budget_spent=a["budget_spent"],
            budget_window=a["budget_window"],
            owner=a["owner"],
            owner_email=a["owner_email"],
            version=a["version"],
            model_provider=a["model_provider"],
            model_name=a["model_name"],
            identity_provider_ref=a["identity_provider_ref"],
            allowed_tools=a["allowed_tools"],
            allowed_apis=a["allowed_apis"],
            allowed_actions=a["allowed_actions"],
            policy_ids=a["policy_ids"],
            total_actions=a["total_actions"],
            total_violations=a["total_violations"],
            total_denials=a["total_denials"],
            last_action_at=datetime.fromisoformat(a["last_action_at"]) if a["last_action_at"] else None,
            last_violation_at=datetime.fromisoformat(a["last_violation_at"]) if a.get("last_violation_at") else None,
            region=a["region"],
            geography=a["geography"],
            onboarded_at=datetime.fromisoformat(a["onboarded_at"]),
        )
        session.add(agent)
    await session.flush()
    print(f"  Seeded {len(agents_data)} agents")
    return agents_data


async def seed_policies(session: AsyncSession) -> list[dict]:
    policies_data = generate_policies(320)
    for p in policies_data:
        policy = Policy(
            policy_id=p["policy_id"],
            name=p["name"],
            description=p["description"],
            category=p["category"],
            severity=p["severity"],
            status=p["status"],
            version=p["version"],
            policy_code=p["policy_code"],
            policy_language=p["policy_language"],
            target_departments=p["target_departments"],
            target_agent_classes=p["target_agent_classes"],
            target_risk_levels=p.get("target_risk_levels"),
            author=p["author"],
            reviewer=p.get("reviewer"),
            approved_by=p.get("approved_by"),
            total_evaluations=p["total_evaluations"],
            total_denials=p["total_denials"],
            total_allows=p["total_allows"],
            denial_rate=p["denial_rate"],
            simulation_pass=p.get("simulation_pass"),
            last_simulated_at=datetime.fromisoformat(p["last_simulated_at"]) if p.get("last_simulated_at") else None,
            created_at=datetime.fromisoformat(p["created_at"]),
            published_at=datetime.fromisoformat(p["published_at"]) if p.get("published_at") else None,
        )
        session.add(policy)
    await session.flush()
    print(f"  Seeded {len(policies_data)} policies")
    return policies_data


async def seed_audit_events(session: AsyncSession, agents: list[dict]) -> None:
    events_data = generate_audit_events(agents, 50000)
    batch_size = 1000
    for i in range(0, len(events_data), batch_size):
        batch = events_data[i:i + batch_size]
        for e in batch:
            event = AuditEvent(
                event_id=e["event_id"],
                agent_id=e["agent_id"],
                agent_name=e["agent_name"],
                department=e["department"],
                action=e["action"],
                action_category=e["action_category"],
                resource=e["resource"],
                decision=e["decision"],
                category=e["category"],
                policy_matched=e["policy_matched"],
                policy_rule=e["policy_rule"],
                trust_score=e["trust_score"],
                risk_score=e["risk_score"],
                budget_status=e["budget_status"],
                budget_remaining=e["budget_remaining"],
                decision_path=e["decision_path"],
                operator=e["operator"],
                operator_type=e["operator_type"],
                severity=e["severity"],
                record_hash=e["record_hash"],
                prev_hash=e["prev_hash"],
                sequence_number=e["sequence_number"],
                timestamp=datetime.fromisoformat(e["timestamp"]),
            )
            session.add(event)
        await session.flush()
        print(f"  Seeded audit events batch {i // batch_size + 1}/{(len(events_data) + batch_size - 1) // batch_size}")
    print(f"  Seeded {len(events_data)} audit events total")


async def seed_incidents(session: AsyncSession, agents: list[dict]) -> None:
    incidents_data = generate_incidents(agents, 150)
    for inc in incidents_data:
        incident = Incident(
            incident_id=inc["incident_id"],
            title=inc["title"],
            description=inc["description"],
            incident_type=inc["incident_type"],
            severity=inc["severity"],
            status=inc["status"],
            agent_ids=inc["agent_ids"],
            department=inc["department"],
            affected_systems=inc["affected_systems"],
            assigned_to=inc["assigned_to"],
            resolution=inc.get("resolution"),
            root_cause=inc.get("root_cause"),
            actions_taken=inc["actions_taken"],
            detection_time_ms=inc["detection_time_ms"],
            containment_time_ms=inc.get("containment_time_ms"),
            resolution_time_ms=inc.get("resolution_time_ms"),
            detected_at=datetime.fromisoformat(inc["detected_at"]),
            contained_at=datetime.fromisoformat(inc["contained_at"]) if inc.get("contained_at") else None,
            resolved_at=datetime.fromisoformat(inc["resolved_at"]) if inc.get("resolved_at") else None,
        )
        session.add(incident)
    await session.flush()
    print(f"  Seeded {len(incidents_data)} incidents")


async def seed_trust_history(session: AsyncSession, agents: list[dict]) -> None:
    history_data = generate_trust_history(agents, 20)
    batch_size = 2000
    for i in range(0, len(history_data), batch_size):
        batch = history_data[i:i + batch_size]
        for h in batch:
            record = TrustScore(
                agent_id=h["agent_id"],
                score=h["score"],
                previous_score=h["previous_score"],
                confidence=h["confidence"],
                observations=h["observations"],
                delta=h["delta"],
                event_type=h["event_type"],
                reason=h["reason"],
                recorded_at=datetime.fromisoformat(h["recorded_at"]),
            )
            session.add(record)
        await session.flush()
    print(f"  Seeded {len(history_data)} trust history records")


async def seed_graph(session: AsyncSession, agents: list[dict]) -> None:
    nodes_data, edges_data = generate_graph_data(agents)
    for n in nodes_data:
        node = GraphNode(
            node_id=n["node_id"],
            node_type=n["node_type"],
            label=n["label"],
            properties=n["properties"],
            cluster_id=n["cluster_id"],
            risk_score=n["risk_score"],
            is_suspicious=n["is_suspicious"],
            degree_centrality=n["degree_centrality"],
            department=n["department"],
        )
        session.add(node)
    await session.flush()
    
    for e in edges_data:
        edge = GraphEdge(
            source_id=e["source_id"],
            target_id=e["target_id"],
            edge_type=e["edge_type"],
            weight=e["weight"],
            is_suspicious=e["is_suspicious"],
            observed_at=datetime.fromisoformat(e["observed_at"]),
        )
        session.add(edge)
    await session.flush()
    print(f"  Seeded {len(nodes_data)} graph nodes and {len(edges_data)} graph edges")


async def seed_reports(session: AsyncSession) -> None:
    reports_data = generate_reports()
    for r in reports_data:
        report = GovernanceReport(
            report_id=r["report_id"],
            title=r["title"],
            report_type=r["report_type"],
            status=r["status"],
            summary=r["summary"],
            metrics=r["metrics"],
            findings=r["findings"],
            recommendations=r["recommendations"],
            period_start=datetime.fromisoformat(r["period_start"]),
            period_end=datetime.fromisoformat(r["period_end"]),
            departments_covered=r["departments_covered"],
            total_events=r["total_events"],
            total_incidents=r["total_incidents"],
            total_violations=r["total_violations"],
            compliance_score=r["compliance_score"],
            generated_by=r["generated_by"],
            created_at=datetime.fromisoformat(r["created_at"]),
        )
        session.add(report)
    await session.flush()
    print(f"  Seeded {len(reports_data)} reports")


async def seed_permissions(session: AsyncSession, agents: list[dict]) -> None:
    permissions_data = generate_permissions(agents, 500)
    for p in permissions_data:
        perm = Permission(
            permission_id=p["permission_id"],
            name=p["name"],
            description=p["description"],
            permission_type=p["permission_type"],
            scope=p["scope"],
            resource=p["resource"],
            agent_id=p["agent_id"],
            department=p["department"],
            agent_class=p["agent_class"],
            conditions=p["conditions"],
            is_active=p["is_active"],
            priority=p["priority"],
            created_by=p["created_by"],
            created_at=datetime.fromisoformat(p["created_at"]),
            expires_at=datetime.fromisoformat(p["expires_at"]) if p.get("expires_at") else None,
        )
        session.add(perm)
    await session.flush()
    print(f"  Seeded {len(permissions_data)} permissions")


async def seed_budgets(session: AsyncSession, agents: list[dict]) -> None:
    for a in agents:
        budget = Budget(
            agent_id=a["agent_id"],
            base_budget=a["base_budget"],
            trust_modifier=round(0.5 + a["trust_score"], 4),
            risk_modifier=round(1.5 - a["risk_score"], 4),
            criticality=round(random.uniform(0.5, 1.5), 4),
            effective_budget=a["current_budget"],
            spent=a["budget_spent"],
            remaining=round(a["current_budget"] - a["budget_spent"], 2),
            window=a["budget_window"],
            department=a["department"],
        )
        session.add(budget)
    await session.flush()
    print(f"  Seeded {len(agents)} budgets")


async def seed_approval_queue(session: AsyncSession, agents: list[dict]) -> None:
    approvals_data = generate_approval_queue(agents, 50)
    for a in approvals_data:
        approval = ApprovalQueue(
            request_id=a["request_id"],
            agent_id=a["agent_id"],
            agent_name=a["agent_name"],
            requested_operation=a["requested_operation"],
            trust_before=a["trust_before"],
            trust_after=a["trust_after"],
            confidence_before=a["confidence_before"],
            confidence_after=a["confidence_after"],
            status=ApprovalStatus(a["status"]),
            priority=a["priority"],
            requested_by=a["requested_by"],
            approved_by=a["approved_by"],
            rejection_reason=a["rejection_reason"],
            action_id=a["action_id"],
            policy_id=a["policy_id"],
            created_at=datetime.fromisoformat(a["created_at"]),
            reviewed_at=datetime.fromisoformat(a["reviewed_at"]) if a.get("reviewed_at") else None,
            expires_at=datetime.fromisoformat(a["expires_at"]) if a.get("expires_at") else None,
        )
        session.add(approval)
    await session.flush()
    print(f"  Seeded {len(approvals_data)} approval queue requests")


async def run_seed():
    print("CAZZ SHIELD — Database Seeding")
    print("=" * 50)
    
    await init_db()
    
    async with async_session_factory() as session:
        # Check if already seeded
        result = await session.execute(text("SELECT COUNT(*) FROM users"))
        count = result.scalar()
        if count and count > 0:
            print("Database already seeded. Skipping.")
            return
        
        print("Seeding database with enterprise mock data...")
        
        users = await seed_users(session)
        agents = await seed_agents(session)
        await seed_budgets(session, agents)
        await seed_policies(session)
        await seed_permissions(session, agents)
        await seed_trust_history(session, agents)
        await seed_incidents(session, agents)
        await seed_audit_events(session, agents)
        await seed_graph(session, agents)
        await seed_reports(session)
        await seed_approval_queue(session, agents)
        
        await session.commit()
        print("=" * 50)
        print("Database seeding complete!")
        print(f"  Users: 6")
        print(f"  Agents: 2500")
        print(f"  Policies: 320")
        print(f"  Permissions: 500")
        print(f"  Audit Events: 50000")
        print(f"  Incidents: 150")
        print(f"  Reports: 30")
        print(f"  Approval Queue: 50")


if __name__ == "__main__":
    asyncio.run(run_seed())
