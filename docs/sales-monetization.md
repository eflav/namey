# Namey — sales & monetisation (draft)

**Owner:** Mr Sales  
**For:** Berry (Namey lead)  
**Date:** 2026-09-11  
**Status:** Draft for backlog — **quiet until live**. No public prices or Stripe until Edward approves (section 4).  
**Scope:** `/workspace/namey` only. Partner / Either stays cut unless Product reopens.

---

## 1) Who pays — and what they’d buy

### Primary buyer
**UK expectant parents** (and partners helping name), ~8–36 weeks pregnant, phone-first, often arriving from TikTok / share links.

| Segment | Why they pay | What they buy |
| --- | --- | --- |
| **A. Decision-stuck** (seen many names, still not sure) | Want a shortlist they trust + can revisit offline | Pro unlock: favourites tools, PDF shortlist, similar-names depth |
| **B. Couple / family aligners** | Need something shareable that isn’t “another endless list” | Share pack + (later) partner sync if Product reopens |
| **C. Second-timers** | Already used free apps; will pay once if it feels sharper | One-time Pro — hate subscriptions for a short naming window |

### Who does *not* pay (week 1)
- Casual browsers / gender-reveal curiosity  
- People blocked by flaky tunnel URL (hosting P0 — not a pricing problem)  
- B2B / hospitals / influencers as a sales motion (Marketing owns awareness; Sales closes parents)

### Willingness signal
Pay when: they’ve **saved ≥3 names** or opened Favourites twice — emotional investment, not first tap. Do **not** gate the first quiz or first few deck cards.

---

## 2) Offer — Namey Pro (v1)

**Positioning:** Free Namey finds the vibe. **Namey Pro** locks in the shortlist and keeps the noise out.

### Free (always)
- Boy / girl → cultures & themes → quiz → ranked deck  
- Save favourites, copy / share caption, ShareCard (screenshot path)  
- Soft recovery + A2HS (per product rules — don’t paywall install)

### Namey Pro unlocks (v1 — ship what’s already near-ready)

| Unlock | Why it sells | Build note |
| --- | --- | --- |
| **Unlimited saves** | Free cap creates the “I need this” moment | Cap free at **10 saved names** (clear, reversible) |
| **PDF shortlist** | Print / WhatsApp grandparents; tangible artefact | Favourites → one-page PDF (name + meaning) |
| **Similar names (Pro)** | Extends a name they already love | Free: hide or show 2 teaser chips; Pro: full 6 |
| **Ad-free** | Future-proof; honest even if ads aren’t live yet | No ads in v1 free either — still list as Pro promise |
| **Share pack** | Caption + app URL once host is permanent | Do not put rotating tunnel URL in Pro copy |

**Defer (not in first offer)**  
Partner sync / couple matching (cut this week). Fancy AI rename. Multi-device cloud account (local-first is a trust win — don’t force accounts for v1 pay).

---

## 3) Pricing (GBP) — simple first offer + week-1 goal

### First offer (recommend)
| | |
| --- | --- |
| **Product** | Namey Pro |
| **Price** | **£4.99** one-time (lifetime on that device / install) |
| **Why** | Naming window is short; parents hate another subscription. £4.99 is coffee-tier impulse after emotional save. |
| **Alt (if Edward prefers recurring)** | £2.99 / month, cancel anytime — only if one-time underperforms after 2 weeks of live traffic |

**Do not publish** these figures on site, TikTok, or App Store listings until Edward signs off (section 4).

### Conversion goal — week 1 *after* permanent host + Stripe live
| Metric | Target | Notes |
| --- | --- | --- |
| Free → Pro conversion | **2–4%** of sessions that hit the paywall | Paywall = attempt to save 11th name **or** tap PDF / Similar Pro |
| Absolute | **10 Pro purchases** in week 1 | Small n; proves checkout + copy, not scale |
| Leading indicator | ≥30% of paywall views start checkout | If lower, price/copy problem not traffic |

**Pre-live (now):** no conversion target on the Cloudflare tunnel — URL is not sales-stable. Quiet until hosting sticks.

### Paywall copy (en-GB, draft for Writer)
- Headline: **Keep your shortlist.**  
- Sub: Unlock unlimited saves, a PDF for family, and full similar names — one payment, yours to keep.  
- CTA: **Get Namey Pro — £4.99**  
- Secondary: Not now  

---

## 4) Payment later (Stripe) — what Edward must approve

**Stack (proposed):** Stripe Checkout (Payment Link or embedded) → webhook marks install Pro in `localStorage` + optional email receipt. No custom billing UI in week 1.

### Edward must approve before we ping him to go live

1. **Price & model** — £4.99 one-time vs £2.99/mo (or other).  
2. **Free save cap** — 10 names (or his number).  
3. **What’s in Pro** — list in section 2 (any cut/add).  
4. **Stripe account** — which legal entity / bank; UK GBP; who holds 2FA.  
5. **Refunds** — e.g. 14-day no-questions on Pro (recommended for trust).  
6. **Public copy** — paywall + TikTok CTA may show £ only after this approval.  
7. **Permanent host** — Pro checkout URL must not sit on a rotating tunnel.  
8. **Tax / VAT** — confirm Stripe Tax or manual; Sales will not invent VAT treatment.  
9. **Privacy** — Pro must not require account email unless Product decides; if Checkout collects email, say so in privacy copy (Writer).  

### Explicitly out of scope until Edward asks
Paid ads spend, App Store IAP (PWA-first), partner revenue share, StairFit cross-sell (products stay separate).

---

## Sales lane vs Marketing (Namey)

| | Owns |
| --- | --- |
| **Mr Marketing** | TikTok growth loop, creative, top-of-funnel |
| **Mr Sales** | Offer, paywall timing, checkout path, conversion goals, Edward approval checklist |
| **Berry** | Ship unlocks + host; greenlight when quiet period ends |

**Next from Sales (when Berry says go):** Stripe sandbox smoke → Edward approval card → live Payment Link on permanent host → week-1 conversion watch.

