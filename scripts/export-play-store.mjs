#!/usr/bin/env node
/**
 * Export Google Play Store listing assets for Namey.
 * HTML stubs → headless Chrome --screenshot at exact pixel sizes.
 *
 * Outputs under docs/play-store/:
 *   feature-graphic-1024x500.png
 *   icon-512.png
 *   screenshot-01-welcome-1080x1920.png
 *   screenshot-02-gender-1080x1920.png
 *   screenshot-03-deck-1080x1920.png
 *   screenshot-04-detail-1080x1920.png
 *   screenshot-05-share-1080x1920.png
 *   screenshot-06-favourites-1080x1920.png
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'docs', 'play-store');
const TMP = join(OUT, '.tmp-html');
const ICON_SVG = join(ROOT, 'public', 'icons', 'icon.svg');
const SHARE_SRC = join(ROOT, 'docs', 'sharecards', 'namey-oliver-share.png');

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet" />`;

const chrome = existsSync('/usr/bin/google-chrome')
  ? '/usr/bin/google-chrome'
  : existsSync('/usr/bin/google-chrome-stable')
    ? '/usr/bin/google-chrome-stable'
    : 'google-chrome';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shellHtml(width, height, bodyInner, extraCss = '') {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=${width}, height=${height}" />
${FONTS}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
    background: #F5F9FF;
    font-family: 'Figtree', system-ui, -apple-system, sans-serif;
    color: #0F172A;
    -webkit-font-smoothing: antialiased;
  }
  ${extraCss}
</style>
</head>
<body>
${bodyInner}
</body>
</html>`;
}

/* ── Feature graphic 1024×500 ── */
function featureGraphicHtml() {
  const css = `
  .fg {
    width: 1024px;
    height: 500px;
    position: relative;
    overflow: hidden;
    background: #F5F9FF;
  }
  .fg-blue {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 62%;
    background: #3B82F6;
  }
  .fg-pink {
    position: absolute;
    right: 48px;
    top: 70px;
    width: 280px;
    height: 360px;
    background: #F472B6;
    border-radius: 36px;
    transform: rotate(7deg);
  }
  .fg-content {
    position: absolute;
    left: 64px;
    top: 0; bottom: 0;
    width: 520px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
    z-index: 2;
  }
  .fg-brand {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .fg-mark {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #3B82F6;
    border: 4px solid rgba(255,255,255,0.85);
    color: #F472B6;
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 2.4rem;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    box-shadow: 0 8px 24px rgba(15,23,42,0.18);
  }
  /* Pink N on white disc for contrast on blue slab */
  .fg-mark-alt {
    background: #FFFFFF;
    border: none;
    color: #F472B6;
  }
  .fg-name {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 4.5rem;
    letter-spacing: -0.03em;
    color: #FFFFFF;
    line-height: 1;
  }
  .fg-tag {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 700;
    font-size: 1.85rem;
    line-height: 1.25;
    color: #FFFFFF;
    max-width: 16ch;
    letter-spacing: -0.02em;
  }
  `;
  const body = `
  <div class="fg">
    <div class="fg-blue"></div>
    <div class="fg-pink" aria-hidden="true"></div>
    <div class="fg-content">
      <div class="fg-brand">
        <span class="fg-mark fg-mark-alt" aria-hidden="true">N</span>
        <span class="fg-name">Namey</span>
      </div>
      <p class="fg-tag">Find the name that feels like them.</p>
    </div>
  </div>`;
  return shellHtml(1024, 500, body, css);
}

/* ── Icon 512×512 maskable-safe (~10% padding) ── */
function iconHtml(svgMarkup) {
  // Canvas 512; blue disc inset so content stays in ~80% safe zone
  const css = `
  .icon-wrap {
    width: 512px;
    height: 512px;
    display: grid;
    place-items: center;
    background: transparent;
  }
  .icon-inner {
    width: 410px;
    height: 410px;
  }
  .icon-inner svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  `;
  // Strip xmlns quirks; embed as-is scaled into padded box
  const body = `
  <div class="icon-wrap">
    <div class="icon-inner">${svgMarkup}</div>
  </div>`;
  return shellHtml(512, 512, body, css);
}

