# Namey TWA signing (local only)

**applicationId / package:** `app.namey.twa`  
**Host / startUrl:** `eflav.github.io` · `/namey/` → https://eflav.github.io/namey/

## Keystore (never commit)

On the box used for this setup:

| Item | Value |
| --- | --- |
| Keystore path | `/home/box/secrets/namey-upload.keystore` |
| Alias | `namey-upload` |
| Passwords | `/home/box/secrets/namey-signing.env` (`NAMEY_STORE_PASSWORD`, `NAMEY_KEY_PASSWORD`) |

Env file is **mode 600**, outside the git repo. Do **not** copy passwords into the repo, PR descriptions, or chat logs that get committed.

### Edward on another machine

1. Copy the keystore to a private path (1Password / encrypted drive).
2. Create a local `namey-signing.env` (gitignored) with:

```bash
NAMEY_KEYSTORE=/absolute/path/to/namey-upload.keystore
NAMEY_KEY_ALIAS=namey-upload
NAMEY_STORE_PASSWORD=...
NAMEY_KEY_PASSWORD=...
NAMEY_APPLICATION_ID=app.namey.twa
```

3. Or generate a **new** upload key if this box key is lost — then update Play Console “App signing” upload key and recompute assetlinks SHA256.

## SHA256 for Digital Asset Links

```bash
source /path/to/namey-signing.env
keytool -list -v \
  -keystore "$NAMEY_KEYSTORE" \
  -alias "$NAMEY_KEY_ALIAS" \
  -storepass "$NAMEY_STORE_PASSWORD" \
  | grep SHA256
```

Use the fingerprint **UPPERCASE, colon-separated** (`AA:BB:…`) in `assetlinks.json` — Google's validator rejects lowercase/no-colon as “malformed cert fingerprint” (found 2026-10-02).

Helper:

```bash
source /path/to/namey-signing.env
./scripts/inject-assetlinks-sha256.sh
```

## Bubblewrap build env

```bash
export JAVA_HOME=/path/to/jdk-17   # Bubblewrap wants JDK 17
export ANDROID_HOME=/path/to/Android/Sdk
source /path/to/namey-signing.env
export BUBBLEWRAP_KEYSTORE_PASSWORD="$NAMEY_STORE_PASSWORD"
export BUBBLEWRAP_KEY_PASSWORD="$NAMEY_KEY_PASSWORD"
cd android
npx --yes @bubblewrap/cli build --skipPwaValidation \
  --signingKeyPath="$NAMEY_KEYSTORE" \
  --signingKeyAlias=namey-upload
```

Outputs (typical): `app-release-bundle.aab` and `app-release-signed.apk` in `android/`.

## Play App Signing

Upload the AAB to Play; Google re-signs with the **app signing key**.  
Asset Links for the installed Play build must use the **App signing key certificate** SHA256 from Play Console → Setup → App signing (not only the upload key), once Play has issued it.  
Until first upload, draft `assetlinks.json` with the **upload** key SHA256 from this keystore so local / sideload testing can verify; swap to the Play app-signing SHA256 after Console shows it.

## Built artifacts on the setup box

After a successful Bubblewrap build (2026-09-11):

- `/home/box/secrets/play-artifacts/namey-app.namey.twa-v1.aab`
- `/home/box/secrets/play-artifacts/namey-app.namey.twa-v1.apk`

Also produced under `android/` (gitignored): `app-release-bundle.aab`, `app-release-signed.apk`.

### v2 rebuild (2026-10-02) — minSdk 24

Play rejected v1: "Play automatic protection requires a minimum SDK version of 24 or higher."
`android/twa-manifest.json` and `android/app/build.gradle` now use **minSdkVersion 24**, **versionCode 2**, versionName **1.0.1** (targetSdk 36 unchanged).

