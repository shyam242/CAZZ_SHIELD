# CAZZ SHIELD — Enterprise AI Governance Platform

> **Autonomous Governance & Self-Healing Control Plane for Financial AI Agents**

CAZZ SHIELD is an enterprise-grade Autonomous Governance Control Plane built for high-stakes financial institutions, investment banks, and algorithmic trading desks managing fleets of AI Agents.

---

## 🚀 Key Platform Features & Modules

1. **Enterprise Telemetry Dashboard**: Real-time fleet metrics across 2,500 financial AI agents (Active, Restricted, Quarantined, Offline), spend vs budget caps, OPA policy accuracy, and decision latencies.
2. **2,500 Agent Fleet Catalog**: Searchable, filterable agent registry with drawer inspections for trust score histories, connected APIs, accounts, and emergency controls.
3. **Agent Details View**: In-depth trust evolution timeline, budget utilization curves, OPA policy history, connected SWIFT/Fedwire endpoints, and isolation matrix.
4. **Mathematical Trust Engine**: Real-time cryptographic score calculation:
   $$\text{Trust}(t) = T_{\text{base}} + \alpha S_{\text{success}} + \beta H_{\text{approval}} - \gamma V_{\text{violation}} - \delta A_{\text{anomaly}} - \lambda \Delta t$$
5. **Autonomous Risk Engine**: IsolationForest statistical anomaly feeds, velocity violation scoring, and sub-millisecond automated containment.
6. **OPA Policy Governance Engine**: Open Policy Agent REGO policy editor with AST validation, hot compilation, version history, rollback, and dry-run execution.
7. **Granular Permissions Matrix**: Contextual permission evaluator enforcing time-based, geography-based, tool-based, and spend-based constraints.
8. **Adaptive Budget Control Engine**: Dynamic budget caps scaled against real-time agent trust scores, spend velocity, and dynamic ceiling multipliers.
9. **Neo4j Graph Intelligence**: Interactive React Flow node network mapping Agents, Settlement Banks, Escrow Accounts, Vendor LLMs, and Policies with suspicious cluster highlighting.
10. **Immutable Audit Trail & Explorer**: Cryptographically signed SHA-256 log explorer with search, filters, and PDF/CSV compliance exports.
11. **AI Governance Assistant Copilot**: Read-only conversational AI assistant providing natural language telemetry answers and structured analytical cards.
12. **Incident Response Center**: Active security incident tracking, escalation workflows, containment verification, and manual officer sign-offs.
13. **Emergency Control Center (Kill Switch)**: Fleet Emergency Stop / Resume triggers pausing 2,500 agents, freezing budgets, rejecting new API requests, and generating real-time audit logs.
14. **Policy Simulator & Blast Radius Visualizer**: Historical event replay testing new OPA policies against 50,000 audit events without impacting production traffic.
15. **Compliance Reports Center**: Regulatory PDF & CSV report generation for SOC2 Type II, ISO 27001, and FINRA auditing.
16. **Enterprise Settings & SIEM Integration**: Configure trust weights, Datadog/PagerDuty webhooks, Splunk HEC integration, and RBAC user roles.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Enterprise Navy Blue/Royal Dark Palette
- **Graph Topology**: React Flow
- **Charts & Telemetry**: Recharts
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend & Database
- **Framework**: FastAPI (Python 3.12)
- **Database**: PostgreSQL (Production) / SQLite fallback (`sqlite+aiosqlite`)
- **ORM & Migrations**: SQLAlchemy 2.0 (Async) + Alembic
- **Caching & Queues**: Redis
- **Security & Auth**: JWT + OAuth2 + Multi-Role RBAC

---

## 💻 Local Development Setup

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Interactive API Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/health`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
- Open local web app: `http://localhost:5173`

---

## 🐳 Docker Deployment

```bash
docker-compose up --build -d
```
Access the complete platform stack at `http://localhost`.

---

## 🔐 Mock Enterprise Roles

| Role Name | Access Scope |
| :--- | :--- |
| **Admin** | Full administrative control across fleet, policies & emergency triggers |
| **Security Admin** | Emergency kill-switch, quarantine enforcement & audit reviews |
| **Operator** | Agent telemetry monitoring & incident management |
| **Auditor** | Read-only access to immutable audit logs & compliance reports |
| **AI Engineer** | Policy simulator testing, REGO editing & prompt evaluation |

---

© 2026 CAZZ SHIELD Enterprise AI Governance. All Rights Reserved.
