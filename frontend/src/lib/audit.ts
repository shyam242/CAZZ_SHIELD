import { api } from './api';

export interface AuditEvent {
  id: string;
  event_id: string;
  agent_id: string;
  agent_name: string;
  department: string;
  action: string;
  action_category: string;
  resource: string;
  decision: string;
  category: string;
  policy_matched: string | null;
  policy_rule: string | null;
  trust_score: number;
  risk_score: number;
  budget_status: string;
  budget_remaining: number;
  decision_path: string;
  operator: string;
  operator_type: string;
  severity: string;
  record_hash: string;
  prev_hash: string;
  sequence_number: number;
  timestamp: string | null;
}

export interface AuditEventListResponse {
  events: AuditEvent[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AuditStats {
  total_events: number;
  total_allowed: number;
  total_denied: number;
  total_escalated: number;
  denial_rate: number;
  events_today: number;
  decision_distribution: {
    allowed: number;
    denied: number;
    escalated: number;
  };
}

export const auditApi = {
  listEvents: async (params?: {
    page?: number;
    page_size?: number;
    agent_id?: string;
    decision?: string;
    category?: string;
    severity?: string;
    department?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    const response = await api.get<AuditEventListResponse>('/audit/events', { params });
    return response.data;
  },

  getEvent: async (eventId: string) => {
    const response = await api.get<AuditEvent>(`/audit/events/${eventId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<AuditStats>('/audit/stats');
    return response.data;
  },
};
