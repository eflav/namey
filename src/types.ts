export type Gender = 'boy' | 'girl';

export type Vibe = 'classic' | 'rising' | 'rare';

export interface NameEntry {
  id: string;
  name: string;
  gender: 'boy' | 'girl' | 'unisex';
  origins: string[];
  themes: string[];
  etymology: string;
  meaning: string;
  hiddenMeaning: string;
  syllables: number;
  length: number;
  vibe: Vibe;
  tags?: string[];
}

export interface ScoredName extends NameEntry {
  score: number;
}

export type FlowStep =
  | 'welcome'
  | 'gender'
  | 'filters'
  | 'quiz'
  | 'results'
  | 'detail'
  | 'favourites'
  | 'privacy';

export interface QuizAnswer {
  roundId: string;
  choiceId: string;
}

export interface Preferences {
  classicModern: number; // -1 classic … +1 modern
  softBold: number;
  shortLong: number;
  familiarRare: number;
  softStrongSounds: number;
  familyFresh: number;
}

export interface FlowState {
  step: FlowStep;
  gender: Gender | null;
  origins: string[];
  themes: string[];
  quizAnswers: QuizAnswer[];
  quizIndex: number;
  selectedNameId: string | null;
  relaxedFilters: boolean;
}
