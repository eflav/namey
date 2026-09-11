# Namey — Google Play Console runbook (Edward)

**Status:** Package + listing prepared in-repo; **Edward** pays the Console fee and hits **Publish**.  
**Product:** Namey only — never StairFit.  
**No £** in store-facing copy.

## IDs

| Field | Value |
| --- | --- |
| applicationId | `app.namey.twa` |
| Web / TWA start | https://eflav.github.io/namey/ |
| Privacy policy URL | https://eflav.github.io/namey/privacy.html |
| Listing copy | `docs/play-store/LISTING-COPY.md` |
| Signing | `docs/play-store/SIGNING.md` |
| QA smoke | `docs/play-store/QA-TWA.md` |
| AAB | `android/app-release-bundle.aab` (after Bubblewrap build) |

## You do once (Edward)

1. Open https://play.google.com/console → create a developer account (**one-time ~USD 25** — Edward only).
2. **Create app**
   - Name: **Namey**
   - Default language: English (UK) if available, else English (US)
   - App (not game) · Free · Declarations: no ads for now
3. **Privacy policy** — paste: `https://eflav.github.io/namey/privacy.html`
4. **App access / Data safety**
   - Shortlist / favourites: on-device only; no account required
   - Optional: email collected only if user joins Pro waitlist
   - No sale of data; no tracking across apps for ads
5. **Content rating** — complete IARC questionnaire (Parenting / reference; not user-generated chat). Target audience: parents / general (not Designed for Families / under-13).
6. **Store listing** — paste short + full description + what’s new from `LISTING-COPY.md`. Screenshots / feature graphic from Design when ready. Category: Parenting (or Lifestyle).
7. **Upload AAB** — Internal testing track first (`android/app-release-bundle.aab`). Add Edward (and testers) as license testers.
8. **Digital Asset Links** — after first upload, copy **App signing key certificate** SHA256 from Play Console → Setup → App signing into `assetlinks.json` (see SIGNING.md). Host at **origin root** `https://eflav.github.io/.well-known/assetlinks.json` (user/org Pages repo or custom domain — project Pages under `/namey/` alone is not enough for Chrome verification).
9. Smoke with `QA-TWA.md` on Internal testing.
10. Promote to Production when QA is green → **Publish** (or staged rollout 20%). **Edward only** presses Publish.

## Berry / agents prepare

- [x] Public privacy page
- [x] TWA scaffold under `android/` (`app.namey.twa`)
- [x] Upload keystore outside git + SIGNING.md
- [x] `assetlinks.json` template + inject script
- [x] Listing copy + QA checklist
- [ ] Signed AAB when SDK/build succeeds on the box (or Edward builds locally per SIGNING.md)

## Do not

- Put £ / IAP / Stripe prices in the listing until money is approved
- Mix StairFit assets or copy
- Commit keystores or `namey-signing.env`
- Publish to production with open P0s from QA-TWA

## When to hit Publish

Only after: privacy URL loads · AAB on Internal testing · Data safety + rating complete · listing screenshots attached · asset links verified (or Custom Tabs fallback accepted for first launch) · QA smoke PASS.
