import { NameMotif } from './NameMotif';
import type { NameEntry } from '../types';

interface Props {
  name: NameEntry;
  /** Optional plain English theme chip */
  themeLabel?: string;
}

function meaningLine(n: NameEntry): string {
  return (n.hiddenMeaning || n.meaning || '').trim();
}

/** Screenshot-native 9:16-safe share card for TikTok. */
export function ShareCard({ name, themeLabel }: Props) {
  const chip = themeLabel || name.themes[0] || name.vibe;
  return (
    <div className="share-card" aria-hidden="true">
      <div className="share-card-inner">
        <div className="share-card-top">
          {chip && <span className="share-chip">{chip}</span>}
          <NameMotif nameId={name.id} placement="corner" />
        </div>
        <h2 className="share-card-name">{name.name}</h2>
        <p className="share-card-meaning">{meaningLine(name)}</p>
        <div className="share-card-footer">
          <span className="share-card-mark" aria-hidden="true">
            N
          </span>
          <span className="share-card-brand">Namey</span>
        </div>
      </div>
    </div>
  );
}
