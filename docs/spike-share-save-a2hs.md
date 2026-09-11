# Spike #1 — share → save → A2HS (Namey / Kin)

**Status:** audited against `/workspace/namey` on 2026-09-11. Most of the loop is already shipped. Do **not** rebuild.

## Already shipped (Berry — don’t double-build)

| Checkpoint | Where | Notes |
| --- | --- | --- |
| Share caption (single) | `src/lib/share.ts` → `shareCaptionSingle` | Meaning line + “Found on Namey” |
| Share caption (favourites) | `shareCaptionFavourites` | Cap 5 + “+N more” |
| Share / copy | `shareOrCopy` | `navigator.share` then clipboard fallback; AbortError quiet |
| Share card (TikTok visual) | `ShareCard.tsx` on NameDetail + Favourites | Screenshot-native 9:16; **not** file share |
| Save → A2HS | `Cycle` `onFirstSave` → `App` `maybePromptAfterSave` | Once per install (`namey-a2hs-prompted`) |
| A2HS dialog | `A2hsDialog` + `useA2hs` | Native `beforeinstallprompt` when present; iOS/Android Writer-style manual hints |
| SW update | `pwa.ts` + `registerType: 'autoUpdate'` | `onNeedRefresh` → `updateSW(true)` |

## Tunnel vs product (for QA / Research)

| Issue | Label | Expectation |
| --- | --- | --- |
| Cloudflare quick tunnel URL rotates/dies | **tunnel** | A2HS bookmark can break; not a product bug |
| iOS no `beforeinstallprompt` | **product (by design)** | Manual Share → Add to Home Screen hints only |
| Old build after deploy (iOS SW cache) | **tunnel/ops** | Clear site data; autoUpdate helps but first visit bites |
| `navigator.share` in Safari vs Home Screen standalone | **product** | Must pass **both** |
| Missing permanent host / Origin namespace | **hosting P0** | Real unlock for TikTok + stable install |

## Gaps worth a small Berry pass (ranked)

1. **iOS A2HS primary CTA dismisses the dialog** (`A2hsDialog`: when `!canNativeInstall`, primary calls `onDismiss`). Should keep hints visible (“Got it”) so parents can follow Share → Add to Home Screen. Product bug, not tunnel.
2. **ShareCard is display-only** — no `navigator.share({ files })` image. TikTok path = screenshot the card. Spike decision: keep screenshot path this week (no new frameworks / heavy canvas libs); revisit image share after permanent host.
3. **Share caption has no URL** — fine until permanent host; add app URL in caption once host is stable (not on rotating tunnel).
4. **Cycle toast flicker** — briefly sets “Copied” then “Shared”; minor polish.

## Spike acceptance (QA smoke)

Clear site data first on tunnel builds.

1. **Share caption/card** — deck Copy / detail Share / favourites Share; toast shared|copied; ShareCard visible for screenshot.
2. **Save → A2HS** — first Save opens “Keep Namey handy”; dismiss persists; second save does not re-prompt.
3. **A2HS** — Android: native install **or** menu hints. iOS: Writer hints present; **do not** fail for missing auto-install.
4. **Dual share** — in-browser Safari **and** Home Screen standalone (label tunnel-death separately if host rotated).

## Out of scope this spike

- New frameworks / Origin permanent host (hosting track)
- Other product work (out of scope)
- Recovery conversion (#2 next)
