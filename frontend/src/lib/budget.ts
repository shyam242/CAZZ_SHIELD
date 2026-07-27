import { api } from './api';

export interface Budget {
  agent_id: string;
  base_budget: number;
  trust_modifier: number;
  risk_modifier: number;
  criticality: number;
  effective_budget: number;
  spent: number;
  remaining: number;
  utilization_pct: number;
  window: string;
  is_frozen: boolean;
  violation_count: number;
  department: string;
  currency: string;
}

export interface BudgetListResponse {
  budgets: Budget[];
  total: number;
  page: number;
  page_size: number;
}

export interface BudgetOverview {
  total_budget: number;
  total_spent: number;
  total_remaining: number;
  total_frozen: number;
  total_violations: number;
  department_breakdown: Array<{
    department: string;
    allocated: number;
    spent: number;
    utilization: number;
  }>;
  top_spenders: Array<{
    agent_id: string;
    department: string;
    spent: number;
    effective_budget: number;
    utilization_pct: number;
  }>;
}

export interface BudgetForecast {
  agent_id: string;
  current_spent: number;
  current_remaining: number;
  projected_spend: number;
  projected_remaining: number;
  days_remaining_in_window: number;
  daily_average_spend: number;
  will_exceed: boolean;
  confidence: number;
}

export const budgetApi = {
  listBudgets: async (params?: {
    page?: number;
    page_size?: number;
    department?: string;
    is_frozen?: boolean;
  }) => {
    const response = await api.get<BudgetListResponse>('/budgets', { params });
    return response.data;
  },

  getOverview: async () => {
    const response = await api.get<BudgetOverview>('/budgets/overview');
    return response.data;
  },

  getAgentBudget: async (agentId: string) => {
    const response = await api.get<Budget>(`/budgets/agents/${agentId}`);
    return response.data;
  },

  getAgentForecast: async (agentId: string) => {
    const response = await api.get<BudgetForecast>(`/budgets/agents/${agentId}/forecast`);
    return response.data;
  },

  getFormula: async () => {
    const response = await api.get<any>('/budgets/formula');
    return response.data;
  },
};
