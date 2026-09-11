import type { Gender, NameEntry, Preferences, QuizAnswer, ScoredName } from './types';
import { QUIZ_ROUNDS } from './data/quiz';

const SOFT_SOUNDS = /[aeiouy]|ll|nn|mm|ss|th|sh|wh/i;
const STRONG_SOUNDS = /[xkqzr]|ck|tt|dd|br|kr|gr|tr|dr/i;

function emptyPrefs(): Preferences {
  return {
    classicModern: 0,
    softBold: 0,
    shortLong: 0,
    familiarRare: 0,
    softStrongSounds: 0,
    familyFresh: 0,
  };
}

export function answersToPreferences(answers: QuizAnswer[]): {
  prefs: Preferences;
  themeBoosts: string[];
  originBoosts: string[];
  vibeBoosts: Array<'classic' | 'rising' | 'rare'>;
} {
  const prefs = emptyPrefs();
  const themeBoosts: string[] = [];
  const originBoosts: string[] = [];
  const vibeBoosts: Array<'classic' | 'rising' | 'rare'> = [];

  for (const answer of answers) {
    const round = QUIZ_ROUNDS.find((r) => r.id === answer.roundId);
    const choice = round?.choices.find((c) => c.id === answer.choiceId);
    if (!choice) continue;
    const e = choice.effects;
    if (e.classicModern) prefs.classicModern += e.classicModern;
    if (e.softBold) prefs.softBold += e.softBold;
    if (e.shortLong) prefs.shortLong += e.shortLong;
    if (e.familiarRare) prefs.familiarRare += e.familiarRare;
    if (e.softStrongSounds) prefs.softStrongSounds += e.softStrongSounds;
    if (e.familyFresh) prefs.familyFresh += e.familyFresh;
    if (e.themeBoost) themeBoosts.push(e.themeBoost);
    if (e.originBoost) originBoosts.push(e.originBoost);
    if (e.vibeBoost) vibeBoosts.push(e.vibeBoost);
  }

  return { prefs, themeBoosts, originBoosts, vibeBoosts };
}

function matchesGender(name: NameEntry, gender: Gender): boolean {
  if (gender === 'boy') return name.gender === 'boy' || name.gender === 'unisex';
  if (gender === 'girl') return name.gender === 'girl' || name.gender === 'unisex';
  return false;
}

function matchesFilters(
  name: NameEntry,
  origins: string[],
  themes: string[],
  relax: boolean,
): boolean {
  if (relax) {
    if (origins.length === 0 && themes.length === 0) return true;
    const originOk = origins.length === 0 || name.origins.some((o) => origins.includes(o));
    const themeOk = themes.length === 0 || name.themes.some((t) => themes.includes(t));
    return originOk || themeOk;
  }
  const originOk = origins.length === 0 || name.origins.some((o) => origins.includes(o));
  const themeOk = themes.length === 0 || name.themes.some((t) => themes.includes(t));
  if (origins.length && themes.length) return originOk && themeOk;
  return originOk && themeOk;
}

function soundScore(name: NameEntry, prefs: Preferences): number {
  const soft = SOFT_SOUNDS.test(name.name) ? 1 : 0;
  const strong = STRONG_SOUNDS.test(name.name) ? 1 : 0;
  const profile = strong - soft;
  return -Math.abs(profile - prefs.softStrongSounds) * 0.8;
}

function lengthScore(name: NameEntry, prefs: Preferences): number {
  const syl = name.syllables;
  let profile = 0;
  if (syl <= 2) profile = -1;
  else if (syl >= 4) profile = 1;
  return -Math.abs(profile - prefs.shortLong) * 1.2;
}

function vibeScore(
  name: NameEntry,
  prefs: Preferences,
  vibeBoosts: Array<'classic' | 'rising' | 'rare'>,
): number {
  let score = 0;
  if (name.vibe === 'classic') {
    score += prefs.classicModern < 0 ? 2 : prefs.classicModern > 0.3 ? -0.5 : 0.5;
    score += prefs.familiarRare < 0 ? 1.5 : 0;
    score += prefs.familyFresh < 0 ? 1 : 0;
  } else if (name.vibe === 'rising') {
    score += Math.abs(prefs.classicModern) < 0.4 ? 1 : prefs.classicModern > 0 ? 2 : 0.2;
    score += prefs.familyFresh > 0 ? 1 : 0.2;
  } else {
    score += prefs.familiarRare > 0 ? 2.5 : prefs.familiarRare < -0.3 ? -1 : 0.5;
    score += prefs.classicModern > 0.2 ? 0.5 : 0;
  }
  for (const v of vibeBoosts) {
    if (name.vibe === v) score += 1.2;
  }
  return score;
}

