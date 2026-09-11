import type { NameEntry } from '../types';

/** Research/R&D default weights — Product may retune. */
export const ORIGIN_WEIGHT = 3;
export const VIBE_WEIGHT = 2;
export const SYL_EXACT = 2;
export const SYL_NEAR = 1;
export const THEME_WEIGHT = 0.5;

function genderCompatible(seed: NameEntry, other: NameEntry): boolean {
  // Same as scoring: boy → boy|unisex; girl → girl|unisex; unisex seed → either
  if (seed.gender === 'boy') return other.gender === 'boy' || other.gender === 'unisex';
  if (seed.gender === 'girl') return other.gender === 'girl' || other.gender === 'unisex';
  return other.gender === 'boy' || other.gender === 'girl' || other.gender === 'unisex';
}

/**
 * Rank related names from pool. Higher score = more similar.
 * Returns top n with score > 0; [] if none (UI hides section).
 */
export function similarNames(seed: NameEntry, pool: NameEntry[], n = 6): NameEntry[] {
  const scored = pool
    .filter((p) => p.id !== seed.id && genderCompatible(seed, p))
    .map((p) => {
      let score = 0;
      const originSet = new Set(seed.origins);
      for (const o of p.origins) {
        if (originSet.has(o)) score += ORIGIN_WEIGHT;
      }
      if (p.vibe === seed.vibe) score += VIBE_WEIGHT;
      const sylDiff = Math.abs((p.syllables || 0) - (seed.syllables || 0));
      if (sylDiff === 0) score += SYL_EXACT;
      else if (sylDiff === 1) score += SYL_NEAR;
      const themeSet = new Set(seed.themes);
      for (const t of p.themes) {
        if (themeSet.has(t)) score += THEME_WEIGHT;
      }
      return { p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name));

  return scored.slice(0, n).map((s) => s.p);
}
