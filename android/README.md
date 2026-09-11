# Namey Trusted Web Activity (Bubblewrap)

- **applicationId:** `app.namey.twa`
- **startUrl:** https://eflav.github.io/namey/ (`host` `eflav.github.io`, path `/namey/`)
- **Generator:** `@bubblewrap/cli` 1.25.0 (project files committed; rebuild with Bubblewrap)

## Build

Requires **JDK 17** and Android SDK (build-tools **36.1.0**). See `docs/play-store/SIGNING.md`.

```bash
# from repo root, with Bubblewrap config pointing at JDK 17 + SDK
cd android
export BUBBLEWRAP_KEYSTORE_PASSWORD=...
export BUBBLEWRAP_KEY_PASSWORD=...
npx --yes @bubblewrap/cli build --skipPwaValidation \
  --signingKeyPath="$NAMEY_KEYSTORE" \
  --signingKeyAlias=namey-upload
```

Do not commit `local.properties`, `*.keystore`, `*.aab`, or `app/build/`.
