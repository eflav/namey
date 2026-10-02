# Namey: Play Console answers (Product, 2 Oct 2026)

Paste-ready answers for the Play Console declarations. Based on the current build: favourites, quiz state and the waitlist queue sit in localStorage; the only network send is the optional Pro waitlist email (`POST /api/waitlist`). No ads, no analytics, no account, no payments.

## App content

- **Privacy policy:** https://eflav.github.io/namey/privacy.html
- **Ads:** No, the app does not contain ads.
- **App access:** All functionality is available without special access (no login).
- **Target audience and content:** **18 and over only.** Namey is for expecting parents. Do not tick any under-18 band, so Designed for Families does not apply.
- **Appeals to children?** No.
- **News app:** No. **Government app:** No. **Financial features:** None. **Health:** None. **COVID-19 tracing:** No.

## Data safety

- **Does the app collect or share user data?** Yes.
- **Is all user data encrypted in transit?** Yes (HTTPS only).
- **Can users request their data be deleted?** Yes (by emailing the contact address; see gap 2 below).

Data types, only one:

| Type | Collected | Shared | Optional? | Purpose | Ephemeral? |
|---|---|---|---|---|---|
| Personal info > Email address | Yes | No | Optional (only if the user joins the Pro waitlist) | Developer communications | No |

Everything else: **not collected.** Favourites and quiz answers never leave the phone, so they are not "collected" under Google's definition.

Rule: if in doubt, declare it. Over-declaring is fine; under-declaring is a policy strike.

## Content rating (IARC questionnaire)

- Category: not a game. Pick the utility / reference / other app category.
- Violence, fear, sexual content, crude humour, bad language, drugs, alcohol, tobacco, gambling: **No** to all.
- Users interact or exchange content in the app (chat, posts, uploads): **No.** Sharing a name uses the phone's own share sheet, which is outside the app.
- Shares the user's location: **No.**
- Digital purchases: **No** (tip is copy-only; no payments in this build).
- Expected result: PEGI 3 / Everyone.

## Gaps to fix before production (not blockers for internal or closed testing)

1. **Waitlist emails go nowhere.** `/api/waitlist` doesn't exist on GitHub Pages, so emails sit in the phone's local queue and we never receive them. The waitlist says "we'll tell you when Pro opens", which we can't keep. Before production, either wire a real endpoint or remove the email field. Berry's call.
2. **Privacy page needs a real contact email** and one line: "Email us to delete your waitlist email." It currently points at "contact details on the Play listing".
