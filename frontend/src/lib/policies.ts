import { api } from './api';

export interface Policy {
  id: string;
  policy_id: string;
  name: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  version: string;
  policy_code: string;
  policy_language: string;
  target_departments: string[];
  target_agent_classes: string[];
  author: string;
  reviewer: string;
  total_evaluations: number;
  total_denials: number;
  total_allows: number;
  denial_rate: number;
  simulation_pass: boolean;
  last_simulated_at: string | null;
  created_at: string | null;
  published_at: string | null;
}

export interface PolicyListResponse {
  policies: Policy[];
  total: number;
  page: number;
  page_size: number;
}

export interface PolicyStats {
  total: number;
  active: number;
  draft: number;
  categories: Array<{
    category: string;
    count: number;
  }>;
}

export interface SimulationRequest {
  policy_id: string;
  replay_hours: number;
}

export interface SimulationResponse {
  simulation_id: string;
  policy_id: string;
  status: string;
  blocked_actions: number;
  newly_allowed: number;
  policy_conflicts: number;
  affected_agents: number;
  blast_radius: number;
  impact_level: string;
  details: any;
  created_at: string;
}

export const policiesApi = {
  listPolicies: async (params?: {
    page?: number;
    page_size?: number;
    category?: string;
    status?: string;
    severity?: string;
    search?: string;
  }) => {
    const response = await api.get<PolicyListResponse>('/policies', { params });
    return response.data;
  },

  getPolicyStats: async () => {
    const response = await api.get<PolicyStats>('/policies/stats');
    return response.data;
  },

  getPolicy: async (policyId: string) => {
    const response = await api.get<Policy>(`/policies/${policyId}`);
    return response.data;
  },

  simulatePolicy: async (request: SimulationRequest) => {
    const response = await api.post<SimulationResponse>('/policies/simulate', request);
    return response.data;
  },
};
