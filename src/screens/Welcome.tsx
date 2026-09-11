/* Namey welcome — COPY.md v3 */
interface Props {
  onStart: () => void;
  onFavourites: () => void;
  favCount: number;
}

export function Welcome({ onStart, onFavourites, favCount }: Props) {
  return (
    <section className="screen welcome-screen screen-with-sticky">
      <div className="welcome-hero">
        <div className="welcome-pink-slab" aria-hidden="true" />
        <p className="welcome-logo">
          Namey
          <span className="welcome-logo-dot" aria-hidden="true" />
        </p>
        <h1 className="welcome-headline">Find the name that feels like them.</h1>
      </div>

      <div className="welcome-copy stack">
        <p className="lede welcome-sub">
          Pick boy or girl, add any vibes you like, then a short quiz. We’ll show names with meanings you’ll remember.
        </p>

        <div className="trust-row" role="list">
          <span className="trust-pill" role="listitem">
            Boy or girl
          </span>
          <span className="trust-pill" role="listitem">
            Short quiz
          </span>
          <span className="trust-pill trust-pill-pink" role="listitem">
            Endless names
          </span>
        </div>
      </div>

      <div className="sticky-cta welcome-actions">
        <button type="button" className="btn btn-primary btn-block btn-cta" onClick={onStart}>
          Start naming
        </button>
        <button type="button" className="btn btn-secondary btn-block" onClick={onFavourites}>
          Favourites{favCount > 0 ? ` (${favCount})` : ''}
        </button>
      </div>
    </section>
  );
}
