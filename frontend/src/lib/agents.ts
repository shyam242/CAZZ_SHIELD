import { api } from './api';

export interface Agent {
  id: string;
  agent_id: string;
  name: string;
  description: string;
  agent_class: string;
  department: string;
  status: string;
  risk_level: string;
  trust_score: number;
  trust_confidence: number;
  trust_observations: number;
  risk_score: number;
  base_budget: number;
  current_budget: number;
  budget_spent: number;
  budget_window: string;
  owner: string;
  owner_email: string;
  version: string;
  model_provider: string;
  model_name: string;
  allowed_tools: string[];
  allowed_apis: string[];
  total_actions: number;
  total_violations: number;
  total_denials: number;
  last_action_at: string | null;
  region: string;
  geography: string;
  onboarded_at: string | null;
  is_emergency_stopped: boolean;
  policy_ids: string[];
}

export interface AgentListResponse {
  agents: Agent[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AgentStats {
  total: number;
  departments: Array<{
    department: string;
    count: number;
    avg_trust: number;
    avg_risk: number;
  }>;
  statuses: Record<string, number>;
}

export const agentsApi = {
  listAgents: async (params?: {
    page?: number;
    page_size?: number;
    department?: string;
    status?: string;
    risk_level?: string;
    trust_min?: number;
    trust_max?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  }) => {
    const response = await api.get<AgentListResponse>('/agents', { params });
    return response.data;
  },

  getAgentStats: async () => {
    const response = await api.get<AgentStats>('/agents/stats');
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get<Array<{ department: string; count: number }>>('/agents/departments');
    return response.data;
  },

  getAgent: async (agentId: string) => {
    const response = await api.get<Agent>(`/agents/${agentId}`);
    return response.data;
  },

  updateAgentStatus: async (agentId: string, status: string) => {
    const response = await api.patch(`/agents/${agentId}/status`, null, {
      params: { status }
    });
    return response.data;
  },
};
