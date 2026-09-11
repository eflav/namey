import { useCallback, useEffect, useState } from 'react';

const KEY = 'namey-favourites';
const LEGACY_KEY = 'kin-favourites';
const LEGACY_KEY_2 = 'given-favourites';

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY_2) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export interface FavouriteToggleResult {
  added: boolean;
  removed: boolean;
  count: number;
  ids: string[];
}

export function useFavourites() {
  const [ids, setIds] = useState<string[]>(() =>
    typeof window !== 'undefined' ? read() : [],
  );

  useEffect(() => {
    setIds(read());
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (id: string): FavouriteToggleResult => {
      const adding = !ids.includes(id);
      const next = adding ? [...ids, id] : ids.filter((x) => x !== id);
      persist(next);
      return { added: adding, removed: !adding, count: next.length, ids: next };
    },
    [ids, persist],
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const clear = useCallback(() => persist([]), [persist]);

  return { ids, toggle, has, clear };
}
