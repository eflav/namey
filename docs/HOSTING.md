# Namey hosting

## Public URL

**https://eflav.github.io/namey/**

- Repo: https://github.com/eflav/namey
- Hosting: GitHub Pages (project site)
- Deploy: GitHub Actions workflow `.github/workflows/deploy-pages.yml` on push to `main`

## Base path

Vite `base` is set to `/namey/` (project Pages, not a user/org root site).

Caveats:

- Assets and the PWA manifest use `/namey/` (`start_url` / `scope`).
- Local `npm run dev` still works; Vite applies `base` consistently.
- Preview locally with the same base: `npm run build && npm run preview` then open the `/namey/` path Vite prints.
- Do **not** strip the trailing `/namey/` when linking — root `https://eflav.github.io/` is not this app.

## Deploy flow

1. Push to `main` (or run **Deploy to GitHub Pages** via Actions → workflow_dispatch).
2. Workflow builds with `npm ci && npm run build`, uploads `dist/`, deploys via `actions/deploy-pages`.
3. Pages source: **GitHub Actions** (not branch `/docs`).

## Local / temporary tunnels

Previous Cloudflare Tunnel / local `:4173` previews are superseded by the Pages URL above. Prefer the stable HTTPS URL for sharing and A2HS testing.

## Rebuild notes

`dist/` is gitignored; CI always builds from source. Prefer Actions over committing `dist` or `npx gh-pages`.
