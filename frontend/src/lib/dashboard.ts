import { api } from './api';

export interface DashboardKPIs {
  total_agents: number;
  active_agents: number;
  paused_agents: number;
  quarantined_agents: number;
  average_trust: number;
  average_risk: number;
  total_budget: number;
  total_spent: number;
  budget_utilization: number;
  total_policies: number;
  active_policies: number;
  policy_accuracy: number;
  total_audit_events: number;
  events_today: number;
  total_incidents: number;
  open_incidents: number;
  critical_incidents: number;
  avg_decision_latency_ms: number;
  system_health: number;
  emergency_mode: boolean;
}

export interface DashboardCharts {
  trust_distribution: Array<{
    range: string;
    count: number;
    label: string;
  }>;
  risk_heatmap: Array<{
    department: string;
    risk_level: string;
    count: number;
  }>;
  agent_status_breakdown: Array<{
    status: string;
    count: number;
  }>;
  audit_timeline: Array<{
    date: string;
    allowed: number;
    denied: number;
    total: number;
  }>;
  budget_by_department: Array<{
    department: string;
    allocated: number;
    spent: number;
  }>;
  policy_decisions: {
    allowed: number;
    denied: number;
    escalated: number;
  };
  incident_trend: Array<{
    date: string;
    count: number;
  }>;
  latency_trend: Array<{
    time: string;
    p50: number;
    p95: number;
  }>;
}

export interface SystemHealth {
  overall: number;
  components: Array<{
    name: string;
    status: string;
    uptime: number;
    latency_ms: number;
  }>;
  last_check: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action_type: string;
  severity: string;
}

export const dashboardApi = {
  getKPIs: async () => {
    const response = await api.get<DashboardKPIs>('/dashboard/kpis');
    return response.data;
  },

  getCharts: async () => {
    const response = await api.get<DashboardCharts>('/dashboard/charts');
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await api.get<SystemHealth>('/dashboard/health');
    return response.data;
  },

  getQuickActions: async () => {
    const response = await api.get<QuickAction[]>('/dashboard/quick-actions');
    return response.data;
  },
};
