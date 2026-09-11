# Namey — launch viability (research)

**For:** Berry (Namey lead) — final call yours  
**Date:** 2026-09-11  
**Scope:** Namey only (`/workspace/namey`). No StairFit.  
**Question:** Launch as a product, or treat as a liability?  
**Method:** Public market reports, store listings, birth stats, Play/TWA policy guides, Namey product state (GitHub Pages host + P0 cut; Cloudflare quick tunnel retired). Not a survey of parents; confidence marked per claim.

---

## Executive answer

**Recommendation: LAUNCH WITH GATES**

Namey is a real, shippable naming loop with a TikTok-shaped share path. It is **not** yet a business. Crowding is high, willingness to pay is low, Hosting was the P0 blocker; **Berry reports that gate met** (GitHub Pages). Remaining gates: partner-or-solo positioning, 30-day organic plan, Pro experiment discipline. Constrained launch — not a kill, not an all-in.

| Verdict | When it applies |
| --- | --- |
| **LAUNCH** | Permanent HTTPS host + privacy/disclaimer live + partner-or-solo positioning locked + 30-day organic metrics plan |
| **LAUNCH WITH GATES** ← **locked 2026-09-11** | Product works; economics and distribution unproven; **hosting gate met** |
| **DO NOT LAUNCH** | If Berry will not fund permanent host **or** refuses to kill Partner scope forever without a solo positioning story |

---

## 1) Market

### Demand (what is real)

- **Job to be done is universal:** every pregnancy needs a name. England & Wales alone: **585,396** live births in 2025 (ONS); **594,677** in 2024. Scotland ~45.8k (2024). US: **~3.63M** births in 2024 (CDC).  
  **Confidence: high** (official stats).
- **Parenting apps overall** are a large, growing category (~USD **1.3–1.8B** 2025/26 across paid market reports; CAGR variously cited ~11–20%). Baby-name tools are a **thin niche inside that**, not the market itself.  
  **Confidence: medium** (vendor reports disagree on size; treat as “category exists,” not TAM for Namey).
- **Intent channels:** SSA/ONS popularity lists, Nameberry/BabyCenter SEO, App Store “baby names,” and TikTok search/culture (“baby names,” reveal videos, partner swipe content). TikTok is a major search surface in 2025–26 marketing literature; Exact Namey keyword volumes were **not** measured in this pass.  
  **Confidence: medium** on TikTok-as-discovery; **low** on Namey-specific search volume.

### Crowding

- Crowded **free web** (Nameberry, BabyCenter, Behind the Name, generators).  
- Crowded **swipe apps** (Baby Name Genius / Nametrix, Kinder, many clones).  
- Crowded **AI/generator apps** on Play.  
**Implication:** discovery cost is the problem, not “is there demand.” New entrants win on **distribution + a sticky loop**, not on “we have names.”

### UK vs US

- UK: smaller birth base, stronger en-GB / privacy expectations — fits Namey’s copy tone.  
- US: ~6× birth volume, where Nametrix/Kinder already own App Store mindshare.  
**Implication:** UK-first organic TikTok + PWA is rational; US paid Play is expensive and hostile for a thin wrapper.

---

## 2) Competitors (top set)

| Competitor | Model | Price signals | Strength vs Namey | Weakness Namey can exploit |
| --- | --- | --- | --- | --- |
| **Baby Name Genius (Nametrix)** | Native swipe + partner match + deep data | Free; IAP ~$1.99–$2.99/mo; lifetime ~$6.99 (App Store listing) | Partner matching, popularity charts, press (NYT/GMA), offline data | Heavier, less “TikTok share card” first; not en-GB-first |
| **Kinder** | Swipe + partner match | Free locale set; packs ~$0.99; All Sets ~$4.99 | Simple addictive swipe, partner codes | Thin data; purchase fragmentation; sync quirks |
| **Nameberry** | SEO content site (+ tools) | Free / membership (historical) | Authority, traffic (~millions visits/mo in third-party estimates) | Not a mobile naming ritual; not share-native |
| **BabyCenter Name Finder** | Portal feature | Free (ad/portal) | Trust + pregnancy funnel | Generic UX; not a dedicated naming product |
| **Kindred Names** | Web “names like X” | Free (site) | Similarity discovery | No quiz→deck ritual; no app install loop |

Sources: Apple App Store / Google Play listings for Nametrix & Kinder (fetched 2026-09-11); Kindrednames.com; Semrush-style traffic mentions for Nameberry/BabyCenter (**medium** confidence on visit counts).

### Namey differentiation (honest)

**Strong today**

