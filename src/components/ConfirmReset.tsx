interface Props {
  open: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ConfirmReset({ open, onConfirm, onDismiss }: Props) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="presentation">
      <div className="dialog-card" role="dialog" aria-labelledby="reset-title">
        <h2 id="reset-title">Start over?</h2>
        <p>This clears your quiz answers and saved names on this phone.</p>
        <p className="dialog-hint">For testing — clears quiz and shortlist on this phone.</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-primary btn-block" onClick={onConfirm}>
            Start over
          </button>
          <button type="button" className="btn btn-ghost btn-block" onClick={onDismiss}>
            Keep going
          </button>
        </div>
      </div>
    </div>
  );
}
