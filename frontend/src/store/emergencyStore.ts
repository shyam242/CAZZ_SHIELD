import { create } from 'zustand';
import { emergencyApi, EmergencyStatus } from '../lib/emergency';

interface EmergencyState {
  isEmergencyActive: boolean;
  emergencyMode: boolean;
  activatedAt: string | null;
  activatedBy: string | null;
  reason: string | null;
  affectedAgentsCount: number;
  frozenBudgetsCount: number;
  revokedPermissionsCount: number;
  actionsSinceActivation: any[];
  loading: boolean;
  error: string | null;
  fetchStatus: () => Promise<void>;
  activateFleetStop: (reason: string, actions: string[]) => Promise<void>;
  deactivateFleetStop: (reason: string, restoreAgents: boolean, restoreBudgets: boolean) => Promise<void>;
  toggleEmergencyMode: (active: boolean, reason?: string) => Promise<void>;
}

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  isEmergencyActive: false,
  emergencyMode: false,
  activatedAt: null,
  activatedBy: null,
  reason: null,
  affectedAgentsCount: 0,
  frozenBudgetsCount: 0,
  revokedPermissionsCount: 0,
  actionsSinceActivation: [],
  loading: false,
  error: null,

  fetchStatus: async () => {
    set({ loading: true, error: null });
    try {
      const status = await emergencyApi.getStatus();
      set({
        isEmergencyActive: status.emergency_mode,
        emergencyMode: status.emergency_mode,
        activatedAt: status.activated_at,
        activatedBy: status.activated_by,
        reason: status.reason,
        affectedAgentsCount: status.affected_agents,
        frozenBudgetsCount: status.frozen_budgets,
        revokedPermissionsCount: status.revoked_permissions,
        actionsSinceActivation: status.actions_since_activation,
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch emergency status', loading: false });
    }
  },

  activateFleetStop: async (reason, actions) => {
    set({ loading: true, error: null });
    try {
      await emergencyApi.activate({ reason, actions });
      await get().fetchStatus();
    } catch (error) {
      set({ error: 'Failed to activate emergency mode', loading: false });
    }
  },

  deactivateFleetStop: async (reason, restoreAgents, restoreBudgets) => {
    set({ loading: true, error: null });
    try {
      await emergencyApi.deactivate({ reason, restore_agents: restoreAgents, restore_budgets: restoreBudgets });
      await get().fetchStatus();
    } catch (error) {
      set({ error: 'Failed to deactivate emergency mode', loading: false });
    }
  },

  toggleEmergencyMode: async (active, reason = 'Security Officer Panic Button') => {
    if (active) {
      await get().activateFleetStop(reason, ['stop_agents', 'freeze_budgets']);
    } else {
      await get().deactivateFleetStop(reason, true, true);
    }
  },
}));