- Guided quiz → ranked endless deck (taste, not pure swipe randomness).  
- Favourites + share/copy + ShareCard (TikTok screenshot path).  
- en-GB, warm, parent-friendly copy; Similar names on detail (shipped).  
- Lightweight PWA (fast to try; no store gate for web).

**Weak today**

- **No partner matching** (Partner/Either cut) — category leaders lead with “name together.”  
- Shallow data vs Nametrix (no long popularity charts / famous people graphs).  
- **No permanent host** (Cloudflare quick tunnel; Origin blocked) — kills SEO, TikTok trust, A2HS stability.  
- Zero brand / SEO / reviews.  
- Monetisation not in product yet.

---

## 3) Unit economics sketch

**Assumptions (explicit):** Pro = **£4.99 one-time**; free core loop; optional ads later; CAC via TikTok or Play.

### Revenue realism

| Path | Sketch | Verdict |
| --- | --- | --- |
| **Organic TikTok → web PWA → Pro** | If share cards drive unpaid visits, CPI ≈ £0. Paywall conversion of **2–5%** of engaged users → **£0.10–£0.25** per engaged visitor. Needs volume. | **Only realistic path at indie scale** |
| **Paid TikTok → install/visit → Pro** | Consumer TikTok CPI often cited ~**$1.75–$4+** (category-dependent; Tier-1 higher). At £2–3 CAC and £4.99 LTV, you need **≥40–60%** of paid users to buy Pro — fantasy for a free naming tool. Even at **5%** conversion, LTV £0.25 vs CAC £2+ = **burn**. | **Do not buy installs until organic conversion known** |
| **Play TWA + IAP** | Same LTV problem + Play fee + TWA policy overhead + review risk. | **Defer** until web Pro converts |
| **Ads on free PWA** | Low RPM niche; pregnant users hate junk ads; trust hit. | **Last resort**, not year-one strategy |

**Confidence:** medium on CAC ranges (marketing blogs, not Namey campaigns); **high** that £4.99 one-time cannot fund paid UA at typical CPIs.

**Break-even intuition (organic):** 1,000 Pro sales ≈ **£5k** gross before tax/fees. Achievable only with sustained content + share loops, not a one-week launch.

---

## 4) Liabilities

| Risk | Severity | Notes |
| --- | --- | --- |
| **Unstable hosting / rotating tunnel** | **Closed (gate met)** | Public URL is now **https://eflav.github.io/namey/** (GitHub Pages) + **https://eflav.github.io/namey/privacy.html**. Cloudflare quick tunnel **retired** for public links. Still verify A2HS/SW on Pages in QA. |
| **Name meaning / etymology accuracy** | Medium | Industry norm: “as is” disclaimers. Cultural mis-meanings cause brand damage more than lawsuits. Need Writer + clear disclaimer. |
| **Trademarks on personal names** | Low–medium | Listing a given name ≠ trademark use; **“Namey” brand** and logos need clearance. Not legal advice — do a quick TM search before Play/App Store. |
| **Privacy / waitlist email** | Medium if collecting email | UK GDPR: lawful basis, privacy policy, retention. Local-only favourites today is a **strength** — keep it until accounts are worth it. |
| **Play TWA / PWA policy** | Medium if chasing Play | Need real HTTPS PWA, SW offline behaviour, Digital Asset Links, Data Safety, Policy 4.3 (not a thin wrapper). Family policies if marketed to kids (Namey is for parents — keep 17+ / parenting framing). |
| **Brand / trust** | Medium | Wrong meanings, flaky share, install nag, or partner absence vs ads claiming “for couples.” |
| **Support burden** | Low–medium | Local-only = few account tickets; more “why is my Home Screen dead?” if tunnel. |
| **Opportunity cost** | High for Edward’s time | StairFit is a paid services business. Namey only wins if Berry runs it as a **bounded experiment**, not an open-ended second company. |

---

## 5) Launch recommendation

### **LAUNCH WITH GATES**

**Why not DO NOT LAUNCH:** The product loop is coherent, TikTok-native share exists, UK en-GB positioning is clear, and build cost is already sunk. Killing it now wastes a working funnel without testing organic demand.

**Why not LAUNCH (unguarded):** Hosting is not production; monetisation and partner gap unproven; paid CAC math fails; Play is a distraction.

### Gates (must be true before “we’re launched”)