/* Shared phone-screen chrome (full-bleed app UI, no device frame) */
const phoneBaseCss = `
  .phone {
    width: 1080px;
    height: 1920px;
    background: #F5F9FF;
    padding: 72px 56px 64px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  .status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.35rem;
    font-weight: 600;
    color: #64748B;
    padding: 0 8px 8px;
  }
  .eyebrow {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748B;
    margin: 0 0 12px;
  }
  h1 {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 3.4rem;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #0F172A;
    margin: 0;
  }
  .lede {
    font-size: 1.55rem;
    line-height: 1.45;
    color: #64748B;
    margin: 20px 0 0;
    max-width: 34ch;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 96px;
    border-radius: 28px;
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 1.7rem;
    border: none;
    width: 100%;
  }
  .btn-primary { background: #3B82F6; color: #fff; }
  .btn-secondary {
    background: #FFFFFF;
    color: #0F172A;
    border: 2px solid #E2E8F0;
  }
  .btn-ghost {
    background: transparent;
    color: #64748B;
    font-weight: 700;
    font-family: 'Figtree', system-ui, sans-serif;
    font-size: 1.4rem;
    min-height: 72px;
  }
  .btn-pink { background: #F472B6; color: #fff; }
  .btn-heart {
    background: #FCE7F3;
    color: #F472B6;
    border: 3px solid #F472B6;
  }
  .trust {
    text-align: center;
    font-size: 1.2rem;
    color: #64748B;
    font-weight: 500;
  }
  .spacer { flex: 1; }
`;

function welcomeHtml() {
  const css = phoneBaseCss + `
  .welcome-hero {
    position: relative;
    min-height: 720px;
    border-radius: 40px;
    background: #3B82F6;
    padding: 64px 56px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 36px;
    overflow: hidden;
  }
  .welcome-pink-slab {
    position: absolute;
    right: -6%;
    top: 10%;
    width: 55%;
    height: 72%;
    background: #F472B6;
    border-radius: 40px;
    transform: rotate(8deg);
  }
  .welcome-logo {
    position: relative;
    z-index: 1;
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 1.9rem;
    color: #fff;
    display: inline-flex;
    align-items: center;
    gap: 14px;
  }
  .welcome-logo-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #F472B6;
    box-shadow: 0 0 0 5px rgba(255,255,255,0.35);
  }
  .welcome-headline {
    position: relative;
    z-index: 1;
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 4.6rem;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #fff;
    max-width: 11ch;
    margin: 0;
  }
  .trust-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .trust-pill {
    min-height: 56px;
    padding: 0 28px;
    border-radius: 999px;
    background: #DBEAFE;
    color: #1e40af;
    font-size: 1.35rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
  }
  .trust-pill-pink {
    background: #FCE7F3;
    color: #9d174d;
  }
  .actions { display: flex; flex-direction: column; gap: 20px; }
  `;
  const body = `
  <div class="phone">
    <div class="status"><span>9:41</span><span>Namey</span></div>
    <div class="welcome-hero">
      <div class="welcome-pink-slab" aria-hidden="true"></div>
      <p class="welcome-logo">Namey<span class="welcome-logo-dot"></span></p>
      <h1 class="welcome-headline">Find the name that feels like them.</h1>
    </div>
    <p class="lede">Pick boy or girl, add any vibes you like, then a short quiz. We’ll show names with meanings you’ll remember.</p>
    <div class="trust-row">
      <span class="trust-pill">Boy or girl</span>
      <span class="trust-pill">Short quiz</span>
      <span class="trust-pill trust-pill-pink">Names that fit</span>
    </div>
    <div class="spacer"></div>
    <div class="actions">
      <div class="btn btn-primary">Start naming</div>
      <div class="btn btn-secondary">Favourites</div>
    </div>
    <p class="trust">Shortlist stays on this phone · no account</p>
  </div>`;
  return shellHtml(1080, 1920, body, css);
}

function genderHtml() {
  const css = phoneBaseCss + `
  .gender-grid {
    display: flex;
    flex-direction: column;
    gap: 28px;
    margin-top: 24px;
  }
  .gender-card {
    border-radius: 36px;
    padding: 56px 48px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 4px solid transparent;
    text-align: left;
  }
  .gender-card.is-boy {
    background: #DBEAFE;
    border-color: #3B82F6;
  }
  .gender-card.is-girl {
    background: #FCE7F3;
    border-color: #F472B6;
  }
  .choice-title {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 3rem;
    color: #0F172A;
  }
  .choice-hint {
    font-size: 1.45rem;
    color: #64748B;
    font-weight: 500;
  }
  .actions { display: flex; flex-direction: column; gap: 16px; }
  `;
  const body = `
  <div class="phone">
    <div class="status"><span>9:41</span><span>Step 1</span></div>
    <div>
      <p class="eyebrow">Step 1</p>
      <h1>Who are we naming?</h1>
      <p class="lede">Choose boy or girl. You can change this later.</p>
    </div>
    <div class="gender-grid">
      <div class="gender-card is-boy">
        <span class="choice-title">Boy</span>
        <span class="choice-hint">Boy names · includes soft unisex picks</span>
      </div>
      <div class="gender-card is-girl">
        <span class="choice-title">Girl</span>
        <span class="choice-hint">Girl names · includes soft unisex picks</span>
      </div>
    </div>
    <div class="spacer"></div>
    <div class="actions">
      <div class="btn btn-primary">Continue</div>
      <div class="btn btn-ghost">Back</div>
    </div>
    <p class="trust">Shortlist stays on this phone · no account</p>
  </div>`;
  return shellHtml(1080, 1920, body, css);
}