Built with `./gradlew bundleRelease` (JDK 17, `ANDROID_HOME=/home/box/Android/Sdk`), then signed with `jarsigner` using the upload key (alias `namey-upload`, SHA256withRSA). Upload-key cert SHA256 unchanged (`5D:89:76:70:…:B7:55`).

- `docs/play-store/artifacts/namey-app.namey.twa-v2.aab` (gitignored)
- `/home/box/secrets/play-artifacts/namey-app.namey.twa-v2.aab`

Future versions: bump `appVersionCode` / `versionCode` again; Play rejects reused version codes.

### v3 rebuild (2026-10-02) — brand splash + waitlist form

**versionCode 3**, versionName **1.0.2** (minSdk 24, targetSdk 36 unchanged).

- Splash background `#3B82F6`; status bar `#3B82F6`; navigation bar `#F5F9FF` with dark buttons (API 27+).
- App theme is now `@style/NameyLauncherTheme` (`res/values/styles.xml`, `res/values-v27/styles.xml`): same translucent parent, but with `windowDrawsSystemBarBackgrounds=true` so the splash status bar actually shows blue instead of black. `bubblewrap update` would overwrite `AndroidManifest.xml`; re-apply `android:theme` if you ever regenerate.

Built with `./gradlew bundleRelease` (JDK 17, `ANDROID_HOME=/home/box/Android/Sdk`), then signed with `jarsigner -sigalg SHA256withRSA -digestalg SHA-256` using the upload key (alias `namey-upload`, passwords via `-storepass:env` / `-keypass:env` from `namey-signing.env`). `jarsigner -verify`: **jar verified**, signer `CN=Namey Upload`, cert SHA256 `5D:89:76:70:…:B7:55` (upload key, unchanged).

- `docs/play-store/artifacts/namey-app.namey.twa-v3.aab` (gitignored)
- `/home/box/secrets/play-artifacts/namey-app.namey.twa-v3.aab`
- SHA-256 of the AAB: `d77821a23d2322cdbe5dd3d71d03bedfe5710b0d820853b96729b3c82e9a458e`

## Certificate fingerprints (Digital Asset Links) — updated 2026-10-02

| Key | SHA-256 |
| --- | --- |
| **Play app signing key** (Play Console → Setup → App signing; signs installs from Play) | `87:EA:8D:41:91:AC:CD:93:D3:E5:DD:99:F6:09:62:77:2B:77:31:64:92:7D:AF:E6:60:51:3E:EE:4E:A4:34:CA` |
| **Upload key** (`namey-upload`; signs sideloaded / locally built APKs) | `5D:89:76:70:BC:6E:72:A8:DF:95:62:E2:87:F6:A9:10:F0:6C:26:0E:90:11:79:40:3B:25:E3:76:CD:22:B7:55` |

Both are listed (uppercase, colon-separated) in one `delegate_permission/common.handle_all_urls` statement for `app.namey.twa` in:

- **Live (what Chrome checks):** https://eflav.github.io/.well-known/assetlinks.json — repo `eflav/eflav.github.io`, file `.well-known/assetlinks.json`, deployed by plain `git push` to `main` (Pages from branch; `.nojekyll` required). Commits `840ea95` (add Play key) + `61c2720` (fix fingerprint format).
- Mirror in this repo: `public/.well-known/assetlinks.json`.

Regenerate (the helper now accepts several comma-separated fingerprints and `ASSETLINKS_OUT`):

```bash
NAMEY_CERT_SHA256="87:EA:8D:41:91:AC:CD:93:D3:E5:DD:99:F6:09:62:77:2B:77:31:64:92:7D:AF:E6:60:51:3E:EE:4E:A4:34:CA,5D:89:76:70:BC:6E:72:A8:DF:95:62:E2:87:F6:A9:10:F0:6C:26:0E:90:11:79:40:3B:25:E3:76:CD:22:B7:55" \
  ./scripts/inject-assetlinks-sha256.sh
# then copy public/.well-known/assetlinks.json into eflav.github.io/.well-known/ and git push
```
