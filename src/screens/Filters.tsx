import { ORIGINS, THEMES } from '../data/options';

interface Props {
  origins: string[];
  themes: string[];
  onToggleOrigin: (o: string) => void;
  onToggleTheme: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FiltersScreen({
  origins,
  themes,
  onToggleOrigin,
  onToggleTheme,
  onNext,
  onBack,
}: Props) {
  return (
    <section className="screen screen-with-sticky">
      <div className="stack">
        <p className="eyebrow">Step 2</p>
        <h1>Any cultures or themes?</h1>
        <p className="lede">Tap what fits. Skip if you want every name still in play.</p>
      </div>

      <div className="panel stack" style={{ gap: 'var(--space-5)' }}>
        <div>
          <div className="section-label">Cultures &amp; origins</div>
          <div className="chip-grid">
            {ORIGINS.map((o) => (
              <button
                key={o}
                type="button"
                className={`chip ${origins.includes(o) ? 'is-selected' : ''}`}
                onClick={() => onToggleOrigin(o)}
                aria-pressed={origins.includes(o)}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="section-label">Themes</div>
          <div className="chip-grid">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                className={`chip is-theme ${themes.includes(t) ? 'is-selected' : ''}`}
                onClick={() => onToggleTheme(t)}
                aria-pressed={themes.includes(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky-cta">
        <button type="button" className="btn btn-primary btn-block btn-cta" onClick={onNext}>
          {origins.length || themes.length ? 'Continue' : 'Skip'}
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  );
}
