export interface QuizChoice {
  id: string;
  label: string;
  hint?: string;
  effects: Partial<{
    classicModern: number;
    softBold: number;
    shortLong: number;
    familiarRare: number;
    softStrongSounds: number;
    familyFresh: number;
    vibeBoost: 'classic' | 'rising' | 'rare';
    themeBoost: string;
    originBoost: string;
  }>;
}

export interface QuizRound {
  id: string;
  kind: 'this-or-that' | 'axis';
  prompt: string;
  sub?: string;
  choices: QuizChoice[];
}

export const QUIZ_ROUNDS: QuizRound[] = [
  {
    id: 'era',
    kind: 'this-or-that',
    prompt: 'Which feels right on a birth announcement?',
    sub: 'Classic, or more modern.',
    choices: [
      {
        id: 'classic',
        label: 'Timeless',
        effects: { classicModern: -1, vibeBoost: 'classic', familiarRare: -0.4 },
      },
      {
        id: 'modern',
        label: 'Modern',
        effects: { classicModern: 1, vibeBoost: 'rising', familyFresh: 0.5 },
      },
    ],
  },
  {
    id: 'texture',
    kind: 'this-or-that',
    prompt: 'How should the name sound?',
    sub: 'Soft and flowing, or sharp and clear.',
    choices: [
      {
        id: 'soft',
        label: 'Soft & lyrical',
        effects: { softBold: -1, softStrongSounds: -1, themeBoost: 'Grace' },
      },
      {
        id: 'bold',
        label: 'Bold & clear',
        effects: { softBold: 1, softStrongSounds: 1, themeBoost: 'Strength' },
      },
    ],
  },
  {
    id: 'length',
    kind: 'axis',
    prompt: 'Short enough to shout across a park — or room to grow?',
    choices: [
      {
        id: 'short',
        label: 'Short & sweet',
        effects: { shortLong: -1, themeBoost: 'Short & sweet' },
      },
      {
        id: 'balanced',
        label: 'In between',
        effects: { shortLong: 0 },
      },
      {
        id: 'long',
        label: 'Longer, with presence',
        effects: { shortLong: 1 },
      },
    ],
  },
  {
    id: 'familiarity',
    kind: 'this-or-that',
    prompt: 'Should grandparents know it straight away?',
    choices: [
      {
        id: 'familiar',
        label: 'Familiar',
        effects: { familiarRare: -1, vibeBoost: 'classic', familyFresh: -0.6 },
      },
      {
        id: 'rare',
        label: 'A little uncommon',
        effects: { familiarRare: 1, vibeBoost: 'rare', themeBoost: 'Unique', familyFresh: 0.6 },
      },
    ],
  },
  {
    id: 'spirit',
    kind: 'this-or-that',
    prompt: 'Gentle, or quietly strong?',
    choices: [
      {
        id: 'gentle',
        label: 'Gentle',
        effects: { softBold: -0.7, themeBoost: 'Grace', softStrongSounds: -0.5 },
      },
      {
        id: 'steel',
        label: 'Quietly strong',
        effects: { softBold: 0.7, themeBoost: 'Strength', softStrongSounds: 0.5 },
      },
    ],
  },
  {
    id: 'heritage',
    kind: 'this-or-that',
    prompt: 'A name that links to family, or something new?',
    choices: [
      {
        id: 'family',
        label: 'Family link',
        effects: { familyFresh: -1, classicModern: -0.4, vibeBoost: 'classic' },
      },
      {
        id: 'fresh',
        label: 'Something new',
        effects: { familyFresh: 1, classicModern: 0.4, vibeBoost: 'rising' },
      },
    ],
  },
  {
    id: 'world',
    kind: 'axis',
    prompt: 'What world should this name feel from?',
    choices: [
      {
        id: 'nature',
        label: 'Nature & earth',
        effects: { themeBoost: 'Nature' },
      },
      {
        id: 'story',
        label: 'Myth & story',
        effects: { themeBoost: 'Mythology' },
      },
      {
        id: 'light',
        label: 'Light & wisdom',
        effects: { themeBoost: 'Light' },
      },
    ],
  },
];
