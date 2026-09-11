import { useState, type FormEvent } from 'react';
import { waitlistCopy } from '../copy/monetization';
import { isBasicEmail } from '../hooks/useProWaitlist';

interface Props {
  open: boolean;
  onSubmit: (email: string) => void | Promise<void>;
  onDismiss: () => void;
}

export function ProWaitlistDialog({ open, onSubmit, onDismiss }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isBasicEmail(email)) {
      setError(waitlistCopy.invalidEmail);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await onSubmit(email.trim());
      setEmail('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onDismiss}>
      <div
        className="dialog-card"
        role="dialog"
        aria-labelledby="pro-waitlist-title"
        onClick={(ev) => ev.stopPropagation()}
      >
        <h2 id="pro-waitlist-title">{waitlistCopy.title}</h2>
        <p>{waitlistCopy.body}</p>
        <form className="dialog-form" onSubmit={(ev) => void handleSubmit(ev)}>
          <label className="sr-only" htmlFor="pro-waitlist-email">
            {waitlistCopy.emailPlaceholder}
          </label>
          <input
            id="pro-waitlist-email"
            className="dialog-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={waitlistCopy.emailPlaceholder}
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value);
              if (error) setError(null);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'pro-waitlist-error' : undefined}
          />
          {error && (
            <p id="pro-waitlist-error" className="dialog-error" role="alert">
              {error}
            </p>
          )}
          <div className="dialog-actions">
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {waitlistCopy.primaryCta}
            </button>
            <button type="button" className="btn btn-ghost btn-block" onClick={onDismiss} disabled={busy}>
              {waitlistCopy.dismiss}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
