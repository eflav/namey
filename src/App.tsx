import { useEffect, useMemo, useRef, useState } from 'react';
import namesData from './data/names.json';
import { QUIZ_ROUNDS } from './data/quiz';
import { A2hsDialog } from './components/A2hsDialog';
import { ProWaitlistDialog } from './components/ProWaitlistDialog';
import { Progress } from './components/Progress';
import { SupportSheet } from './components/SupportSheet';
import { TrustStrip } from './components/TrustStrip';
import { useA2hs } from './hooks/useA2hs';
import { useFavourites } from './hooks/useFavourites';
import { useProWaitlist } from './hooks/useProWaitlist';
import { clearFlow, loadCycle, loadFlow, saveCycle, saveFlow } from './lib/persist';
import { rankNames } from './scoring';
import { CycleScreen, type CycleSession } from './screens/Cycle';
import { FavouritesScreen } from './screens/Favourites';
import { FiltersScreen } from './screens/Filters';
import { GenderScreen } from './screens/Gender';
import { NameDetailScreen } from './screens/NameDetail';
import { PrivacyScreen } from './screens/Privacy';
import { QuizScreen } from './screens/Quiz';
import { Welcome } from './screens/Welcome';
import type { FlowState, Gender, NameEntry, QuizAnswer } from './types';

const ALL_NAMES = namesData as NameEntry[];

const initialState = (): FlowState => ({
  step: 'welcome',
  gender: null,
  origins: [],
  themes: [],
  quizAnswers: [],
  quizIndex: 0,
  selectedNameId: null,
  relaxedFilters: false,
});

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