function deckHtml() {
  const css = phoneBaseCss + `
  .cycle-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .fav-chip {
    background: #FCE7F3;
    color: #9d174d;
    font-weight: 700;
    font-size: 1.25rem;
    padding: 14px 28px;
    border-radius: 999px;
  }
  .cycle-card {
    position: relative;
    background: #FFFFFF;
    border: 2px solid #E2E8F0;
    border-radius: 40px;
    padding: 56px 48px 64px;
    min-height: 780px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    overflow: hidden;
  }
  .motif {
    position: absolute;
    top: 28px;
    right: 28px;
    width: 120px;
    height: 120px;
  }
  .cycle-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 140px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    min-height: 52px;
    padding: 0 28px;
    border-radius: 999px;
    background: #DBEAFE;
    color: #1e40af;
    font-size: 1.3rem;
    font-weight: 700;
  }
  .tap-hint {
    font-size: 1.2rem;
    color: #64748B;
    font-weight: 600;
  }
  .cycle-name {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 5.2rem;
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin: 24px 0 0;
  }
  .cycle-meaning {
    font-size: 1.85rem;
    color: #64748B;
    line-height: 1.4;
    max-width: 28ch;
  }
  .cycle-origin {
    font-size: 1.4rem;
    color: #94A3B8;
    font-weight: 600;
  }
  .cycle-teaser {
    margin-top: auto;
    font-size: 1.55rem;
    color: #0F172A;
    line-height: 1.4;
    padding-top: 24px;
    border-top: 2px solid #E2E8F0;
  }
  .cycle-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .cycle-nav .btn { min-height: 100px; }
  .actions-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  `;
  const body = `
  <div class="phone">
    <div class="status"><span>9:41</span><span>Names</span></div>
    <div class="cycle-meta">
      <p class="eyebrow" style="margin:0">Match 3 · keep going</p>
      <span class="fav-chip">♥ Favourites</span>
    </div>
    <div class="cycle-card">
      <svg class="motif" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="20" fill="#3B82F6" fill-opacity="0.55" />
      </svg>
      <div class="cycle-card-top">
        <span class="badge">Classic</span>
        <span class="tap-hint">Tap for meaning</span>
      </div>
      <h1 class="cycle-name">Oliver</h1>
      <p class="cycle-meaning">Olive tree — peace and fruitful growth.</p>
      <p class="cycle-origin">English · Latin · French</p>
      <p class="cycle-teaser">A name that feels rooted and kind — easy to grow into.</p>
    </div>
    <div class="cycle-nav">
      <div class="btn btn-secondary">Skip</div>
      <div class="btn btn-primary">Next</div>
    </div>
    <div class="actions-row">
      <div class="btn btn-heart">♡ Save</div>
      <div class="btn btn-secondary">Share</div>
    </div>
    <p class="trust">Shortlist stays on this phone · no account</p>
  </div>`;
  return shellHtml(1080, 1920, body, css);
}

