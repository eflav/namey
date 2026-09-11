const STEPS = ['gender', 'filters', 'quiz', 'results'] as const;

type StepKey = (typeof STEPS)[number] | 'welcome' | 'detail' | 'favourites' | 'privacy';

export function Progress({ step }: { step: StepKey }) {
  if (step === 'welcome' || step === 'favourites' || step === 'privacy') return null;

  const active =
    step === 'detail' ? 'results' : STEPS.includes(step as (typeof STEPS)[number]) ? step : 'gender';
  const activeIndex = STEPS.indexOf(active as (typeof STEPS)[number]);

  return (
    <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={activeIndex + 1} aria-label="Naming progress">
      {STEPS.map((s, i) => {
        const state = i < activeIndex ? 'is-done' : i === activeIndex ? 'is-current' : '';
        return (
          <div key={s} className={`progress-seg ${state}`}>
            <span />
          </div>
        );
      })}
    </div>
  );
}
