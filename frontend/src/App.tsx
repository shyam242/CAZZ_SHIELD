import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { AgentFleetPage } from "./pages/AgentFleetPage";
import { AgentDetailsPage } from "./pages/AgentDetailsPage";
import { TrustEnginePage } from "./pages/TrustEnginePage";
import { RiskEnginePage } from "./pages/RiskEnginePage";
import { PolicyEnginePage } from "./pages/PolicyEnginePage";
import { PermissionEnginePage } from "./pages/PermissionEnginePage";
import { BudgetEnginePage } from "./pages/BudgetEnginePage";
import { GraphIntelligencePage } from "./pages/GraphIntelligencePage";
import { AuditExplorerPage } from "./pages/AuditExplorerPage";
import { GovernanceCopilotPage } from "./pages/GovernanceCopilotPage";
import { IncidentCenterPage } from "./pages/IncidentCenterPage";
import { EmergencyControlsPage } from "./pages/EmergencyControlsPage";
import { PolicySimulatorPage } from "./pages/PolicySimulatorPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="agents" element={<AgentFleetPage />} />
        <Route path="agents/:id" element={<AgentDetailsPage />} />
        <Route path="trust" element={<TrustEnginePage />} />
        <Route path="risk" element={<RiskEnginePage />} />
        <Route path="policies" element={<PolicyEnginePage />} />
        <Route path="permissions" element={<PermissionEnginePage />} />
        <Route path="budget" element={<BudgetEnginePage />} />
        <Route path="graph" element={<GraphIntelligencePage />} />
        <Route path="audit" element={<AuditExplorerPage />} />
        <Route path="copilot" element={<GovernanceCopilotPage />} />
        <Route path="incidents" element={<IncidentCenterPage />} />
        <Route path="emergency" element={<EmergencyControlsPage />} />
        <Route path="simulator" element={<PolicySimulatorPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
