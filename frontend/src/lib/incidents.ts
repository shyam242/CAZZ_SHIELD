import { api } from './api';

export interface Incident {
  id: string;
  incident_id: string;
  title: string;
  description: string;
  incident_type: string;
  severity: string;
  status: string;
  agent_ids: string[];
  department: string;
  affected_systems: string[];
  assigned_to: string;
  resolution: string | null;
  root_cause: string | null;
  actions_taken: string[];
  detection_time_ms: number;
  containment_time_ms: number;
  resolution_time_ms: number | null;
  detected_at: string | null;
  contained_at: string | null;
  resolved_at: string | null;
  created_at: string | null;
}

export interface IncidentListResponse {
  incidents: Incident[];
  total: number;
  page: number;
  page_size: number;
}

export interface IncidentStats {
  total: number;
  open: number;
  critical: number;
  resolved: number;
  avg_detection_ms: number;
}

export const incidentsApi = {
  listIncidents: async (params?: {
    page?: number;
    page_size?: number;
    severity?: string;
    status?: string;
    incident_type?: string;
    department?: string;
  }) => {
    const response = await api.get<IncidentListResponse>('/incidents', { params });
    return response.data;
  },

  getIncidentStats: async () => {
    const response = await api.get<IncidentStats>('/incidents/stats');
    return response.data;
  },

  getIncident: async (incidentId: string) => {
    const response = await api.get<Incident>(`/incidents/${incidentId}`);
    return response.data;
  },
};