export default function App() {
  const [state, setState] = useState<FlowState>(() => loadFlow() ?? initialState());
  const [returnStep, setReturnStep] = useState<FlowState['step']>('welcome');
  const [cycleSession, setCycleSession] = useState<CycleSession | null>(() => loadCycle());
  const favs = useFavourites();
  const a2hs = useA2hs();
  const proWaitlist = useProWaitlist();
  const [supportOpen, setSupportOpen] = useState(false);

  // Persist mid-flight quiz / filters / step (not privacy chrome alone)
  useEffect(() => {
    saveFlow(state);
  }, [state]);

  useEffect(() => {
    saveCycle(cycleSession);
  }, [cycleSession]);

  useEffect(() => {
    if (state.step === 'favourites') {
      proWaitlist.maybePromptOnFavouritesOpen(favs.ids.length);
    }
  }, [state.step, favs.ids.length, proWaitlist.maybePromptOnFavouritesOpen]);

  const ranked = useMemo(() => {
    if (!state.gender || state.step === 'welcome' || state.step === 'gender' || state.step === 'filters') {
      return { names: [] as ReturnType<typeof rankNames>['names'], relaxed: false, message: undefined };
    }
    return rankNames(ALL_NAMES, state.gender, state.origins, state.themes, state.quizAnswers);
  }, [state.gender, state.origins, state.themes, state.quizAnswers, state.step]);

  const selectedName = useMemo(
    () => ALL_NAMES.find((n) => n.id === state.selectedNameId) ?? null,
    [state.selectedNameId],
  );

  const favouriteNames = useMemo(
    () => ALL_NAMES.filter((n) => favs.ids.includes(n.id)),
    [favs.ids],
  );

  const go = (step: FlowState['step']) => setState((s) => ({ ...s, step }));

  const restart = () => {
    clearFlow();
    setCycleSession(null);
    favs.clear();
    setState(initialState());
  };

  const openDetail = (id: string, from: FlowState['step']) => {
    setReturnStep(from);
    setState((s) => ({ ...s, selectedNameId: id, step: 'detail' }));
  };

  const openPrivacy = () => {
    setReturnStep(state.step === 'privacy' ? returnStep : state.step);
    go('privacy');
  };

  const waitlistShownRef = useRef(false);

  const handleToggleFavourite = (id: string) => {
    const result = favs.toggle(id);
    waitlistShownRef.current = false;
    if (result.added) {
      waitlistShownRef.current = proWaitlist.maybePromptAfterSave(result.count);
    }
  };

  const onNameSaved = (seen: number) => {
    // Prefer Pro waitlist over A2HS when both would fire on the same save
    if (waitlistShownRef.current) {
      waitlistShownRef.current = false;
      return;
    }
    // After save: favourites count will be ≥ 1; gate on seen ≥ 10
    const saves = Math.max(1, favs.ids.length + 1);
    a2hs.maybePromptAfterSave(seen, saves);
  };

  const onQuizSkip = () => {
    setState((s) => {
      const isLast = s.quizIndex >= QUIZ_ROUNDS.length - 1;
      if (isLast) return { ...s, step: 'results' };
      return { ...s, quizIndex: s.quizIndex + 1 };
    });
  };

  const onQuizAnswer = (roundId: string, choiceId: string) => {
    setState((s) => {
      const rest = s.quizAnswers.filter((a) => a.roundId !== roundId);
      const quizAnswers: QuizAnswer[] = [...rest, { roundId, choiceId }];
      const isLast = s.quizIndex >= QUIZ_ROUNDS.length - 1;
      if (isLast) {
        return { ...s, quizAnswers, step: 'results' };
      }
      return { ...s, quizAnswers, quizIndex: s.quizIndex + 1 };
    });
  };

  const quizBack = () => {
    setState((s) => {
      if (s.quizIndex <= 0) return { ...s, step: 'filters' };
      return { ...s, quizIndex: s.quizIndex - 1 };
    });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => go('welcome')} aria-label="Namey home">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          Namey
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label="Favourites"
          onClick={() => {
            setReturnStep(state.step === 'detail' ? returnStep : state.step);
            go('favourites');
          }}
        >
          ♥{favs.ids.length > 0 ? ` ${favs.ids.length}` : ''}
        </button>
      </header>

      <Progress step={state.step} />

      {state.step === 'welcome' && (
        <Welcome
          onStart={() => go('gender')}
          onFavourites={() => {
            setReturnStep('welcome');
            go('favourites');
          }}
          favCount={favs.ids.length}
        />
      )}

      {state.step === 'gender' && (
        <GenderScreen
          value={state.gender}
          onChange={(gender: Gender) => setState((s) => ({ ...s, gender }))}
          onNext={() => go('filters')}
          onBack={() => go('welcome')}
        />
      )}

      {state.step === 'filters' && (
        <FiltersScreen
          origins={state.origins}
          themes={state.themes}
          onToggleOrigin={(o) => setState((s) => ({ ...s, origins: toggleInList(s.origins, o) }))}
          onToggleTheme={(t) => setState((s) => ({ ...s, themes: toggleInList(s.themes, t) }))}
          onNext={() => setState((s) => ({ ...s, step: 'quiz', quizIndex: 0 }))}
          onBack={() => go('gender')}
        />
      )}

      {state.step === 'quiz' && (
        <QuizScreen
          index={state.quizIndex}
          answers={state.quizAnswers}
          onAnswer={onQuizAnswer}
          onSkip={onQuizSkip}
          onBack={quizBack}
        />
      )}

      {state.step === 'results' && (
        <CycleScreen
          names={ranked.names}
          message={ranked.message}
          favourited={favs.has}
          favouriteCount={favs.ids.length}
          onOpen={(id) => openDetail(id, 'results')}
          onToggleFavourite={handleToggleFavourite}
          onRefine={() => {
            setCycleSession(null);
            setState((s) => ({ ...s, step: 'quiz', quizIndex: 0 }));
          }}
          onLoosenFilters={() => {
            setCycleSession(null);
            setState((s) => ({
              ...s,
              origins: [],
              themes: [],
              relaxedFilters: true,
              step: 'filters',
            }));
          }}
          onRestart={restart}
          onFavourites={() => {
            setReturnStep('results');
            go('favourites');
          }}
          onNameSaved={onNameSaved}
          session={cycleSession}
          onSessionChange={setCycleSession}
        />
      )}

      {state.step === 'detail' && selectedName && (
        <NameDetailScreen
          name={selectedName}
          pool={ranked.names.length ? ranked.names : ALL_NAMES}
          favourited={favs.has(selectedName.id)}
          onToggleFavourite={() => handleToggleFavourite(selectedName.id)}
          onBack={() => go(returnStep === 'detail' ? 'results' : returnStep)}
          onOpenSimilar={(id) => openDetail(id, returnStep === 'favourites' ? 'favourites' : 'results')}
          onNameSaved={onNameSaved}
          namesSeen={cycleSession?.seen ?? 0}
        />
      )}

      {state.step === 'favourites' && (
        <FavouritesScreen
          names={favouriteNames}
          onOpen={(id) => openDetail(id, 'favourites')}
          onToggleFavourite={handleToggleFavourite}
          onBack={() => go(returnStep === 'favourites' ? 'welcome' : returnStep)}
          onRestart={restart}
          onSupport={() => setSupportOpen(true)}
        />
      )}

      {state.step === 'privacy' && (
        <PrivacyScreen
          onBack={() => go(returnStep === 'privacy' ? 'welcome' : returnStep)}
          onSupport={() => setSupportOpen(true)}
        />
      )}

      {state.step !== 'privacy' && (
        <TrustStrip onPrivacy={openPrivacy} tight={state.step === 'results' || state.step === 'quiz'} />
      )}

      <A2hsDialog
        open={a2hs.open}
        canNativeInstall={a2hs.canNativeInstall}
        isIos={a2hs.isIos}
        isAndroid={a2hs.isAndroid}
        onInstall={() => void a2hs.install()}
        onDismiss={a2hs.dismiss}
      />

      <ProWaitlistDialog
        open={proWaitlist.open}
        onSubmit={(email) => proWaitlist.join(email)}
        onDismiss={proWaitlist.dismiss}
      />

      <SupportSheet open={supportOpen} onClose={() => setSupportOpen(false)} />

      {proWaitlist.toast && (
        <div className="toast" role="status">
          {proWaitlist.toast}
        </div>
      )}
    </div>
  );
}
