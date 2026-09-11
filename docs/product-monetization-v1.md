# Namey — product monetization v1

**Owner:** Product (decisions) · Berry (build + profit features) · Writer (strings)  
**Scope:** `/workspace/namey` only — never mix with StairFit  
**Status:** Locked 2026-09-11 · Edward quiet until live · **no payment without Edward**

## Principles

1. **Free forever** for the core loop (gender → filters → quiz → deck → detail → shortlist → share).
2. **Shortlist stays on-device** — waitlist email is optional and separate; do not weaken the trust strip.
3. **No payment SDK, IAP, or tip processing** until Edward approves money. Tip is **copy-only** for now.
4. Growth = **share-led** (already mostly shipped). Monetization = **soft Pro waitlist**, not a paywall.

## P0 — revenue-ready free app

### (a) Soft Namey Pro waitlist (email) after 3rd save

| Decision | Lock |
| --- | --- |
| Trigger | After the **3rd distinct favourite** is saved in a lifetime on this install (`favourites.length` crosses 3). |
| Surface | One soft bottom sheet / dialog — not a hard block. Deck and Save keep working if they dismiss. |
| Fields | **Email only.** No name, no account, no password. |
| Frequency | Show at most **once** until they submit or choose “Not now”. If “Not now”, snooze **14 days** then allow one more soft ask; never interrupt mid-swipe — only after a successful Save that crosses the threshold (or on Favourites open if they crossed offline). |
| Trust | Waitlist copy must say shortlist **still stays on this phone**. Do not change default trust strip to imply an account. |
| Storage | Persist `proWaitlist: { status: 'pending'\|'joined'\|'dismissed', email?: string, askedAt }` locally. POST email to Berry’s waitlist endpoint when wired; until then queue locally and retry. |
| Out of scope | Forced signup, login wall, syncing shortlists to a server, Partner/Either. |

**Pro promise (product, not pricing):** early access to future Pro extras (e.g. partner compare, bigger name set, export). **Do not** name a price in-app.

### (b) Share-led growth (already mostly shipped)

Keep as primary growth loop. No new monetization dependency.

| Keep shipping / polishing | Do not |
| --- | --- |
| Web Share + share card (name + hidden meaning + Namey) | Paywall before share |
| Favourites multi-share caption | Watermark that kills TikTok screenshots |
| Trust strip + Privacy | Demanding email before first share |

Partner “both liked” remains **P1 / cut** unless Edward reopens — not required for monetization v1.

### (c) Optional tip / support CTA — copy only

| Decision | Lock |
| --- | --- |
| Placement | Favourites footer + Privacy screen — quiet text button, not primary pink CTA. |
| Behaviour now | Opens a short “Support Namey” sheet: thank-you copy + “Tips coming soon” (or Writer equivalent). **No** Stripe/Apple/Google pay, **no** external payment link that charges. |
| When Edward approves money | Swap sheet body for real tip flow; Product + Berry revisit. Until then this is **intent signalling only**. |

## Ship criteria (done when)

- [ ] Parents can complete the full free loop with **zero** email and **zero** payment forever.
- [ ] Crossing 3 saves can show the Pro waitlist once; dismiss does not break Save/Share/A2HS.
- [ ] Submitted email is stored/queued; clear “you’re on the list” confirmation.
- [ ] Tip/support is visible as copy-only; **no** payment SDK in the binary.
- [ ] Trust strip + Privacy still accurate (on-device shortlist; waitlist email is optional and explicit).
- [ ] All work under `/workspace/namey` only.

## Cuts / don’ts

- No Namey Pro paywall on deck, detail, or share.
- No Either / surprise-me / Partner sync in this v1.
- No inventing Pro prices or “50% off” offers.
- No StairFit folders, docs, or PRs touched.

## Handoffs

- **Writer:** waitlist title/body/CTAs + tip sheet strings (en-GB, parent-friendly) → `COPY-monetization.md` when ready.
- **Berry:** trigger wiring, local persist, waitlist POST, tip sheet shell.
- **Design:** sheet uses existing blue/pink flat system; primary CTA = Pro waitlist submit; tip = ghost/secondary.
- **Edward:** only needed to approve real money / payment SDK later.

## Acceptance smoke

1. Fresh install → save 1–2 names → no waitlist.  
2. Save 3rd → sheet appears; dismiss → can keep browsing; Save still works.  
3. Submit email → joined state; sheet does not reappear.  
4. Tip CTA → copy sheet only; no checkout.  
5. Privacy / trust copy still true for shortlist.
