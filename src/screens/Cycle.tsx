import { useEffect, useMemo, useState } from 'react';
import { ConfirmReset } from '../components/ConfirmReset';
import { NameMotif } from '../components/NameMotif';
import { continueCycle } from '../scoring';
import { shareCaptionSingle, shareOrCopy } from '../lib/share';
import type { ScoredName } from '../types';

export interface CycleSession {
  poolKey: string;
  deck: ScoredName[];
  index: number;
  seen: number;
  lap: number;
  skipsSinceSave: number;
  recoveryDismissed: boolean;
}

interface Props {
  names: ScoredName[];
  message?: string;
  favourited: (id: string) => boolean;
  favouriteCount: number;
  onOpen: (id: string) => void;
  onToggleFavourite: (id: string) => void;
  onRefine: () => void;
  onLoosenFilters: () => void;
  onRestart: () => void;
  onFavourites: () => void;
  onNameSaved?: (seen: number) => void;
  session: CycleSession | null;
  onSessionChange: (session: CycleSession) => void;
}

function vibeLabel(vibe: string) {
  return vibe.charAt(0).toUpperCase() + vibe.slice(1);
}

const RECOVERY_SEEN = 15;
const SOFT_PROMPT_SKIPS = 15;

export function CycleScreen({
  names,
  message,
  favourited,
  favouriteCount,
  onOpen,
  onToggleFavourite,
  onRefine,
  onLoosenFilters,
  onRestart,
  onFavourites,
  onNameSaved,
  session,
  onSessionChange,
}: Props) {
  const poolKey = useMemo(() => names.map((n) => n.id).join('|'), [names]);
  const [toast, setToast] = useState<string | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!names.length) return;
    if (session?.poolKey === poolKey) return;
    onSessionChange({
      poolKey,
      deck: names,
      index: 0,
      seen: 1,
      lap: 0,
      skipsSinceSave: 0,
      recoveryDismissed: false,
    });
    setShowRecovery(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolKey, names]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const deck = session?.deck?.length ? session.deck : names;
  const index = session?.index ?? 0;
  const seen = session?.seen ?? 1;
  const lap = session?.lap ?? 0;
  const skipsSinceSave = session?.skipsSinceSave ?? 0;
  const recoveryDismissed = session?.recoveryDismissed ?? false;
  const current = deck[index] ?? deck[0];

  const patch = (partial: Partial<CycleSession>) => {
    onSessionChange({
      poolKey,
      deck,
      index,
      seen,
      lap,
      skipsSinceSave,
      recoveryDismissed,
      ...partial,
    });
  };

  useEffect(() => {
    if (recoveryDismissed || favouriteCount > 0) return;
    if (seen >= RECOVERY_SEEN) setShowRecovery(true);
  }, [seen, favouriteCount, recoveryDismissed]);

  const goBack = () => {
    if (index <= 0) return;
    patch({ index: index - 1 });
  };

  const advance = () => {
    if (deck.length === 0) return;
    const nextSkips = favouriteCount === 0 ? skipsSinceSave + 1 : 0;
    const shouldSoftPrompt =
      !recoveryDismissed && favouriteCount === 0 && nextSkips > 0 && nextSkips % SOFT_PROMPT_SKIPS === 0;

    if (index + 1 < deck.length) {
      patch({ index: index + 1, seen: seen + 1, skipsSinceSave: nextSkips });
      if (shouldSoftPrompt) setShowRecovery(true);
      return;
    }
    const nextLap = lap + 1;
    const reshuffled = continueCycle(deck, Date.now() + nextLap);
    onSessionChange({
      poolKey,
      deck: reshuffled,
      index: 0,
      seen: seen + 1,
      lap: nextLap,
      skipsSinceSave: nextSkips,
      recoveryDismissed,
    });
    if (shouldSoftPrompt || (seen + 1 >= RECOVERY_SEEN && favouriteCount === 0 && !recoveryDismissed)) {
      setShowRecovery(true);
    }
  };

  const onSave = () => {
    const already = favourited(current.id);
    onToggleFavourite(current.id);
    if (!already) {
      patch({ skipsSinceSave: 0 });
      setShowRecovery(false);
      // After this save, favourites will be at least 1
      onNameSaved?.(seen);
    }
  };

  const dismissRecovery = () => {
    setShowRecovery(false);
    patch({ recoveryDismissed: true, skipsSinceSave: 0 });
  };

  const shareCurrent = async () => {
    if (!current) return;
    const result = await shareOrCopy(shareCaptionSingle(current));
    if (result === 'shared') setToast('Shared');
    else if (result === 'copied') setToast('Copied');
    else setToast('Couldn’t share');
  };

  if (!current) {
    return (
      <section className="screen">
        <div className="empty-recovery panel">
          <NameMotif nameId="empty" variant={0} placement="corner" />
          <h2>No matches this time</h2>
          <p>Nothing fitted that mix. Loosen the quiz or filters and try again.</p>
        </div>
        <div className="footer-actions">
          <button type="button" className="btn btn-primary btn-block" onClick={onLoosenFilters}>
            Try different filters
          </button>
          <button type="button" className="btn btn-secondary btn-block" onClick={onRefine}>
            Refine quiz
          </button>
        </div>
      </section>
    );
  }

  const isFav = favourited(current.id);
  const canGoBack = index > 0;

  return (
    <section className="screen cycle-screen">
      <div className="cycle-meta row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="eyebrow" style={{ margin: 0 }}>
          Match {seen} · keep going
        </p>
        <button type="button" className="btn btn-accent btn-sm" onClick={onFavourites}>
          ♥ Favourites
        </button>
      </div>

      {message && lap === 0 && seen <= 2 && <div className="notice">{message}</div>}

      {showRecovery && (
        <div className="recovery-panel panel" role="region" aria-label="Name tips">
          <h2>Not clicking yet?</h2>
          <p>
            No worries — try different filters, refine the quiz, or keep going. The right name often
            turns up a little later.
          </p>
          <div className="recovery-actions">
            <button type="button" className="btn btn-primary btn-block" onClick={onLoosenFilters}>
              Try different filters
            </button>
            <button type="button" className="btn btn-secondary btn-block" onClick={onRefine}>
              Refine quiz
            </button>
            <button type="button" className="btn btn-ghost btn-block" onClick={dismissRecovery}>
              Keep going
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="cycle-card"
        onClick={() => onOpen(current.id)}
        aria-label={`Open details for ${current.name}`}
      >
        <NameMotif nameId={current.id} placement="corner" />
        <div className="cycle-card-top">
          <span className={`badge badge-${current.vibe}`}>{vibeLabel(current.vibe)}</span>
          <span className="cycle-tap-hint">Tap for meaning</span>
        </div>
        <h1 className="cycle-name">{current.name}</h1>
        <p className="cycle-meaning">{current.meaning}</p>
        <p className="cycle-origin">{current.origins.slice(0, 3).join(' · ')}</p>
        <p className="cycle-teaser">{current.hiddenMeaning}</p>
      </button>

      <div className="cycle-nav">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="Previous name"
        >
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={advance}>
          Next
        </button>
      </div>

      <div className="cycle-actions">
        <button
          type="button"
          className={`btn btn-heart ${isFav ? 'is-on' : ''}`}
          aria-pressed={isFav}
          aria-label={isFav ? `Remove ${current.name} from favourites` : `Save ${current.name}`}
          onClick={onSave}
        >
          {isFav ? '♥ Saved' : '♡ Save'}
        </button>
      </div>

      <div className="footer-actions cycle-footer">
        <button type="button" className="btn btn-secondary btn-block" onClick={shareCurrent}>
          Share
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={() => setShowRecovery(true)}>
          Not finding a nice name?
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={onRefine}>
          Refine quiz
        </button>
        <p className="reset-caption">For testing — clears quiz and shortlist on this phone.</p>
        <button type="button" className="btn btn-ghost btn-block" onClick={() => setConfirmReset(true)}>
          Start over
        </button>
      </div>

      <ConfirmReset
        open={confirmReset}
        onConfirm={() => {
          setConfirmReset(false);
          onRestart();
        }}
        onDismiss={() => setConfirmReset(false)}
      />

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </section>
  );
}
