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

Use the fingerprint **lowercase, no colons** in `assetlinks.json`.

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
