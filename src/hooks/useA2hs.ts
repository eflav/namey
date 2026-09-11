import { useCallback, useEffect, useState } from 'react';

const DISMISS_KEY = 'namey-a2hs-dismissed';
const PROMPTED_KEY = 'namey-a2hs-prompted';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android/i.test(navigator.userAgent);
}

function alreadySettled(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1' || localStorage.getItem(PROMPTED_KEY) === '1';
  } catch {
    return false;
  }
}

export function useA2hs() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  /** Gate: seen ≥ 10 names AND ≥ 1 save; once per install. */
  const maybePromptAfterSave = useCallback((seen: number, saves: number) => {
    if (alreadySettled()) return;
    if (seen < 10 || saves < 1) return;
    try {
      localStorage.setItem(PROMPTED_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(true);
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
      localStorage.setItem(PROMPTED_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
    setDeferred(null);
  }, []);

  const install = useCallback(async () => {
    if (deferred) {
      await deferred.prompt();
      setDeferred(null);
      setOpen(false);
      try {
        localStorage.setItem(DISMISS_KEY, '1');
        localStorage.setItem(PROMPTED_KEY, '1');
      } catch {
        /* ignore */
      }
    }
  }, [deferred]);

  return {
    open,
    dismiss,
    install,
    maybePromptAfterSave,
    canNativeInstall: Boolean(deferred),
    isIos: isIos(),
    isAndroid: isAndroid(),
  };
}
