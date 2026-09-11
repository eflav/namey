/** Deterministic motif variant 0–9 from name id (Design). */
export function motifVariant(nameId: string): number {
  let h = 2166136261;
  for (let i = 0; i < nameId.length; i++) {
    h ^= nameId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 10;
}

export const MOTIF_NAMES = [
  'disc',
  'ring',
  'pill',
  'soft-square',
  'duo',
  'arc',
  'stripe',
  'band',
  'petal',
  'split',
] as const;

export type MotifName = (typeof MOTIF_NAMES)[number];

export function motifName(nameId: string): MotifName {
  return MOTIF_NAMES[motifVariant(nameId)]!;
}
