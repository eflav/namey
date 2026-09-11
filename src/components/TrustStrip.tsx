interface Props {
  onPrivacy: () => void;
  tight?: boolean;
}

export function TrustStrip({ onPrivacy, tight }: Props) {
  return (
    <button type="button" className="trust-strip" onClick={onPrivacy}>
      {tight ? 'On this phone · no account' : 'Shortlist stays on this phone · no account'}
    </button>
  );
}
