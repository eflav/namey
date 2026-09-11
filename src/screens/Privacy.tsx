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
      </div>
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
