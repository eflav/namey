import { QUIZ_ROUNDS } from '../data/quiz';
import type { QuizAnswer } from '../types';

interface Props {
  index: number;
  answers: QuizAnswer[];
  onAnswer: (roundId: string, choiceId: string) => void;
  onSkip: () => void;
  onBack: () => void;
}

export function QuizScreen({ index, answers, onAnswer, onSkip, onBack }: Props) {
  const round = QUIZ_ROUNDS[index];
  if (!round) return null;

  const current = answers.find((a) => a.roundId === round.id)?.choiceId;
  const progressLabel = `Question ${index + 1} of ${QUIZ_ROUNDS.length}`;

  return (
    <section className="screen">
      <div className="stack">
        <p className="eyebrow">{progressLabel}</p>
        <h1>{round.prompt}</h1>
        {round.sub && <p className="lede">{round.sub}</p>}
      </div>

      <div className={`choice-grid ${round.choices.length === 2 ? 'two' : ''}`}>
        {round.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={`choice ${current === choice.id ? 'is-selected' : ''}`}
            onClick={() => onAnswer(round.id, choice.id)}
            aria-pressed={current === choice.id}
          >
            <span className="choice-title">{choice.label}</span>
            {choice.hint && <span className="choice-hint">{choice.hint}</span>}
          </button>
        ))}
      </div>

      <div className="footer-actions">
        <button type="button" className="btn btn-ghost btn-block" onClick={onSkip}>
          Not sure
        </button>
        <p className="quiz-skip-hint">Skip this one — you can still get good matches.</p>
        <button type="button" className="btn btn-ghost btn-block" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  );
}
