import type { FlowState } from '../types';
import type { CycleSession } from '../screens/Cycle';

const FLOW_KEY = 'namey-flow-v1';
const CYCLE_KEY = 'namey-cycle-v1';

export function loadFlow(): FlowState | null {
  try {
    const raw = localStorage.getItem(FLOW_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FlowState;
    if (!parsed || typeof parsed.step !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveFlow(state: FlowState): void {
  try {
    localStorage.setItem(FLOW_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function clearFlow(): void {
  try {
    localStorage.removeItem(FLOW_KEY);
    localStorage.removeItem(CYCLE_KEY);
  } catch {
    /* ignore */
  }
}

export function loadCycle(): CycleSession | null {
  try {
    const raw = localStorage.getItem(CYCLE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CycleSession;
  } catch {
    return null;
  }
}

export function saveCycle(session: CycleSession | null): void {
  try {
    if (!session) {
      localStorage.removeItem(CYCLE_KEY);
      return;
    }
    localStorage.setItem(CYCLE_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}
