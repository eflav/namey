import { useEffect, useState } from 'react';
import { NameCard } from '../components/NameCard';
import { ShareCard } from '../components/ShareCard';
import { shareCaptionFavourites, shareOrCopy } from '../lib/share';
import type { NameEntry } from '../types';

interface Props {
  names: NameEntry[];
  onOpen: (id: string) => void;
  onToggleFavourite: (id: string) => void;
  onBack: () => void;
  onRestart: () => void;
}

export function FavouritesScreen({ names, onOpen, onToggleFavourite, onBack, onRestart }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const shareList = async () => {
    const result = await shareOrCopy(shareCaptionFavourites(names));
    setToast(result === 'shared' ? 'Shared' : result === 'copied' ? 'Copied' : 'Couldn’t share');
  };

  return (
    <section className="screen">
      <div className="stack">
        <h1>Favourites</h1>
        <p className="lede">Saved on this device — easy to share with family, or on TikTok.</p>
      </div>

      {names.length === 0 ? (
        <div className="empty panel">
          <p>No favourites yet. Save names as you browse.</p>
        </div>
      ) : (
        <div className="name-list">
          {names.map((n) => (
            <NameCard
              key={n.id}
              name={n}
              favourited
              onOpen={() => onOpen(n.id)}
              onToggleFavourite={() => onToggleFavourite(n.id)}
            />
          ))}
        </div>
      )}

      {names.length > 0 && (
        <div className="share-card-wrap">
          <p className="share-card-label">Share card preview</p>
          <ShareCard name={names[0]!} />
        </div>
      )}

      <div className="footer-actions">
        {names.length > 0 && (
          <button type="button" className="btn btn-pink btn-block" onClick={shareList}>
            Share shortlist
          </button>
        )}
        <button type="button" className="btn btn-secondary btn-block" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={onRestart}>
          Start over
        </button>
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </section>
  );
}
