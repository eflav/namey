# Namey hosting

## Public URL

**https://eflav.github.io/namey/**

- Repo: https://github.com/eflav/namey
- Hosting: GitHub Pages (project site)
- Deploy branch: `gh-pages` (built `dist/` published by `npx gh-pages`)

## Base path

Vite `base` is set to `/namey/` (project Pages, not a user/org root site).

Caveats:

- Assets and the PWA manifest use `/namey/` (`start_url` / `scope`).
- Local `npm run dev` still works; Vite applies `base` consistently.
- Preview locally with the same base: `npm run build && npm run preview` then open the `/namey/` path Vite prints.
- Do **not** strip the trailing `/namey/` when linking — root `https://eflav.github.io/` is not this app.

## Deploy flow (current)

Actions workflow push is blocked for this OAuth token (`workflow` scope missing). Until that scope is granted:

```bash
cd /workspace/namey
npm run build
npx --yes gh-pages -d dist --dotfiles   # --dotfiles required for .well-known/
```

Pages source: branch `gh-pages` / root.

## Actions workflow (preferred once `workflow` scope exists)

File ready on disk: `.github/workflows/deploy-pages.yml` (build + upload-pages-artifact + deploy-pages on push to `main`). Re-add and push after `gh auth refresh -s workflow` (or a PAT with `workflow`), then switch Pages source to **GitHub Actions**.

## Local / temporary tunnels

Previous Cloudflare Tunnel / local `:4173` previews are superseded by the Pages URL above. Prefer the stable HTTPS URL for sharing and A2HS testing.

## Rebuild notes

`dist/` is gitignored on `main`; the `gh-pages` branch holds the static build only. Prefer rebuilding from source before each publish.
