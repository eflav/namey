import { supportCopy } from '../copy/monetization';

interface Props {
  onBack: () => void;
  onSupport?: () => void;
}

export function PrivacyScreen({ onBack, onSupport }: Props) {
  return (
    <section className="screen">
      <div className="stack">
        <h1>Privacy</h1>
        <p className="lede">
          Your favourites stay on this phone. We don’t create an account for you, and we don’t sync
          your shortlist anywhere.
        </p>
        <p className="lede">
          Namey doesn’t track you around the web. What you save here is yours alone on this device.
        </p>
        <p className="lede">
          If you join the optional Pro waitlist, we only use the email you type — your shortlist still
          stays on this phone.
        </p>
        <p className="lede">
          Meanings and origins are given as-is for inspiration. They are not certified history or a
          guarantee of accuracy.
        </p>
      </div>
      <p className="lede">
          <a href="https://eflav.github.io/namey/privacy.html" target="_blank" rel="noopener noreferrer">
            Full privacy policy
          </a>
        </p>
      <div className="footer-actions">
        {onSupport && (
          <button type="button" className="btn btn-ghost btn-block support-link" onClick={onSupport}>
            {supportCopy.trigger}
          </button>
        )}
        <button type="button" className="btn btn-primary btn-block" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  );
}
