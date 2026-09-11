import { supportCopy } from '../copy/monetization';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SupportSheet({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog-card"
        role="dialog"
        aria-labelledby="support-namey-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="support-namey-title">{supportCopy.title}</h2>
        <p>{supportCopy.body}</p>
        <p className="dialog-hint">{supportCopy.statusLine}</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
            {supportCopy.close}
          </button>
        </div>
      </div>
    </div>
  );
}