1. **Permanent HTTPS host** — **MET** (https://eflav.github.io/namey/). Tunnel retired for public links. Re-check SW/A2HS on Pages.  
2. **Privacy policy** — **MET** at https://eflav.github.io/namey/privacy.html (local shortlist; optional Pro waitlist email). Still add an on-device **name meanings “as is”** disclaimer if not already in-app.  
3. **Positioning locked:** either ship a minimal partner share-of-shortlist **or** market explicitly as “solo shortlist → share with partner” (honest, not fake couples app).  
4. **30-day organic plan** before any paid UA: TikTok posting cadence, ShareCard screenshot workflow, success metrics below.  
5. **Pro £4.99** behind a real paywall experiment (or decide free forever + ads later) — do not invent revenue in decks.

---

## 6) If launch: 30-day minimum bar / If not: kill or pivot

### If LAUNCH WITH GATES — first 30 days (minimum bar)

| Metric | Pass bar (suggested) | Fail → |
| --- | --- | --- |
| Stable URL uptime | ≥99% on permanent host | Fix hosting before features |
| Sessions (web) | ≥2,000 | Content/distribution problem |
| Save rate (session→≥1 favourite) | ≥25% | Quiz/deck UX |
| Share/copy attempts | ≥10% of sessions | ShareCard / CTA |
| Pro conversion (if paywalled) | ≥2% of engaged (≥1 save) | Kill paid UA; rethink price or stay free |
| P0 bugs from QA/Research | Zero open P0 | Hold marketing |

**Do in 30 days:** permanent host, disclaimer, TikTok organic only, instrument funnel (even lightweight), one Pro test **or** explicit free.  
**Do not:** Play launch, paid TikTok, StairFit cross-promotion spam, big brand spend.

### If DO NOT LAUNCH (Berry chooses kill)

- **Kill:** public marketing, Play work, paid UA, further feature sprawl.  
- **Keep / harvest:** ShareCard + quiz IP as open-source or portfolio; name dataset for later; lessons for other PWAs.  
- **Pivot options (only if Berry wants a second life):** (a) **SEO content site** (Nameberry-lite) instead of app; (b) **partner-match-first** rebuild to compete with Kinder/Nametrix; (c) **B2B** “name shortlist widget” for UK antenatal brands. Each is a new product — not a free rename.

---

## Sources (selected)

- ONS Births in England and Wales 2024 & 2025 final rates.  
- CDC / NCHS US births 2024.  
- NRS Scotland births 2024 (BBC summary).  
- Parenting apps market summaries: Business Research Insights, Maximize, TBRC, Technavio, InsightAce (treat ranges as indicative).  
- App Store / Play listings: Baby Name Genius (Nametrix), Kinder (pricing & features).  
- Kindred Names site; Nameberry / BabyCenter traffic commentary (third-party SEO tools — medium confidence).  
- Play TWA / Policy 4.3 guides (web.dev, SaasToStore, SpaceNexus — 2026 checklists).  
- TikTok CPI/CPA marketing benchmarks (multiple 2026 ad blogs — medium/low confidence; directionally “paid UA unlikely to pay back £4.99”).  
- Namey product state: `/workspace/namey`, interim tunnel, Research P0 acceptance 2026-09-11.

---

## Confidence overall

| Section | Confidence |
| --- | --- |
| Market demand exists | High |
| Baby-name niche is crowded | High |
| £4.99 cannot fund typical paid CPI | High |
| Exact TikTok search volume for Namey keywords | Low (not measured) |
| Competitor pricing | High (store listings) |
| Legal (TM / meanings) | Medium — needs counsel for brand clearance |

**Bottom line for Berry:** Treat Namey as a **gated product experiment**, not a liability to bury and not a growth company yet. **Host first. Organic TikTok second. Money third. Play never first.**


---

## Berry amendment (2026-09-11)

**Final call: LAUNCH WITH GATES** — agreed.

Hosting P0 is **cleared**: permanent URL https://eflav.github.io/namey/ (GitHub Pages). Privacy URL live. Root Digital Asset Links live for TWA.

Remaining gates: etymology disclaimer, solo→share positioning (locked), 30-day organic metrics, Pro money hold until Edward approves. Play AAB ready but Production is not the first growth bet.


---

## Addendum — Berry call (2026-09-11, afternoon)

**Call locked: LAUNCH WITH GATES.**

- **Hosting gate: MET** — public product URL **https://eflav.github.io/namey/**; privacy **https://eflav.github.io/namey/privacy.html**.
- **Cloudflare quick tunnel: RETIRED** for public / TikTok / research links. Do not cite the old `trycloudflare.com` URL.
- Research acceptance of the P0 product cut still stands; re-smoke A2HS/share on Pages when convenient (tunnel ≠ Pages for SW behaviour).
- Open gates for Berry’s 30-day plan: solo-vs-partner positioning, organic TikTok metrics, Pro/waitlist discipline (no paid UA until conversion known).

