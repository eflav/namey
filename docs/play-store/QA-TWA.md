# Namey — Android TWA smoke (Google Play internal testing)

**Product:** Namey only — never StairFit.  
**Web origin the TWA wraps:** https://eflav.github.io/namey/  
**Privacy URL:** https://eflav.github.io/namey/privacy.html  
**Owner:** QA Testing · **Package:** Berry (Bubblewrap / AAB)  
**When:** After internal-testing track install; before production rollout.

Device / build under test: ________________  
Play track: Internal testing · AAB version: ________________  
Date / tester: ________________

Clear app storage (or reinstall) before a clean first-run pass.

---

## Overall

| Result | ☐ PASS · ☐ PASS WITH ISSUES · ☐ FAIL |
| --- | --- |

Block production if any **P0** fails. File bugs: title · severity · steps · expected · actual · device/Android version · checklist line.

---

## Pass/fail checklist

### 1. Install & cold start

| # | Check | Result |
| --- | --- | --- |
| 1.1 | Install from Play **internal testing** (not sideload-only) | ☐ PASS ☐ FAIL |
| 1.2 | Launcher icon opens Namey (TWA / Custom Tabs chrome acceptable; must not dump into a bare browser tab with wrong origin) | ☐ PASS ☐ FAIL |
| 1.3 | Cold start (force-stop → reopen) loads https://eflav.github.io/namey/ without error / blank forever | ☐ PASS ☐ FAIL |
| 1.4 | URL bar / Digital Asset Links: no persistent browser address chrome if asset links verified; if Chrome Custom Tab shows URL, confirm path stays under `/namey/` | ☐ PASS ☐ FAIL · ☐ N/A |

### 1b. Post-rebuild (v3 / versionCode 3, 1.0.2) launch visuals — Huawei

Run on the Huawei device after installing the v3 build from internal testing. Do a cold start (force-stop, or swipe away from recents) and a first launch after clearing storage. Screen-record if you can; the flashes are brief.

| # | Check | Result |
| --- | --- | --- |
| 1b.1 | From tapping the launcher icon to the welcome screen, the screen stays **blue `#3B82F6`** the whole time, with the pink N centred during the splash | ☐ PASS ☐ FAIL |
| 1b.2 | **No white flash** at any point between tap and welcome screen (before the splash, splash → web, or while the page loads) | ☐ PASS ☐ FAIL |
| 1b.3 | **No black flash** at any point between tap and welcome screen | ☐ PASS ☐ FAIL |
| 1b.4 | **Status bar is blue** (`#3B82F6`, light icons) during the splash *and* once the welcome screen shows. FAIL if black, white or grey | ☐ PASS ☐ FAIL |
| 1b.5 | **No address bar / URL bar** at the top (TWA verified). FAIL if a Chrome toolbar showing `eflav.github.io` appears | ☐ PASS ☐ FAIL |
| 1b.6 | Navigation bar is light (`#F5F9FF`) with dark buttons (gesture-nav devices: handle is visible) | ☐ PASS ☐ FAIL · ☐ N/A |
| 1b.7 | No Android "Viewing full screen" hint on first launch | ☐ PASS ☐ FAIL |

### 2. First-run path (gender → quiz → deck → save → share)

| # | Check | Result |
| --- | --- | --- |
| 2.1 | **Gender** — full-width choices; sticky Continue works | ☐ PASS ☐ FAIL |
| 2.2 | **Quiz** — options select; **Not sure** advances with no answer; Writer hint visible | ☐ PASS ☐ FAIL |
| 2.3 | Lands on **deck** with names | ☐ PASS ☐ FAIL |
| 2.4 | Deck controls: **Back \| Next + Save** only — **no Skip** | ☐ PASS ☐ FAIL |
| 2.5 | **Save** (♥) persists; favourites / shortlist reachable | ☐ PASS ☐ FAIL |
| 2.6 | **Share / Copy** — system share sheet and/or Copied toast; no crash | ☐ PASS ☐ FAIL |
| 2.7 | Name **detail** opens; **Similar names** ≤6 chips (same gender); tap opens that detail; section hidden if empty | ☐ PASS ☐ FAIL |
| 2.8 | Flow survives app background → foreground (quiz/deck state not wiped mid-session unless designed) | ☐ PASS ☐ FAIL |

