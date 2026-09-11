# R&D brief — Similar names (Namey P0 #4)

**Owner:** Berry implement · Design chip layout · R&D (this brief)  
**Stack:** current Vite/React only — pure function, no new libs  
**Source:** Edward cut via Research (`research-recs-2026-09-11-edward.md`)

## Goal
On Name detail, show **Similar names** — up to **6** tappable chips. Tap opens that name’s detail (same Save/Share). Hide the whole section if fewer than 1 candidate.

## API
```ts
// src/lib/similarNames.ts (suggested)
import type { NameEntry } from '../types';

export function similarNames(
  seed: NameEntry,
  pool: NameEntry[],
  n = 6,
): NameEntry[]
```

## Gender pool
Match session gender the same way scoring does (`matchesGender`):
- seed boy → `boy` | `unisex`
- seed girl → `girl` | `unisex`
- If opened from a boy session, pass the **filtered session pool** (or full `names.json` + session gender). Prefer the **same pool the deck used** so filters stay coherent.
- Always **exclude** `seed.id`.

## Score (higher = more similar)
For each candidate:

| Signal | Points |
| --- | --- |
| Shared origin (each overlap in `origins`) | **+3** per shared string |
| Same `vibe` | **+2** |
| Syllable distance | **+2** if `abs(sylDiff) === 0`; **+1** if `=== 1`; else **0** |
| Shared theme (optional tie-break) | **+0.5** per shared `themes` entry |

Sort by score desc, then `name` asc. Take top `n` with **score > 0**. If none, return `[]` (UI hides section).

Hypothesis only — Product can retune weights; keep weights as named constants at top of the file.

## UI (Berry + Design)
- Section title: **Similar names** (en-GB).
- Place **above** the share-card block on `NameDetailScreen` (after meaning grid).
- Chips: name label only; tap → `onOpen(id)` / set `selectedNameId` (same path as deck → detail).
- Empty: render nothing (no “no similar names” copy).
- Do not auto-save or change favourites on chip tap.

## Out of scope
- ML / embeddings / new datasets  
- Cross-gender “also like”  
- Image share / permanent host work  
- Renaming `skipsSinceSave` (deck Skip removal is separate Berry item)

## Acceptance
1. Detail for Oliver (boy) shows ≤6 chips; all boy|unisex; none is Oliver.  
2. Candidates with shared origins rank above vibe-only matches.  
3. Name with no overlaps → section hidden.  
4. Tap chip → that name’s detail; Back returns sensibly (existing back stack).  
5. No new dependencies in `package.json`.

## Wiring hint
`App.tsx` already holds the scored/filtered list — pass `pool` + `onOpenSimilar(id)` into `NameDetailScreen`. Keep `similarNames` pure and unit-testable without DOM.
