import { api } from './api';

export interface ApprovalRequest {
  id: string;
  request_id: string;
  agent_id: string;
  agent_name: string;
  requested_operation: string;
  trust_before: number;
  trust_after: number | null;
  confidence_before: number;
  confidence_after: number | null;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  priority: string;
  requested_by: string;
  approved_by: string | null;
  rejection_reason: string | null;
  action_id: string | null;
  policy_id: string | null;
  created_at: string | null;
  reviewed_at: string | null;
  expires_at: string | null;
  time_ago: string | null;
}

export interface ApprovalQueueResponse {
  approvals: ApprovalRequest[];
  total: number;
  page: number;
  page_size: number;
}

export interface ApprovalStats {
  total_requests: number;
  pending: number;
  approved: number;
  rejected: number;
  approval_rate: number;
  avg_approval_time_minutes: number;
}

export const approvalsApi = {
  getQueue: async (params?: { page?: number; page_size?: number; status?: string; priority?: string }) => {
    const response = await api.get<ApprovalQueueResponse>('/approvals/queue', { params });
    return response.data;
  },

  createRequest: async (data: {
    request_id: string;
    agent_id: string;
    agent_name: string;
    requested_operation: string;
    trust_before: number;
    priority?: string;
    action_id?: string;
    policy_id?: string;
  }) => {
    const response = await api.post('/approvals/queue', data);
    return response.data;
  },

  processAction: async (requestId: string, approved: boolean, rejectionReason?: string) => {
    const response = await api.post(`/approvals/queue/${requestId}/action`, {
      approved,
      rejection_reason: rejectionReason,
    });
    return response.data;
  },

  getRequest: async (requestId: string) => {
    const response = await api.get<ApprovalRequest>(`/approvals/queue/${requestId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApprovalStats>('/approvals/stats');
    return response.data;
  },
};