function themeOriginScore(
  name: NameEntry,
  origins: string[],
  themes: string[],
  themeBoosts: string[],
  originBoosts: string[],
): number {
  let score = 0;
  const originHits = origins.filter((o) => name.origins.includes(o)).length;
  const themeHits = themes.filter((t) => name.themes.includes(t)).length;

  // Strong rewards for selected filters so English+Modern beats Classic/Scottish-first noise
  score += originHits * 8;
  score += themeHits * 8;

  if (origins.length > 0) {
    if (originHits === 0) score -= 12;
    else if (originHits === origins.length) score += 4;
  }
  if (themes.length > 0) {
    if (themeHits === 0) score -= 12;
    else if (themeHits === themes.length) score += 4;
  }
  // Both dimensions satisfied → clear top-of-deck boost
  if (origins.length && themes.length && originHits > 0 && themeHits > 0) {
    score += 10;
  }

  for (const t of themeBoosts) {
    if (name.themes.includes(t)) score += 2;
  }
  for (const o of originBoosts) {
    if (name.origins.includes(o)) score += 2;
  }
  return score;
}

function scoreName(
  name: NameEntry,
  prefs: Preferences,
  origins: string[],
  themes: string[],
  themeBoosts: string[],
  originBoosts: string[],
  vibeBoosts: Array<'classic' | 'rising' | 'rare'>,
): number {
  let score = 10;
  score += themeOriginScore(name, origins, themes, themeBoosts, originBoosts);
  // Quiz axes matter, but selected filters dominate ranking
  score += vibeScore(name, prefs, vibeBoosts) * 0.65;
  score += lengthScore(name, prefs) * 0.7;
  score += soundScore(name, prefs) * 0.7;

  if (name.themes.includes('Short & sweet') && prefs.shortLong < -0.3) score += 1.5;
  if (name.themes.includes('Unique') && prefs.familiarRare > 0.3) score += 1.5;
  if (name.themes.includes('Vintage') && prefs.classicModern < -0.2) score += 1;
  if (name.themes.includes('Modern') && prefs.classicModern > 0.3) score += 1;
  if (name.themes.includes('Strength') && prefs.softBold > 0.3) score += 1.2;
  if (name.themes.includes('Grace') && prefs.softBold < -0.3) score += 1.2;

  score += (name.id.charCodeAt(0) % 7) * 0.05;

  return score;
}

export interface RankResult {
  names: ScoredName[];
  relaxed: boolean;
  message?: string;
}

/** Rank the full filtered pool — no top-N slice. */
export function rankNames(
  all: NameEntry[],
  gender: Gender,
  origins: string[],
  themes: string[],
  answers: QuizAnswer[],
): RankResult {
  const { prefs, themeBoosts, originBoosts, vibeBoosts } = answersToPreferences(answers);

  const scorePool = (relax: boolean) => {
    const filtered = all.filter(
      (n) => matchesGender(n, gender) && matchesFilters(n, origins, themes, relax),
    );
    return filtered
      .map((n) => ({
        ...n,
        score: scoreName(n, prefs, origins, themes, themeBoosts, originBoosts, vibeBoosts),
      }))
      .sort((a, b) => b.score - a.score);
  };

  let scored = scorePool(false);
  let relaxed = false;
  let message: string | undefined;

  if (scored.length < 8) {
    scored = scorePool(true);
    relaxed = true;
    message = 'We widened your filters a little so you still get matches.';
  }

  if (scored.length < 1) {
    scored = all
      .filter((n) => matchesGender(n, gender))
      .map((n) => ({
        ...n,
        score: scoreName(n, prefs, origins, themes, themeBoosts, originBoosts, vibeBoosts),
      }))
      .sort((a, b) => b.score - a.score);
    relaxed = true;
    message = 'Few exact matches — showing names that still fit your quiz.';
  }

  // Absolute fallback so the deck is never empty
  if (scored.length < 1) {
    scored = all
      .map((n) => ({ ...n, score: 1 + (n.id.charCodeAt(0) % 5) * 0.1 }))
      .sort((a, b) => b.score - a.score);
    relaxed = true;
    message = 'Showing all names for your gender — keep going.';
  }

  return { names: scored, relaxed, message };
}

/**
 * After exhausting the ranked list, keep top third stable-ish and
 * reshuffle the rest with light score jitter so cycling never dead-ends.
 */
export function continueCycle(pool: ScoredName[], seed = Date.now()): ScoredName[] {
  if (pool.length <= 1) return pool.map((n) => ({ ...n }));

  const keepCount = Math.max(1, Math.floor(pool.length / 3));
  const head = pool.slice(0, keepCount).map((n) => ({ ...n }));
  const tail = pool.slice(keepCount).map((n, i) => {
    const jitter = ((seed + i * 9973 + n.id.charCodeAt(0) * 13) % 1000) / 1000;
    return { ...n, score: n.score * 0.55 + jitter * 4 };
  });

  // Fisher–Yates on tail
  for (let i = tail.length - 1; i > 0; i--) {
    const j = (seed + i * 7919) % (i + 1);
    const tmp = tail[i]!;
    tail[i] = tail[j]!;
    tail[j] = tmp;
  }

  tail.sort((a, b) => b.score - a.score);
  return [...head, ...tail];
}