function detailHtml() {
  const css = phoneBaseCss + `
  .detail-hero {
    position: relative;
    background: #FFFFFF;
    border: 2px solid #E2E8F0;
    border-radius: 40px;
    padding: 56px 48px;
    overflow: hidden;
  }
  .motif {
    position: absolute;
    top: 28px;
    right: 28px;
    width: 120px;
    height: 120px;
  }
  .detail-name {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 5rem;
    letter-spacing: -0.03em;
    margin: 12px 0 24px;
  }
  .row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    min-height: 52px;
    padding: 0 28px;
    border-radius: 999px;
    background: #F1F5F9;
    color: #0F172A;
    font-size: 1.25rem;
    font-weight: 700;
  }
  .badge-classic { background: #DBEAFE; color: #1e40af; }
  .detail-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .detail-block {
    background: #FFFFFF;
    border: 2px solid #E2E8F0;
    border-radius: 28px;
    padding: 36px 40px;
  }
  .detail-block.block-blue {
    background: #EFF6FF;
    border-color: #BFDBFE;
  }
  .detail-block.block-pink {
    background: #FDF2F8;
    border-color: #FBCFE8;
  }
  .detail-block h3 {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 1.5rem;
    margin: 0 0 12px;
  }
  .detail-block p {
    font-size: 1.5rem;
    color: #64748B;
    line-height: 1.45;
  }
  .actions { display: flex; flex-direction: column; gap: 16px; }
  `;
  const body = `
  <div class="phone">
    <div class="status"><span>9:41</span><span>Detail</span></div>
    <div class="detail-hero">
      <svg class="motif" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="20" fill="#3B82F6" fill-opacity="0.55" />
      </svg>
      <p class="eyebrow">Boy</p>
      <h1 class="detail-name">Oliver</h1>
      <div class="row">
        <span class="badge badge-classic">Classic</span>
        <span class="badge">3 syllables</span>
      </div>
      <p class="lede" style="margin:0;max-width:36ch">Olive tree — peace and fruitful growth.</p>
    </div>
    <div class="detail-grid">
      <div class="detail-block block-blue">
        <h3>Origin</h3>
        <p>English · Latin · French</p>
      </div>
      <div class="detail-block">
        <h3>Meaning</h3>
        <p>Olive tree — peace and fruitful growth.</p>
      </div>
      <div class="detail-block block-pink">
        <h3>Hidden meaning</h3>
        <p>A name that feels rooted and kind — easy to grow into.</p>
      </div>
    </div>
    <div class="spacer"></div>
    <div class="actions">
      <div class="btn btn-pink">♡ Save this name</div>
      <div class="btn btn-secondary">Share</div>
      <div class="btn btn-ghost">Back to names</div>
    </div>
  </div>`;
  return shellHtml(1080, 1920, body, css);
}

function favouritesHtml() {
  const css = phoneBaseCss + `
  .name-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .name-card {
    background: #FFFFFF;
    border: 2px solid #E2E8F0;
    border-radius: 28px;
    padding: 36px 40px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 24px;
  }
  .name-title {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 2.2rem;
    letter-spacing: -0.02em;
  }
  .name-meta {
    font-size: 1.35rem;
    color: #64748B;
    margin-top: 8px;
  }
  .heart-on {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #F472B6;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 1.8rem;
  }
  .actions { display: flex; flex-direction: column; gap: 16px; }
  `;
  const names = [
    ['Oliver', 'Olive tree — peace · Classic'],
    ['Grace', 'Favour, blessing · Classic'],
    ['Ezra', 'Help · Rising'],
    ['Naomi', 'Pleasantness · Classic'],
  ];
  const cards = names
    .map(
      ([n, m]) => `
    <div class="name-card">
      <div>
        <div class="name-title">${escapeHtml(n)}</div>
        <div class="name-meta">${escapeHtml(m)}</div>
      </div>
      <div class="heart-on">♥</div>
    </div>`,
    )
    .join('');
  const body = `
  <div class="phone">
    <div class="status"><span>9:41</span><span>Favourites</span></div>
    <div>
      <h1>Favourites</h1>
      <p class="lede">Saved on this device — easy to share with family, or on TikTok.</p>
    </div>
    <div class="name-list">${cards}</div>
    <div class="spacer"></div>
    <div class="actions">
      <div class="btn btn-pink">Share shortlist</div>
      <div class="btn btn-secondary">Back</div>
    </div>
    <p class="trust">Shortlist stays on this phone · no account</p>
  </div>`;
  return shellHtml(1080, 1920, body, css);
}

