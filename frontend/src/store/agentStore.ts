import { create } from 'zustand';
import { agentsApi, Agent } from '../lib/agents';

export interface AgentItem {
  uuid: string;
  id: string;
  name: string;
  description: string;
  agent_class: string;
  department: string;
  trustScore: number;
  riskScore: number;
  dailyBudget: string;
  spentBudget: string;
  status: string;
  risk_level: string;
  trust_confidence: number;
  trust_observations: number;
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
  permissionsCount: number;
  connectedApisCount: number;
  lastActivity: string;
}

interface AgentStoreState {
  agents: AgentItem[];
  loading: boolean;
  error: string | null;
  fetchAgents: (params?: any) => Promise<void>;
  quarantineAgent: (id: string) => Promise<void>;
  restrictAgent: (id: string) => Promise<void>;
  resumeAgent: (id: string) => Promise<void>;
  updateAgentStatus: (id: string, status: string) => Promise<void>;
  getAgentById: (id: string) => AgentItem | undefined;
}

const mapAgentToItem = (agent: Agent): AgentItem => ({
  uuid: agent.id,
  id: agent.agent_id,
  name: agent.name,
  description: agent.description,
  agent_class: agent.agent_class,
  department: agent.department,
  trustScore: Math.round(agent.trust_score * 100),
  riskScore: Math.round(agent.risk_score * 100),
  dailyBudget: `$${agent.base_budget.toLocaleString()}`,
  spentBudget: `$${agent.budget_spent.toLocaleString()}`,
  status: agent.status,
  risk_level: agent.risk_level,
  trust_confidence: agent.trust_confidence,
  trust_observations: agent.trust_observations,
  base_budget: agent.base_budget,
  current_budget: agent.current_budget,
  budget_spent: agent.budget_spent,
  budget_window: agent.budget_window,
  owner: agent.owner,
  owner_email: agent.owner_email,
  version: agent.version,
  model_provider: agent.model_provider,
  model_name: agent.model_name,
  allowed_tools: agent.allowed_tools,
  allowed_apis: agent.allowed_apis,
  total_actions: agent.total_actions,
  total_violations: agent.total_violations,
  total_denials: agent.total_denials,
  last_action_at: agent.last_action_at,
  region: agent.region,
  geography: agent.geography,
  onboarded_at: agent.onboarded_at,
  is_emergency_stopped: agent.is_emergency_stopped,
  policy_ids: agent.policy_ids,
  permissionsCount: agent.allowed_tools.length,
  connectedApisCount: agent.allowed_apis.length,
  lastActivity: agent.last_action_at ? new Date(agent.last_action_at).toLocaleString() : 'Unknown',
});

export const useAgentStore = create<AgentStoreState>((set, get) => ({
  agents: [],
  loading: false,
  error: null,
  
  fetchAgents: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await agentsApi.listAgents(params);
      const agents = response.agents.map(mapAgentToItem);
      set({ agents, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch agents', loading: false });
    }
  },

  quarantineAgent: async (id: string) => {
    try {
      await agentsApi.updateAgentStatus(id, 'quarantined');
      set((state) => ({
        agents: state.agents.map((agt) =>
          agt.id === id || agt.uuid === id ? { ...agt, status: 'quarantined', trustScore: Math.min(agt.trustScore, 20), riskScore: 85 } : agt
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to quarantine agent' });
    }
  },

  restrictAgent: async (id: string) => {
    try {
      await agentsApi.updateAgentStatus(id, 'paused');
      set((state) => ({
        agents: state.agents.map((agt) =>
          agt.id === id || agt.uuid === id ? { ...agt, status: 'paused', trustScore: 45, riskScore: 55 } : agt
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to restrict agent' });
    }
  },

  resumeAgent: async (id: string) => {
    try {
      await agentsApi.updateAgentStatus(id, 'active');
      set((state) => ({
        agents: state.agents.map((agt) =>
          agt.id === id || agt.uuid === id ? { ...agt, status: 'active', trustScore: 80, riskScore: 20 } : agt
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to resume agent' });
    }
  },

  updateAgentStatus: async (id: string, status: string) => {
    try {
      await agentsApi.updateAgentStatus(id, status);
      set((state) => ({
        agents: state.agents.map((agt) =>
          agt.id === id || agt.uuid === id ? { ...agt, status } : agt
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update agent status' });
    }
  },

  getAgentById: (id: string) => {
    const { agents } = get();
    return agents.find((a) => a.id === id || a.uuid === id);
  },
}));
