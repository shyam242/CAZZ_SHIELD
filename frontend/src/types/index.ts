export type Role = 'admin' | 'operator' | 'auditor' | 'risk_officer' | 'ai_engineer' | 'security_admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  department?: string;
  title?: string;
  avatar_url?: string;
  is_active: boolean;
  mfa_enabled: boolean;
  last_login?: string;
  created_at: string;
}

export type AgentStatus = 'active' | 'paused' | 'quarantined' | 'suspended' | 'decommissioned' | 'pending_review' | 'emergency_stopped';

export type AgentRiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';

export interface Agent {
  id: string;
  agent_id: string;
  name: string;
  description?: string;
  agent_class: string;
  department: string;
  status: AgentStatus;
  risk_level: AgentRiskLevel;
  trust_score: number;
  trust_confidence: number;
  trust_observations: number;
  risk_score: number;
  base_budget: number;
  current_budget: number;
  budget_spent: number;
  budget_window: string;
  owner: string;
  owner_email?: string;
  version: string;
  model_provider?: string;
  model_name?: string;
  allowed_tools?: string[];
  allowed_apis?: string[];
  total_actions: number;
  total_violations: number;
  total_denials: number;
  last_action_at?: string;
  region: string;
  geography: string;
  onboarded_at: string;
  is_emergency_stopped: boolean;
  policy_ids?: string[];
}

export interface TrustScoreRecord {
  agent_id: string;
  score: number;
  previous_score?: number;
  confidence: number;
  delta: number;
  event_type: string;
  reason?: string;
  recorded_at: string;
}

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
  department?: string;
  currency: string;
}

export interface Policy {
  id: string;
  policy_id: string;
  name: string;
  description?: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'draft' | 'simulating' | 'peer_review' | 'canary' | 'active' | 'inactive' | 'rollback' | 'archived';
  version: number;
  policy_code: string;
  policy_language: string;
  target_departments?: string[];
  target_agent_classes?: string[];
  author: string;
  reviewer?: string;
  total_evaluations: number;
  total_denials: number;
  total_allows: number;
  denial_rate: number;
  simulation_pass?: boolean;
  last_simulated_at?: string;
  created_at: string;
  published_at?: string;
}

export interface Permission {
  id: string;
  permission_id: string;
  name: string;
  description?: string;
  permission_type: 'allow' | 'deny' | 'conditional';
  scope: string;
  resource: string;
  agent_id?: string;
  department?: string;
  agent_class?: string;
  conditions?: Record<string, any>;
  is_active: boolean;
  priority: number;
  created_by: string;
  created_at: string;
  expires_at?: string;
}

export interface AuditEvent {
  id: string;
  event_id: string;
  agent_id: string;
  agent_name?: string;
  department?: string;
  action: string;
  action_category?: string;
  resource?: string;
  decision: 'allowed' | 'denied' | 'escalated' | 'quarantined' | 'conditional';
  category: string;
  policy_matched?: string;
  policy_rule?: string;
  trust_score?: number;
  risk_score?: number;
  budget_status?: string;
  budget_remaining?: number;
  decision_path?: string;
  operator: string;
  operator_type: string;
  severity: string;
  record_hash: string;
  prev_hash: string;
  sequence_number: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  incident_id: string;
  title: string;
  description?: string;
  incident_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed' | 'false_positive';
  agent_ids?: string[];
  department?: string;
  affected_systems?: string[];
  assigned_to?: string;
  resolution?: string;
  root_cause?: string;
  actions_taken?: any[];
  detection_time_ms?: number;
  containment_time_ms?: number;
  detected_at: string;
  contained_at?: string;
  resolved_at?: string;
  created_at: string;
}

export interface GovernanceReport {
  id: string;
  report_id: string;
  title: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  status: string;
  summary?: string;
  metrics?: Record<string, any>;
  findings?: string[];
  recommendations?: string[];
  period_start: string;
  period_end: string;
  departments_covered?: string[];
  total_events: number;
  total_incidents: number;
  total_violations: number;
  compliance_score: number;
  generated_by: string;
  created_at: string;
}
