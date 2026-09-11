import type { FlowState } from '../types';
import type { CycleSession } from '../screens/Cycle';

const FLOW_KEY = 'namey-flow-v1';
const CYCLE_KEY = 'namey-cycle-v1';
const PRO_WAITLIST_KEY = 'namey-pro-waitlist-v1';
const WAITLIST_QUEUE_KEY = 'namey-waitlist-queue-v1';

export type ProWaitlistStatus = 'pending' | 'joined' | 'dismissed';

export interface ProWaitlistState {
  status: ProWaitlistStatus;
  email?: string;
  askedAt?: number;
  snoozeUntil?: number;
}

export interface WaitlistQueueItem {
  email: string;
  queuedAt: number;
}

const DEFAULT_WAITLIST: ProWaitlistState = { status: 'pending' };

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

export function loadProWaitlist(): ProWaitlistState {
  try {
    const raw = localStorage.getItem(PRO_WAITLIST_KEY);
    if (!raw) return { ...DEFAULT_WAITLIST };
    const parsed = JSON.parse(raw) as ProWaitlistState;
    if (!parsed || typeof parsed.status !== 'string') return { ...DEFAULT_WAITLIST };
    return {
      status: parsed.status,
      email: typeof parsed.email === 'string' ? parsed.email : undefined,
      askedAt: typeof parsed.askedAt === 'number' ? parsed.askedAt : undefined,
      snoozeUntil: typeof parsed.snoozeUntil === 'number' ? parsed.snoozeUntil : undefined,
    };
  } catch {
    return { ...DEFAULT_WAITLIST };
  }
}

export function saveProWaitlist(state: ProWaitlistState): void {
  try {
    localStorage.setItem(PRO_WAITLIST_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function loadWaitlistQueue(): WaitlistQueueItem[] {
  try {
    const raw = localStorage.getItem(WAITLIST_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is WaitlistQueueItem =>
        x && typeof x.email === 'string' && typeof x.queuedAt === 'number',
    );
  } catch {
    return [];
  }
}

export function enqueueWaitlistEmail(email: string): void {
  try {
    const next = [...loadWaitlistQueue(), { email, queuedAt: Date.now() }];
    localStorage.setItem(WAITLIST_QUEUE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

/** Best-effort POST; always keeps local queue. Stub /api/waitlist may no-op. */
export async function postWaitlistEmail(email: string): Promise<void> {
  enqueueWaitlistEmail(email);
  try {
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  } catch {
    /* queue-only until endpoint exists */
  }
}
