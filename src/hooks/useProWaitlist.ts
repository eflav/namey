import { useCallback, useEffect, useState } from 'react';
import {
  loadProWaitlist,
  postWaitlistEmail,
  saveProWaitlist,
  type ProWaitlistState,
} from '../lib/persist';
import { waitlistCopy } from '../copy/monetization';

const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const SAVE_THRESHOLD = 3;

function canAsk(state: ProWaitlistState): boolean {
  if (state.status === 'joined') return false;
  if (state.status === 'dismissed') {
    if (!state.snoozeUntil) return false;
    return Date.now() >= state.snoozeUntil;
  }
  // pending: show at most once until submit or Not now
  if (state.askedAt && !state.snoozeUntil) return false;
  return true;
}

export function useProWaitlist() {
  const [state, setState] = useState<ProWaitlistState>(() =>
    typeof window !== 'undefined' ? loadProWaitlist() : { status: 'pending' },
  );
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setState(loadProWaitlist());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const persist = useCallback((next: ProWaitlistState) => {
    setState(next);
    saveProWaitlist(next);
  }, []);

  const openSheet = useCallback((): boolean => {
    const current = loadProWaitlist();
    if (!canAsk(current)) return false;
    const next: ProWaitlistState = {
      ...current,
      status: 'pending',
      askedAt: Date.now(),
      snoozeUntil: undefined,
    };
    persist(next);
    setOpen(true);
    return true;
  }, [persist]);

  /** After a successful distinct save that may cross the threshold. */
  const maybePromptAfterSave = useCallback(
    (favouriteCount: number): boolean => {
      if (favouriteCount < SAVE_THRESHOLD) return false;
      if (!canAsk(loadProWaitlist())) return false;
      return openSheet();
    },
    [openSheet],
  );

  /** Favourites open if they crossed offline / never asked. */
  const maybePromptOnFavouritesOpen = useCallback(
    (favouriteCount: number): boolean => {
      if (favouriteCount < SAVE_THRESHOLD) return false;
      if (!canAsk(loadProWaitlist())) return false;
      return openSheet();
    },
    [openSheet],
  );

  const dismiss = useCallback(() => {
    persist({
      ...loadProWaitlist(),
      status: 'dismissed',
      askedAt: Date.now(),
      snoozeUntil: Date.now() + SNOOZE_MS,
    });
    setOpen(false);
  }, [persist]);

  const join = useCallback(
    async (email: string) => {
      const trimmed = email.trim();
      await postWaitlistEmail(trimmed);
      persist({
        status: 'joined',
        email: trimmed,
        askedAt: Date.now(),
        snoozeUntil: undefined,
      });
      setOpen(false);
      setToast(waitlistCopy.joinedToast);
    },
    [persist],
  );

  return {
    open,
    state,
    toast,
    clearToast: () => setToast(null),
    maybePromptAfterSave,
    maybePromptOnFavouritesOpen,
    dismiss,
    join,
  };
}

export function isBasicEmail(value: string): boolean {
  const v = value.trim();
  // Simple parent-friendly check — not RFC exhaustive
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
