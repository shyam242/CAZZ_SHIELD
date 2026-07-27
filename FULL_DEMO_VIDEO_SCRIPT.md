# 📹 CAZZ SHIELD — Complete Video Recording Script & Voiceover Guide

> **For Video Submissions & Judge Demos**  
> *This script covers ALL 16 MODULES sequentially. Follow this exact flow while recording your screen.*

---

## 🎬 VIDEO RECORDING SETUP INSTRUCTIONS
1. **Resolution**: 1080p (1920x1080) Screen Recording
2. **Browser Window**: Chrome at `http://localhost:5173/login` in Fullscreen / Clean View
3. **Voiceover Tip**: Speak naturally, clear and unhurried. 

---

## ⏱️ SCENE-BY-SCENE VIDEO SCRIPT (ALL 16 MODULES)

---

### Module 1: Enterprise OIDC Login (`/login`)
- **Screen**: `http://localhost:5173/login`
- **What to show on video**:
  - Point mouse at the **Role Cards** (*Enterprise Administrator, Security Officer, Compliance Auditor*).
  - Click **"Security Officer"**, then click **"Authenticate & Launch Control Plane"**.
- **Voiceover Script**:
  > *"Welcome to the demo of **CAZZ SHIELD** — an Autonomous Governance & Self-Healing Control Plane built for Financial AI Agents. 
  > 
  > Here on our Enterprise Single Sign-On login page, we support role-based authentication for Administrators, Security Officers, Operators, and Auditors. I will authenticate right now as a Security Officer to launch the control plane."*

---

### Module 2: Enterprise Telemetry Dashboard (`/`)
- **Screen**: `http://localhost:5173/`
- **What to show on video**:
  - Hover over top metric cards (**1,850 Active**, **480 Restricted**, **140 Quarantined**, **30 Offline**).
  - Hover over **Today's Spend** (`$81,200`), **Policy Accuracy** (`99.94%`), and **Decision Latency** (`1.2 ms`).
  - Point to the **Spend vs Budget 24H Area Chart** and **Fleet Risk Distribution Pie Chart**.
- **Voiceover Script**:
  > *"This is our main **Enterprise Governance Dashboard**. Here we govern 2,500 active financial AI agents across the bank.
  > 
  > 1,850 agents are active, while 140 suspicious agents have been isolated in quarantine. Notice our decision latency is under **1.2 milliseconds**, ensuring zero friction for high-speed SWIFT transfers and trading flows."*

---

