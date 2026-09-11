import { useEffect, useMemo, useState } from 'react';
import { NameMotif } from '../components/NameMotif';
import { ShareCard } from '../components/ShareCard';
import { similarNames } from '../lib/similarNames';
import { shareCaptionSingle, shareOrCopy } from '../lib/share';
import type { NameEntry } from '../types';

interface Props {
  name: NameEntry;
  pool: NameEntry[];
  favourited: boolean;
  onToggleFavourite: () => void;
  onBack: () => void;
  onOpenSimilar: (id: string) => void;
  onNameSaved?: (seen: number) => void;
  namesSeen?: number;
}

function vibeClass(vibe: string) {
  if (vibe === 'rare') return 'badge badge-rare';
  if (vibe === 'rising') return 'badge badge-accent';
  return 'badge badge-classic';
}

export function NameDetailScreen({
  name,
  pool,
  favourited,
  onToggleFavourite,
  onBack,
  onOpenSimilar,
  onNameSaved,
  namesSeen = 0,
}: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const similar = useMemo(() => similarNames(name, pool, 6), [name, pool]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const shareName = async () => {
    const result = await shareOrCopy(shareCaptionSingle(name));
    setToast(result === 'shared' ? 'Shared' : result === 'copied' ? 'Copied' : 'Couldn’t share');
  };

  const onSave = () => {
    if (!favourited) onNameSaved?.(namesSeen);
    onToggleFavourite();
  };

  return (
    <section className="screen">
      <div className="detail-hero">
        <NameMotif nameId={name.id} placement="corner" />
        <p className="eyebrow">{name.gender === 'unisex' ? 'Unisex' : name.gender === 'boy' ? 'Boy' : 'Girl'}</p>
        <h1 className="detail-name">{name.name}</h1>
        <div className="row">
          <span className={vibeClass(name.vibe)} style={{ textTransform: 'capitalize' }}>
            {name.vibe}
          </span>
          <span className="badge">
            {name.syllables} syllable{name.syllables === 1 ? '' : 's'}
          </span>
        </div>
        <p className="lede" style={{ maxWidth: '40ch' }}>
          {name.meaning}
        </p>
      </div>

      <div className="detail-grid">
        <div className="detail-block block-blue">
          <h3>Origin</h3>
          <p>{name.origins.join(' · ')}</p>
          <p style={{ marginTop: '0.75rem' }}>{name.etymology}</p>
        </div>
        <div className="detail-block">
          <h3>Meaning</h3>
          <p>{name.meaning}</p>
        </div>
        <div className="detail-block block-pink">
          <h3>Hidden meaning</h3>
          <p>{name.hiddenMeaning}</p>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="similar-section">
          <h2 className="similar-title">Similar names</h2>
          <div className="similar-chips">
            {similar.map((n) => (
              <button
                key={n.id}
                type="button"
                className="similar-chip"
                onClick={() => onOpenSimilar(n.id)}
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="share-card-wrap">
        <p className="share-card-label">Share card</p>
        <ShareCard name={name} />
      </div>

      <div className="footer-actions">
        <button type="button" className="btn btn-pink btn-block" onClick={onSave}>
          {favourited ? '♥ Saved' : '♡ Save this name'}
        </button>
        <button type="button" className="btn btn-secondary btn-block" onClick={shareName}>
          Share
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={onBack}>
          Back to names
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