function screenshot(htmlPath, pngPath, w, h) {
  const fileUrl = `file://${htmlPath}`;
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--window-size=${w},${h}`,
    `--screenshot=${pngPath}`,
    '--default-background-color=00000000',
    '--virtual-time-budget=10000',
    '--run-all-compositor-stages-before-draw',
    fileUrl,
  ];
  const r = spawnSync(chrome, args, { encoding: 'utf8', timeout: 90000 });
  if (r.status !== 0) {
    console.error(`Chrome failed for ${pngPath}:`, r.stderr || r.stdout);
    process.exit(1);
  }
}

function pngSize(path) {
  const buf = readFileSync(path);
  if (buf.toString('ascii', 1, 4) !== 'PNG') throw new Error(`Not PNG: ${path}`);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  return { w, h };
}

mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const jobs = [];

// Feature graphic
{
  const htmlPath = join(TMP, 'feature.html');
  const pngPath = join(OUT, 'feature-graphic-1024x500.png');
  writeFileSync(htmlPath, featureGraphicHtml(), 'utf8');
  screenshot(htmlPath, pngPath, 1024, 500);
  jobs.push({ file: 'feature-graphic-1024x500.png', w: 1024, h: 500, path: pngPath, note: 'Feature graphic' });
  console.log('OK feature graphic');
}

// Icon
{
  const svg = readFileSync(ICON_SVG, 'utf8');
  const htmlPath = join(TMP, 'icon.html');
  const pngPath = join(OUT, 'icon-512.png');
  writeFileSync(htmlPath, iconHtml(svg), 'utf8');
  screenshot(htmlPath, pngPath, 512, 512);
  jobs.push({ file: 'icon-512.png', w: 512, h: 512, path: pngPath, note: 'Maskable-safe app icon (~10% inset)' });
  console.log('OK icon-512');
}

// Screenshots
const shots = [
  { slug: 'screenshot-01-welcome-1080x1920.png', html: welcomeHtml, note: 'Welcome — hero + Start naming' },
  { slug: 'screenshot-02-gender-1080x1920.png', html: genderHtml, note: 'Gender — Boy / Girl blocks' },
  { slug: 'screenshot-03-deck-1080x1920.png', html: deckHtml, note: 'Deck — name card + Save/Skip' },
  { slug: 'screenshot-04-detail-1080x1920.png', html: detailHtml, note: 'Detail — meaning + Share' },
  { slug: 'screenshot-06-favourites-1080x1920.png', html: favouritesHtml, note: 'Favourites shortlist' },
];

for (const s of shots) {
  const htmlPath = join(TMP, s.slug.replace('.png', '.html'));
  const pngPath = join(OUT, s.slug);
  writeFileSync(htmlPath, s.html(), 'utf8');
  screenshot(htmlPath, pngPath, 1080, 1920);
  jobs.push({ file: s.slug, w: 1080, h: 1920, path: pngPath, note: s.note });
  console.log(`OK ${s.slug}`);
}

// Share — reuse existing sharecard (already 1080×1920)
{
  const pngPath = join(OUT, 'screenshot-05-share-1080x1920.png');
  if (!existsSync(SHARE_SRC)) {
    console.error(`Missing share source: ${SHARE_SRC}`);
    process.exit(1);
  }
  copyFileSync(SHARE_SRC, pngPath);
  jobs.push({
    file: 'screenshot-05-share-1080x1920.png',
    w: 1080,
    h: 1920,
    path: pngPath,
    note: 'Share card (from docs/sharecards/namey-oliver-share.png)',
  });
  console.log('OK screenshot-05-share (copied)');
}

// Verify dimensions
for (const j of jobs) {
  const { w, h } = pngSize(j.path);
  if (w !== j.w || h !== j.h) {
    console.error(`BAD SIZE ${j.file}: got ${w}×${h}, expected ${j.w}×${j.h}`);
    process.exit(1);
  }
  console.log(`VERIFY ${j.file} ${w}×${h}`);
}

// Sort jobs for README in logical order
const order = [
  'feature-graphic-1024x500.png',
  'icon-512.png',
  'screenshot-01-welcome-1080x1920.png',
  'screenshot-02-gender-1080x1920.png',
  'screenshot-03-deck-1080x1920.png',
  'screenshot-04-detail-1080x1920.png',
  'screenshot-05-share-1080x1920.png',
  'screenshot-06-favourites-1080x1920.png',
];
jobs.sort((a, b) => order.indexOf(a.file) - order.indexOf(b.file));

const readme = `# Namey — Google Play Store listing assets

Brand: background \`#F5F9FF\`, surface \`#FFFFFF\`, primary \`#3B82F6\`, pink \`#F472B6\`, text \`#0F172A\`, muted \`#64748B\`, border \`#E2E8F0\`.
Fonts: Nunito (display) + Figtree (body).

**Regenerate:** \`node scripts/export-play-store.mjs\`

## Files

| File | Dimensions | Notes |
|------|------------|-------|
${jobs.map((j) => `| \`${j.file}\` | ${j.w}×${j.h} | ${j.note} |`).join('\n')}

## Absolute paths

${jobs.map((j) => `- \`${j.path}\``).join('\n')}

## Notes

- Screenshots are full-bleed app UI stubs (no phone chrome frame) for Play Console phone listing.
- \`icon-512.png\` insets the blue disc ~10% so important content stays inside the maskable safe zone.
- \`screenshot-05-share-1080x1920.png\` is copied from \`docs/sharecards/namey-oliver-share.png\` (already 1080×1920).
`;

writeFileSync(join(OUT, 'README.md'), readme, 'utf8');
console.log(`Wrote ${join(OUT, 'README.md')}`);

try {
  rmSync(TMP, { recursive: true, force: true });
} catch (_) {}

console.log(`Done: ${jobs.length} assets`);
