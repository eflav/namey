#!/usr/bin/env node
/**
 * Export Namey ShareCards as 1080×1920 PNGs for Marketing TikTok backlog.
 * Replicates ShareCard.tsx + NameMotif.tsx + motifVariant from lib/motif.ts.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'docs', 'sharecards');
const TMP = join(ROOT, 'docs', 'sharecards', '.tmp-html');
const NAMES_PATH = join(ROOT, 'src', 'data', 'names.json');

/** Exact FNV-ish hash from src/lib/motif.ts */
function motifVariant(nameId) {
  let h = 2166136261;
  for (let i = 0; i < nameId.length; i++) {
    h ^= nameId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 10;
}

function motifSvg(v) {
  const parts = {
    0: '<circle cx="28" cy="28" r="20" fill="#3B82F6" fill-opacity="0.55" />',
    1: '<circle cx="28" cy="28" r="18" fill="none" stroke="#F472B6" stroke-width="8" stroke-opacity="0.65" />',
    2: '<rect x="6" y="18" width="44" height="20" rx="10" fill="#3B82F6" fill-opacity="0.5" />',
    3: '<rect x="10" y="10" width="36" height="36" rx="12" fill="#F472B6" fill-opacity="0.45" />',
    4: '<circle cx="20" cy="28" r="12" fill="#3B82F6" fill-opacity="0.55" /><circle cx="38" cy="28" r="11" fill="#F472B6" fill-opacity="0.4" />',
    5: '<path d="M8 38 A20 20 0 0 1 48 38" fill="none" stroke="#3B82F6" stroke-width="10" stroke-linecap="round" stroke-opacity="0.55" />',
    6: '<rect x="12" y="8" width="8" height="40" rx="4" fill="#3B82F6" fill-opacity="0.55" /><rect x="24" y="8" width="8" height="40" rx="4" fill="#F472B6" fill-opacity="0.4" /><rect x="36" y="8" width="8" height="40" rx="4" fill="#3B82F6" fill-opacity="0.35" />',
    7: '<rect x="6" y="22" width="44" height="12" rx="3" fill="#F472B6" fill-opacity="0.5" />',
    8: '<ellipse cx="28" cy="28" rx="14" ry="22" fill="#F472B6" fill-opacity="0.5" transform="rotate(-25 28 28)" />',
    9: '<path d="M6 6 H50 V50 Z" fill="#3B82F6" fill-opacity="0.5" /><path d="M50 6 V50 H6 Z" fill="#F472B6" fill-opacity="0.4" />',
  };
  return parts[v] ?? parts[0];
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function meaningLine(n) {
  return (n.hiddenMeaning || n.meaning || '').trim();
}

function buildHtml(entry) {
  const chip = (entry.themes && entry.themes[0]) || entry.vibe || '';
  const v = motifVariant(entry.id);
  const meaning = meaningLine(entry);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=1080, height=1920" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1080px;
    height: 1920px;
    overflow: hidden;
    background: #F5F9FF;
    font-family: 'Figtree', system-ui, -apple-system, sans-serif;
    color: #0F172A;
    -webkit-font-smoothing: antialiased;
  }
  .share-card {
    width: 1080px;
    height: 1920px;
    background: #F5F9FF;
    display: flex;
    border: none;
  }
  .share-card-inner {
    position: relative;
    flex: 1;
    background: #FFFFFF;
    margin: 48px;
    border-radius: 48px;
    padding: 84px 66px 60px;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .share-card-top {
    position: relative;
    min-height: 168px;
    margin-bottom: 48px;
  }
  .share-chip {
    display: inline-flex;
    align-items: center;
    min-height: 64px;
    padding: 0 36px;
    border-radius: 999px;
    background: #DBEAFE;
    color: #1e40af;
    font-size: 1.6rem;
    font-weight: 700;
  }
  .name-motif {
    position: absolute;
    width: 168px;
    height: 168px;
    pointer-events: none;
    z-index: 1;
    filter: none;
    box-shadow: none;
  }
  .name-motif-corner {
    top: 36px;
    right: 36px;
  }
  .name-motif svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .share-card-name {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 7.2rem;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin: 0 0 48px;
    color: #0F172A;
    max-width: 10ch;
  }
  .share-card-meaning {
    font-size: 2.3rem;
    line-height: 1.4;
    color: #64748B;
    margin: 0;
    max-width: 28ch;
  }
  .share-card-footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 24px;
    padding-top: 72px;
  }
  .share-card-mark {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #3B82F6;
    color: #F472B6;
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 2.25rem;
    display: grid;
    place-items: center;
  }
  .share-card-brand {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 2.85rem;
    color: #0F172A;
  }
</style>
</head>
<body>
  <div class="share-card" aria-hidden="true">
    <div class="share-card-inner">
      <div class="share-card-top">
        ${chip ? `<span class="share-chip">${escapeHtml(chip)}</span>` : ''}
        <div class="name-motif name-motif-${v} name-motif-corner" aria-hidden="true">
          <svg viewBox="0 0 56 56" width="56" height="56" focusable="false">
            ${motifSvg(v)}
          </svg>
        </div>
      </div>
      <h2 class="share-card-name">${escapeHtml(entry.name)}</h2>
      <p class="share-card-meaning">${escapeHtml(meaning)}</p>
      <div class="share-card-footer">
        <span class="share-card-mark" aria-hidden="true">N</span>
        <span class="share-card-brand">Namey</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const WANT = [
  'Oliver', 'Ezra', 'Xavier', 'Malik', 'Reed',
  'Naomi', 'Grace', 'Paloma', 'Heidi', 'Niamh',
];

const all = JSON.parse(readFileSync(NAMES_PATH, 'utf8'));
const selected = [];
for (const name of WANT) {
  const hit = all.find((x) => x.name === name);
  if (!hit) {
    console.error(`Missing name: ${name}`);
    process.exit(1);
  }
  selected.push(hit);
}

mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const chrome = existsSync('/usr/bin/google-chrome')
  ? '/usr/bin/google-chrome'
  : existsSync('/usr/bin/google-chrome-stable')
    ? '/usr/bin/google-chrome-stable'
    : 'google-chrome';

const results = [];

for (const entry of selected) {
  const slug = entry.name.toLowerCase().replace(/\s+/g, '');
  const htmlPath = join(TMP, `${slug}.html`);
  const pngPath = join(OUT, `namey-${slug}-share.png`);
  writeFileSync(htmlPath, buildHtml(entry), 'utf8');

  const fileUrl = `file://${htmlPath}`;
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1080,1920',
    `--screenshot=${pngPath}`,
    '--default-background-color=00000000',
    '--virtual-time-budget=8000',
    '--run-all-compositor-stages-before-draw',
    fileUrl,
  ];

  const r = spawnSync(chrome, args, { encoding: 'utf8', timeout: 60000 });
  if (r.status !== 0) {
    console.error(`Chrome failed for ${entry.name}:`, r.stderr || r.stdout);
    process.exit(1);
  }
  const variant = motifVariant(entry.id);
  results.push({
    file: `namey-${slug}-share.png`,
    name: entry.name,
    gender: entry.gender,
    id: entry.id,
    motifVariant: variant,
    chip: (entry.themes && entry.themes[0]) || entry.vibe,
    meaning: meaningLine(entry),
    path: pngPath,
  });
  console.log(`OK ${entry.name} → ${pngPath} (motif ${variant})`);
}

const readme = `# Namey ShareCards (Marketing TikTok backlog)

Exported from in-app ShareCard layout (chip + NameMotif + name + hiddenMeaning/meaning + N mark + Namey).
Size: **1080×1920** (9:16) PNG. Colours: outer \`#F5F9FF\`, inner white, blue \`#3B82F6\`, pink \`#F472B6\`, chip soft blue.

Regenerate: \`node scripts/export-sharecards.mjs\`

## Files (5 boy + 5 girl)

| File | Name | Gender | Chip | Motif variant |
|------|------|--------|------|---------------|
${results
  .map(
    (r) =>
      `| \`${r.file}\` | ${r.name} | ${r.gender} | ${r.chip} | ${r.motifVariant} |`,
  )
  .join('\n')}

## Meanings used

${results.map((r) => `- **${r.name}**: ${r.meaning}`).join('\n')}
`;

writeFileSync(join(OUT, 'README.md'), readme, 'utf8');
console.log(`Wrote ${join(OUT, 'README.md')}`);
try { rmSync(TMP, { recursive: true, force: true }); } catch (_) {}
console.log(`Done: ${results.length} cards`);
