# Namey first-run think-aloud — research protocol

**Status:** greenlit 2026-09-11 (via Chief of Staff)  
**Product:** Namey (Kin) — interim https://came-politicians-views-legislative.trycloudflare.com  
**Ops:** hard-refresh / clear site data before each session (tunnel + iOS SW cache)  
**n:** 5 UK expectant or new parents  
**Modality:** moderated think-aloud, ~20 minutes, mobile viewport (phone preferred)

Related: `/workspace/namey/docs/spike-share-save-a2hs.md` (tunnel-vs-product labels).

---

## Research questions

1. Do parents trust the quiz enough to keep going?
2. Do deck matches feel “theirs”?
3. Does Save / Favourites / Share actually happen?
4. Where is friction a **product UX** issue vs **tunnel/hosting**?

Partner / Either stays out of scope this week unless Product reopens.

---

## Screener (recruit)

**Include if:**
- Lives in the UK
- Expecting, or has a child under ~2
- Comfortable on a phone browser
- English (en-GB fine; any UK English OK)

**Exclude if:**
- Works in baby-naming / baby-app product design
- Cannot share screen or talk for 20 minutes

**Ask (short):**
1. Expecting or child’s age?
2. Boy / girl / either / twins? (for session setup only — Partner/Either cut from product)
3. Phone OS (iOS / Android)?
4. Ever used a baby-name app? Which?

**Incentive:** TBD with Edward (voucher / goodwill).

---

## Consent (say aloud)

“We’re testing Namey, a baby-naming app. Think aloud — there are no wrong answers. Session is ~20 min. I’ll take notes on what you do and say; no recording unless you agree. You can stop anytime. OK to continue?”

---

## Moderator script

### Setup (2 min)
- Confirm phone + browser (Safari preferred on iOS).
- Send interim URL; ask them to **hard-refresh** or clear site data if they visited before.
- “I’m not the designer — be blunt.”

### Task path (core — ~15 min)

| # | Task | Success look | Watch |
| --- | --- | --- | --- |
| 1 | Open app, read Welcome, tap primary CTA | Starts naming without help | Trust / clarity of promise |
| 2 | Choose boy or girl | Continues | Confusion about later change |
| 3 | Filters / cultures — pick some **or** skip | Reaches quiz | Overwhelm vs skip clarity |
| 4 | Complete the quiz | Reaches name deck | Length, confidence, “gaming” answers |
| 5 | Browse the deck; open at least one meaning | Understands match + motif | “Feels like theirs”; Back/Next |
| 6 | Save ≥1 name | Favourites has it | Save discoverability |
| 7 | Open Favourites | Finds saved names | Nav clarity |
| 8 | Share or copy a name (or favourites) | Shared or copied toast / sheet | Caption sense; ShareCard screenshot path |
| 9 | (If first save fired A2HS) React to install prompt | Can dismiss or follow hints | iOS: Writer hints visible; primary must **not** kill hints before they’ve read them |
| 10 | Optional: “Nothing’s clicking” — try recovery / loosen filters | Uses recovery without quitting | Empty-deck trust |

### Closing (2 min)
1. What would make you come back tomorrow?
2. What felt most “for parents like you”?
3. What felt fake, slow, or confusing?
4. Would you share this with your partner / a friend? Why / why not?

---

## Severity rubric

| Sev | Meaning |
| --- | --- |
| **P0** | Blocks Save/Share or causes quit mid-flow (≥2 of 5) |
| **P1** | Strong hesitation / workaround; hurts TikTok path |
| **P2** | Polish / one-off confusion |
| **Tunnel** | Host rotate, old SW cache, missing permanent URL — **not** product severity |
| **By design** | e.g. no iOS `beforeinstallprompt` — note if discovery still fails |

Tag each row: **bug-candidate** (hand QA) vs **UX** (Product/Design/Writer).

---

## Output format (deliver to R&D pipeline)

Friction table:

| Step | Evidence (quote / behaviour, count) | Label | Sev | Recommended change | Owner hint |
| --- | --- | --- | --- | --- | --- |

Plus: 5-line executive summary; what we did **not** learn (n=5, tunnel host).

Owners: Product / Design / Writer / Berry — post table in **R&D pipeline**, ping Chief of Staff when done.

---

## Session log template

```
Participant: P#
OS / browser:
Expecting or child’s age:
Hard-refresh done: Y/N
Start time:

Notes (timestamped):
...

Save count:
Share result (shared / copied / failed / skipped):
A2HS shown: Y/N — reaction:
Recovery used: Y/N

Top 3 frictions:
1.
2.
3.
```
