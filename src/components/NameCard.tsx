import type { NameEntry } from '../types';

interface Props {
  name: NameEntry;
  rank?: number;
  favourited: boolean;
  onOpen: () => void;
  onToggleFavourite: () => void;
}

export function NameCard({ name, rank, favourited, onOpen, onToggleFavourite }: Props) {
  return (
    <div className="name-card" style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
      <button type="button" onClick={onOpen} style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>
        {rank != null && <div className="name-rank">Match {rank}</div>}
        <div className="name-title">{name.name}</div>
        <div className="name-meta">
          {name.meaning}
          {' · '}
          <span style={{ textTransform: 'capitalize' }}>{name.vibe}</span>
        </div>
      </button>
      <button
        type="button"
        className={`heart ${favourited ? 'is-on' : ''}`}
        aria-label={favourited ? `Remove ${name.name} from favourites` : `Save ${name.name}`}
        aria-pressed={favourited}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite();
        }}
      >
        {favourited ? '♥' : '♡'}
      </button>
    </div>
  );
}
