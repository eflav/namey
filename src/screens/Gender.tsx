import type { Gender } from '../types';

interface Props {
  value: Gender | null;
  onChange: (g: Gender) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS: { id: Gender; label: string; hint: string; tone: 'boy' | 'girl' }[] = [
  { id: 'boy', label: 'Boy', hint: 'Boy names · includes soft unisex picks', tone: 'boy' },
  { id: 'girl', label: 'Girl', hint: 'Girl names · includes soft unisex picks', tone: 'girl' },
];

export function GenderScreen({ value, onChange, onNext, onBack }: Props) {
  return (
    <section className="screen screen-with-sticky">
      <div className="stack">
        <p className="eyebrow">Step 1</p>
        <h1>Who are we naming?</h1>
        <p className="lede">Choose boy or girl. You can change this later.</p>
      </div>

      <div className="gender-grid gender-grid-full">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`gender-card gender-card-lg is-${opt.tone} ${value === opt.id ? 'is-selected' : ''}`}
            onClick={() => onChange(opt.id)}
            aria-pressed={value === opt.id}
          >
            <span className="choice-title">{opt.label}</span>
            <span className="choice-hint">{opt.hint}</span>
          </button>
        ))}
      </div>

      <div className="sticky-cta">
        <button type="button" className="btn btn-primary btn-block btn-cta" disabled={!value} onClick={onNext}>
          Continue
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  );
}
