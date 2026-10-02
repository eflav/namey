# Namey TWA — emulator smoke results (2026-10-02)

**Build:** `app.namey.twa` v1.0.1 (versionCode 2), universal APK built with bundletool 1.17.2 from `artifacts/namey-app.namey.twa-v2.aab`. Signed with the upload key (cert SHA-256 `5D:89:76:70:…:B7:55`, which matches assetlinks).
**Device:** AVD `namey33`: Pixel 5 profile, Android 13 (API 33) `google_apis` x86_64, 2 GB RAM, Chrome 109.0.5414.123 (the image's built-in version).
**Accel:** **software (TCG) only**. `/dev/kvm` exists, but on this box the host kernel hits a bug when creating a vCPU (`kernel BUG at arch/x86/kvm/x86.c:702`, `kvm_spurious_fault` in `vmx_vcpu_create`). So KVM can't be used here (nested virtualisation is broken).
**Asset Links (live):** https://eflav.github.io/.well-known/assetlinks.json lists `app.namey.twa` with both the Play signing key (87:EA:…:34:CA) and the upload key (5D:89:…:B7:55). ✔

## Overall

**INCOMPLETE / BLOCKED BY ENVIRONMENT.** Not a verdict on the app. Under software emulation the guest was too slow to load the web app. Load average was about 20, System UI kept showing "isn't responding", and Chrome's Custom Tab process kept getting killed (it depended on a dying GMS process and hit memory pressure). I never saw the web content render. Only install, launcher start and splash were checked. **Please run the rest on a real device or a KVM-capable host.**

## Results (numbered per QA-TWA.md)

| # | Check | Result | Note |
|---|---|---|---|
| 1.1 | Install from Play internal testing | N/A | Sideloaded the universal APK with `adb install` instead. Install succeeded. Play track not tested. |
| 1.2 | Launcher icon opens Namey | PARTIAL PASS | LauncherActivity started, splash shown, Chrome `TranslucentCustomTabActivity` launched. Web content never rendered (emulator). |
| 1.3 | Cold start loads https://eflav.github.io/namey/ | NOT RUN (emulator too slow) | After force-stop and relaunch the screen stayed black for more than 3 min. Chrome died ("app died, no saved state"). |
| 1.4 | URL bar absent / DAL verified | NOT RUN (emulator too slow) | No logcat lines about Digital Asset Links or verification were seen before Chrome died. The splash had no URL bar, but that doesn't prove the TWA verified. |
| 2.1 | Gender | NOT RUN (emulator too slow) | |
| 2.2 | Quiz incl. "Not sure" | NOT RUN (emulator too slow) | |
| 2.3 | Lands on deck | NOT RUN (emulator too slow) | |
| 2.4 | Deck controls (no Skip) | NOT RUN (emulator too slow) | |
| 2.5 | Save ♥ | NOT RUN (emulator too slow) | |
| 2.6 | Share sheet / Copied | NOT RUN (emulator too slow) | |
| 2.7 | Name detail / Similar names | NOT RUN (emulator too slow) | |
| 2.8 | Background → foreground | NOT RUN (emulator too slow) | |
| 3.1 | Privacy link opens privacy.html | NOT RUN (emulator too slow) | |
| 3.2 | Console privacy URL matches | N/A | Not checkable on an emulator. |
| 3.3 | Privacy page has a real contact email | FAIL (source) → fixed locally | The live/source page had no email. `public/privacy.html` Contact line is now updated (not deployed). The in-app `src/screens/Privacy.tsx` has no contact line either. |
| 3.4 | Waitlist reaches endpoint | NOT RUN | |
| 4.1 | Back from detail | NOT RUN (emulator too slow) | |
| 4.2 | Back from deck/quiz | NOT RUN (emulator too slow) | |
| 4.3 | Gesture back | NOT RUN (emulator too slow) | |
| 5.1 | Airplane mode + force-stop + reopen | NOT RUN (emulator too slow) | Needs one successful online session first. |
| 5.2 | Cached names offline | NOT RUN | |
| 5.3 | Back online recovers | NOT RUN | |
| 6.1 / 6.2 | A2HS prompts | NOT RUN | |
| 7.1–7.3 | Scope / hygiene | NOT RUN | |

## Splash / status bar (for Design)

| Item | Expected | Observed | Result |
|---|---|---|---|
| Splash background | `#3B82F6` blue, pink N centred | **`#F5F9FF` (near-white)**. The pink N sits on a `#3B82F6` blue circle in the centre (`01a-splash-clean.png`). | **MISMATCH with expectation.** But it matches the build config: `twa-manifest.json` / `build.gradle` `backgroundColor: "#F5F9FF"`. The blue only appears in the icon. |
| Status bar during splash | Blue `#3B82F6` | **Black `#000000`** (`01a`, `01d`) | **FAIL vs expectation.** `colorPrimaryDark` / STATUS_BAR_COLOR is set to `#3B82F6` in the APK, but during the splash the bar showed black. On first launch Android also showed its "Viewing full screen — swipe down from the top" hint (`01b`), meaning the system bars were hidden while the splash was up. |
| Status bar in TWA (web loaded) | Blue | Not observed | NOT RUN |
| Navigation bar | (config `#000000`) | Black | as configured |

## Bugs / issues

| Title | Sev | Steps | Expected | Actual | Device | # |
|---|---|---|---|---|---|---|
| Splash background is near-white, not brand blue | P2 (design) | Fresh install → tap launcher icon | `#3B82F6` full-bleed blue with pink N | `#F5F9FF` with a blue circle icon | API 33 emu | 1.2 |
| Status bar black during splash and system "Viewing full screen" hint | P2 | Fresh install → launch | Blue status bar | Black bar. Android's full-screen hint covers the top third on first launch. | API 33 emu | 1.2 |
| Privacy page lacks deletion contact email | P1 (Play policy) | Open privacy.html → Contact | Real email | "use the contact details on the Play listing…" | web | 3.3 |

## Screenshots (`qa-emulator-2026-10-02/`)

- `01a-splash-clean.png`: splash with no overlay. Pixel samples: background `#F5F9FF`, circle `#3B82F6`, status bar `#000000`.
- `01b-splash-dimmed-immersive-hint.png`: Android's "Viewing full screen" hint over the splash.
- `01c-splash-systemui-anr.png`, `03-relaunch-home-systemui-anr.png`: System UI ANR (caused by the emulator, not the app).
- `01d-splash-status-bar-black.png`: splash showing the black status bar.
- `02-first-screen-still-splash.png`: the first screen after about 60 s was still the splash (no network in the guest yet at that point).
- `04-cold-open-online-black.png`, `05-cold-open-online-black-t3min.png`: cold open with network up. Black for more than 3 min while Chrome was killed and restarted.
