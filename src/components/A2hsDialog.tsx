interface Props {
  open: boolean;
  canNativeInstall: boolean;
  isIos: boolean;
  isAndroid: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export function A2hsDialog({
  open,
  canNativeInstall,
  isIos,
  isAndroid,
  onInstall,
  onDismiss,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={onDismiss}
    >
      <div
        className="dialog-card"
        role="dialog"
        aria-labelledby="a2hs-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="a2hs-title">Keep Namey handy</h2>
        <p>Add it to your Home Screen so your shortlist is one tap away. Nothing leaves this phone.</p>
        {!canNativeInstall && isIos && (
          <p className="dialog-hint" id="a2hs-hint">
            On iPhone: tap Share, then <strong>Add to Home Screen</strong>.
          </p>
        )}
        {!canNativeInstall && isAndroid && !isIos && (
          <p className="dialog-hint" id="a2hs-hint">
            On Android: open the browser menu, then <strong>Install app</strong> or{' '}
            <strong>Add to Home screen</strong>.
          </p>
        )}
        {!canNativeInstall && !isIos && !isAndroid && (
          <p className="dialog-hint" id="a2hs-hint">
            Use your browser menu to <strong>Install app</strong> or <strong>Add to Home Screen</strong>.
          </p>
        )}
        <div className="dialog-actions">
          {canNativeInstall ? (
            <button type="button" className="btn btn-primary btn-block" onClick={onInstall}>
              Add to Home Screen
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {
                document.getElementById('a2hs-hint')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
            >
              Got it
            </button>
          )}
          <button type="button" className="btn btn-ghost btn-block" onClick={onDismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
