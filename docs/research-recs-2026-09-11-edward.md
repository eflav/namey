# Namey — research / product recs from Edward (2026-09-11)

Source: Edward (direct). Treat as P0 product direction for this week’s TikTok path.
Partner/Either still cut unless Product reopens.

## 1. Remove deck Skip button
**Now:** Cycle has Next + Skip; both call `advance()`.
**Change:** Remove the Skip control (and `.btn-skip` styles). Keep Back / Next / Save / Share.
**Note:** Soft-recovery still counts advances without a save (`skipsSinceSave`) — rename in code later if useful; behaviour stays.

## 2. Quiz — skip a question when they have no answer
**Now:** Choosing an option is the only way forward; no “no preference”.
**Change:** On each quiz round, add a ghost control **Skip** / **Not sure** that advances without writing an answer for that `roundId`.
**Scoring:** Already ignores missing rounds (`if (!choice) continue` in `answersToPreferences`) — no scorer rewrite required.
**Copy (Writer):** prefer “Not sure” over “Skip” on quiz so it doesn’t clash with the removed deck Skip.

## 3. More names before pop-ups
**Now:** A2HS opens on **first Save** (`onFirstSave` → `maybePromptAfterSave`). Recovery soft panel every 8 advances without a save; hard recovery at `seen >= 12`.
**Change (assumed defaults — Product can tweak):**
- **A2HS:** only after user has **seen ≥ 10 names** *and* has **≥ 1 save** (still once per install). Do not fire on the first heart.
- **Soft recovery:** raise `SOFT_PROMPT_SKIPS` from 8 → **15**.
- Keep hard recovery at 12 only if favourites still empty *and* they haven’t dismissed — or align to 15 for consistency.

## 4. Similar Names
**Now:** Name detail has meaning / origin / share — no related names.
**Change:** On Name detail, section **Similar names** — up to **6** chips from the same gender pool, ranked by shared origins + vibe + syllable distance (reuse `names.json`; no new framework).
Tap → open that name’s detail (same Save/Share). Empty state: hide the section.
**R&D:** small pure function `similarNames(seed, pool, n=6)` — feasible this week on current Vite stack.

## Owner hints
| # | Owner |
| --- | --- |
| 1 Remove Skip | Berry |
| 2 Quiz Not sure | Berry + Writer |
| 3 Popup timing | Berry (+ Product if thresholds change) |
| 4 Similar Names | R&D spike brief → Berry; Design for chip layout |

## Out of scope
Recruiting / think-alouds paused until Product asks; these recs supersede waiting on parent sessions for this cut.
