import { api } from './api';

export interface EmergencyStatus {
  emergency_mode: boolean;
  activated_at: string | null;
  activated_by: string | null;
  reason: string | null;
  affected_agents: number;
  frozen_budgets: number;
  revoked_permissions: number;
  actions_since_activation: Array<{
    action: string;
    timestamp: string;
    by: string;
  }>;
}

export interface EmergencyActivateRequest {
  reason: string;
  actions: string[];
}

export interface EmergencyDeactivateRequest {
  reason: string;
  restore_agents: boolean;
  restore_budgets: boolean;
}

export const emergencyApi = {
  getStatus: async () => {
    const response = await api.get<EmergencyStatus>('/emergency/status');
    return response.data;
  },

  activate: async (request: EmergencyActivateRequest) => {
    const response = await api.post('/emergency/activate', request);
    return response.data;
  },

  deactivate: async (request: EmergencyDeactivateRequest) => {
    const response = await api.post('/emergency/deactivate', request);
    return response.data;
  },

  stopAgent: async (agentId: string) => {
    const response = await api.post(`/emergency/agent/${agentId}/stop`);
    return response.data;
  },

  pauseDepartment: async (department: string) => {
    const response = await api.post(`/emergency/department/${department}/pause`);
    return response.data;
  },
};