### 3. Privacy & trust

| # | Check | Result |
| --- | --- | --- |
| 3.1 | In-app privacy / trust link opens **https://eflav.github.io/namey/privacy.html** (readable; not 404) | ☐ PASS ☐ FAIL |
| 3.2 | Play Console privacy policy URL matches the same page | ☐ PASS ☐ FAIL |
| 3.3 | Privacy page shows a real contact email for deletion requests | ☐ PASS ☐ FAIL |
| 3.4 | Waitlist email (if field shipped): submit a test address and confirm with Berry it appears as a new row in the waitlist Google Sheet (via the Google Form), not just the phone. FAIL if no row arrives. Block production, but not internal testing. | ☐ PASS ☐ FAIL · ☐ N/A (field removed) |
| 3.5 | In-app Privacy screen shows the Google Sheet waitlist line and the contact line; the `edwardflavel@gmail.com` link opens the mail app | ☐ PASS ☐ FAIL |
| 3.6 | Waitlist offline: airplane mode → submit a valid email → error message shows in the dialog, dialog stays open, no "You're on the list" toast | ☐ PASS ☐ FAIL · ☐ N/A |

### 4. Back / gesture

| # | Check | Result |
| --- | --- | --- |
| 4.1 | System **Back** from detail → previous screen (not force-quit) | ☐ PASS ☐ FAIL |
| 4.2 | Back from deck / quiz behaves sensibly (confirm exit only at root if implemented) | ☐ PASS ☐ FAIL |
| 4.3 | Gesture back (if device has it) matches system Back | ☐ PASS ☐ FAIL · ☐ N/A |

### 5. Offline / cache

| # | Check | Result |
| --- | --- | --- |
| 5.1 | After one online session, enable airplane mode → cold start still shows a usable shell or clear offline message (no white crash) | ☐ PASS ☐ FAIL |
| 5.2 | Cached names / last screen recoverable offline if SW designed for it; otherwise fail soft with recovery when online | ☐ PASS ☐ FAIL · ☐ N/A |
| 5.3 | Coming back online recovers without stuck spinner | ☐ PASS ☐ FAIL |

### 6. A2HS / install prompts inside TWA

| # | Check | Result |
| --- | --- | --- |
| 6.1 | In TWA, redundant “Add to Home Screen” / Keep Namey handy is acceptable or suppressed — must not loop-nag every save | ☐ PASS ☐ FAIL |
| 6.2 | If shown: **Got it** keeps hints; **Not now** dismisses and does not re-prompt every save | ☐ PASS ☐ FAIL · ☐ N/A |

### 7. Scope / hygiene (Namey only)

| # | Check | Result |
| --- | --- | --- |
| 7.1 | No StairFit branding, links, or assets anywhere in the TWA | ☐ PASS ☐ FAIL |
| 7.2 | All navigations stay on Namey Pages host + `/namey/` (no accidental root github.io app) | ☐ PASS ☐ FAIL |
| 7.3 | No payment / IAP surfaces in listing or app until money is approved | ☐ PASS ☐ FAIL · ☐ N/A |

---

## Severity guide

| Sev | Meaning |
| --- | --- |
| **P0** | Can’t install, blank/crash on start, wrong product, privacy 404, data loss on save |
| **P1** | Core path broken (quiz/deck/save/share) but workaround exists |
| **P2** | Polish, toast, A2HS nag, layout |

---

## Bugs found

| Title | Sev | Steps | Expected | Actual | Device | Checklist # |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

---

## Sign-off

| Role | Name | Result | Date |
| --- | --- | --- | --- |
| QA | | ☐ PASS ☐ PASS WITH ISSUES ☐ FAIL | |
| Berry | | Ready for Edward publish? ☐ Yes ☐ No | |

**Do not** publish to production with open P0s. Internal testing may proceed with documented P2s.