### Module 3: Agent Fleet Management (`/agents`)
- **Screen**: `http://localhost:5173/agents`
- **What to show on video**:
  - Type `"Treasury"` in the search bar.
  - Change the Department filter dropdown to `"Treasury"`.
  - Click on any agent row in the table (e.g. *Treasury Agent #1*).
  - Show the **Slide-Out Inspection Drawer** opening on the right side.
- **Voiceover Script**:
  > *"Moving to the **Agent Fleet Catalog**, we maintain a live registry of all 2,500 agents. We can search by name or filter by department like Treasury or Wire Transfers.
  > 
  > Clicking any agent opens a quick inspection drawer showing its live trust score, owner team, daily budget, and connected enterprise integrations."*

---

### Module 4: Agent Details View (`/agents/agt-1001`)
- **Screen**: Click **"Inspect"** button or navigate to `http://localhost:5173/agents/agt-1001`
- **What to show on video**:
  - Hover over the **Trust evolution chart** and **Budget utilization curve**.
  - Show connected SWIFT APIs, JPMorgan Settlement Accounts, and LLM Vendors (Claude 3.5 Sonnet).
  - Point to the **Emergency Isolation buttons** (*Quarantine Agent, Restrict Execution, Revoke Bearer Tokens*).
- **Voiceover Script**:
  > *"In the **Agent Details View**, we can perform deep-dive forensics. We view the agent’s 24-hour trust timeline, budget utilization curve, and connected SWIFT gateways. 
  > 
  > If an individual agent acts suspicious, a security officer can quarantine it or revoke its API bearer tokens with one click."*

---

### Module 5: Trust Engine & Mathematical Scoring (`/trust`)
- **Screen**: `http://localhost:5173/trust`
- **What to show on video**:
  - Point to the **Mathematical Formula Box**:
    $$T(t) = T_{\text{base}} + \alpha S_{\text{success}} + \beta H_{\text{approval}} - \gamma V_{\text{violation}} - \delta A_{\text{anomaly}} - \lambda \Delta t$$
  - Point to the **Fleet Average Trust Gauge** (`84.6%`).
  - Hover over the **Human-in-the-loop Approval Queue** table.
- **Voiceover Script**:
  > *"Our **Trust Engine** runs a live mathematical formula calibrating trust scores. Successful transactions add positive weights ($\alpha$), while policy violations ($\gamma$) and anomalous behavior ($\delta$) severely penalize trust. Inactive agents also experience time-based decay ($\lambda$).
  > 
  > Here, compliance officers can review human-in-the-loop sign-off requests for high-value operations."*

---

### Module 6: Risk Engine & Anomaly Stream (`/risk`)
- **Screen**: `http://localhost:5173/risk`
- **What to show on video**:
  - Point to the **Real-Time Anomaly Stream** items.
  - Hover over the **Agent Fleet Risk Score Breakdown Bar Chart**.
- **Voiceover Script**:
  > *"The **Risk Engine** uses statistical anomaly detection models to monitor request rates and payload deviations. When an anomaly occurs — such as an agent sending 450 requests per second — the engine instantly triggers automated containment."*

---

### Module 7: Policy Engine (`/policies`)
- **Screen**: `http://localhost:5173/policies`
- **What to show on video**:
  - Point to the policy list on the left (*SWIFT Transfer Limit Policy*).
  - Hover over the **OPA REGO Code Editor** showing REGO package rules.
  - Click **"Compile & Deploy"**. Show the green success indicator.
- **Voiceover Script**:
  > *"In the **Policy Engine**, governance policies are written in industry-standard **Open Policy Agent (OPA) REGO code**. Security teams can edit rules, validate syntax, view version history, and compile policies hot into production."*

---

### Module 8: Permission Engine (`/permissions`)
- **Screen**: `http://localhost:5173/permissions`
- **What to show on video**:
  - Hover over the constraint boxes (**Time-Based Rules, Geographic Bounds, Spend Caps**).
  - Point to the **Active Agent Permission Rules Matrix** table.
- **Voiceover Script**:
  > *"The **Permission Engine** evaluates contextual permission rules — enforcing market-hour time constraints, FATF-compliant geographic boundaries, and spend limits across all agent actions."*

---

### Module 9: Adaptive Budget Engine (`/budget`)
- **Screen**: `http://localhost:5173/budget`
- **What to show on video**:
  - Point to **Today's Fleet Spend** (`$81,200`) and **Cap** (`$100,000`).
  - Hover over the **Adaptive Formula Breakdown** (5% Floor / 150% Ceiling).
  - Point to the **7-Day Spend Forecast Chart**.
- **Voiceover Script**:
  > *"Our **Adaptive Budget Engine** dynamically adjusts agent spending caps based on trust scores. High-trust agents earn expanded spending ceilings up to 150%, while low-trust agents are automatically throttled down to a 5% floor to prevent financial losses."*

---

### Module 10: Graph Intelligence (`/graph`)
- **Screen**: `http://localhost:5173/graph`
- **What to show on video**:
  - Show the interactive React Flow node network (Agents, Banks, Accounts, APIs).
  - Click **"Highlight Suspicious Cluster"** (watch red nodes highlight!).
- **Voiceover Script**:
  > *"Here in **Graph Intelligence**, we map relationships connecting agents, escrow accounts, and LLM vendors. Clicking **'Highlight Suspicious Cluster'** uses graph detection to highlight agents attempting duplicate SWIFT transfers to the same bank node."*

---

### Module 11: Immutable Audit Explorer (`/audit`)
- **Screen**: `http://localhost:5173/audit`
- **What to show on video**:
  - Point to the **SHA-256 Hashes** in the audit log table.
  - Click an audit row to open the raw JSON payload drawer.
  - Point to the **"Export CSV"** and **"Export PDF"** buttons.
- **Voiceover Script**:
  > *"The **Audit Explorer** stores cryptographically signed SHA-256 logs for over 50,000 events. Auditors can inspect raw JSON payloads and export official SOC2 and FINRA compliance reports."*

---

### Module 12: AI Governance Assistant Copilot (`/copilot`)
- **Screen**: `http://localhost:5173/copilot`
- **What to show on video**:
  - Click the quick prompt pill: *"Summarize high-risk agents in Treasury operations"*.
  - Show the structured card response generated by Copilot.
- **Voiceover Script**:
  > *"Our read-only **Governance Copilot** lets operators ask natural language questions in plain English, returning structured summary cards without modifying underlying data."*

---

### Module 13: Security Incident Center (`/incidents`)
- **Screen**: `http://localhost:5173/incidents`
- **What to show on video**:
  - Point to the active incidents (*INC-901 Arbitrage Velocity Anomaly Breach*).
  - Click **"Mark Resolved & Restore Agent"** on an incident.
- **Voiceover Script**:
  > *"The **Incident Center** manages security alert escalations, operator comments, and resolution workflows for active anomalies."*

---

### Module 14: Emergency Control Center & Kill Switch (`/emergency`) ⭐ *CLIMAX MOMENT*
- **Screen**: `http://localhost:5173/emergency`
- **What to show on video**:
  - Point to the large red warning banner.
  - **CLICK THE BRIGHT RED BUTTON: "FLEET EMERGENCY STOP (KILL SWITCH)"**.
  - **Pause 2 seconds while the entire app flashes and turns into red animated emergency mode!**
  - Click **"RESUME FLEET OPERATIONS"** to bring the platform back online cleanly.
- **Voiceover Script**:
  > *"Now for our most critical feature: **The Emergency Control Center**. 
  > 
  > If a cyber attack occurs, a Security Officer hits the **Fleet Emergency Stop** [CLICK BUTTON]. In under 100 microseconds, CAZZ SHIELD halts all 2,500 agents, freezes budgets to $0, and revokes API keys. Once contained, clicking 'Resume Operations' brings the system safely back online."*

---

### Module 15: Policy Simulator & Historical Replay (`/simulator`)
- **Screen**: `http://localhost:5173/simulator`
- **What to show on video**:
  - Click **"Run Replay Simulation"**.
  - Show the simulation results (**48,920 Allowed, 1,500 Denied, Blast Radius: 14 Agents**).
- **Voiceover Script**:
  > *"Our **Policy Simulator** replays candidate OPA policies against 50,000 past audit logs in a dry-run sandbox, calculating block rates and blast radius before live deployment."*

---

### Module 16: Compliance Reports & Enterprise Settings (`/reports` & `/settings`)
- **Screen**: `http://localhost:5173/reports` $\rightarrow$ `http://localhost:5173/settings`
- **What to show on video**:
  - On `/reports`, point to **Download PDF** and **Download CSV**.
  - On `/settings`, show the Trust Engine hyperparameters ($\alpha, \beta, \gamma, \delta$) and SIEM webhooks.
- **Voiceover Script**:
  > *"Finally, the **Reports** and **Settings** modules enable regulatory PDF downloads and SIEM integrations with Splunk and Datadog. 
  > 
  > **CAZZ SHIELD** empowers financial institutions to deploy AI agents at scale with 100% security, self-healing governance, and zero financial risk. Thank you!"*
