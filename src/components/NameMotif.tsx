import { motifVariant } from '../lib/motif';

interface Props {
  nameId: string;
  className?: string;
  placement?: 'corner' | 'edge';
  /** Override hash variant (e.g. empty state disc = 0). */
  variant?: number;
}

/** Design motifs: hash%10 → 10 flat variants; colours #3B82F6 / #F472B6 only. */
export function NameMotif({ nameId, className = '', placement = 'corner', variant }: Props) {
  const v = variant ?? motifVariant(nameId);
  return (
    <div
      className={`name-motif name-motif-${v} name-motif-${placement} ${className}`.trim()}
      aria-hidden="true"
    >
      <svg viewBox="0 0 56 56" width="56" height="56" focusable="false">
        {v === 0 && <circle cx="28" cy="28" r="20" fill="#3B82F6" fillOpacity="0.55" />}
        {v === 1 && (
          <circle cx="28" cy="28" r="18" fill="none" stroke="#F472B6" strokeWidth="8" strokeOpacity="0.65" />
        )}
        {v === 2 && <rect x="6" y="18" width="44" height="20" rx="10" fill="#3B82F6" fillOpacity="0.5" />}
        {v === 3 && <rect x="10" y="10" width="36" height="36" rx="12" fill="#F472B6" fillOpacity="0.45" />}
        {v === 4 && (
          <>
            <circle cx="20" cy="28" r="12" fill="#3B82F6" fillOpacity="0.55" />
            <circle cx="38" cy="28" r="11" fill="#F472B6" fillOpacity="0.4" />
          </>
        )}
        {v === 5 && (
          <path
            d="M8 38 A20 20 0 0 1 48 38"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="10"
            strokeLinecap="round"
            strokeOpacity="0.55"
          />
        )}
        {v === 6 && (
          <>
            <rect x="12" y="8" width="8" height="40" rx="4" fill="#3B82F6" fillOpacity="0.55" />
            <rect x="24" y="8" width="8" height="40" rx="4" fill="#F472B6" fillOpacity="0.4" />
            <rect x="36" y="8" width="8" height="40" rx="4" fill="#3B82F6" fillOpacity="0.35" />
          </>
        )}
        {v === 7 && <rect x="6" y="22" width="44" height="12" rx="3" fill="#F472B6" fillOpacity="0.5" />}
        {v === 8 && (
          <ellipse cx="28" cy="28" rx="14" ry="22" fill="#F472B6" fillOpacity="0.5" transform="rotate(-25 28 28)" />
        )}
        {v === 9 && (
          <>
            <path d="M6 6 H50 V50 Z" fill="#3B82F6" fillOpacity="0.5" />
            <path d="M50 6 V50 H6 Z" fill="#F472B6" fillOpacity="0.4" />
          </>
        )}
      </svg>
    </div>
  );
}
