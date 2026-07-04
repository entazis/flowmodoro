/**
 * Generates the full Flowmodoro icon set + store assets from SVG.
 * Run: node scripts/gen-icons.cjs
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const ICONS_DIR = path.resolve(__dirname, '../extension/icons');
const STORE_DIR = path.resolve(__dirname, '../store-assets');
fs.mkdirSync(STORE_DIR, { recursive: true });

// Brand gradients: cool blue = work/idle, warm orange = break.
const BLUE = ['#2563EB', '#6366F1', '#7C3AED'];
const ORANGE = ['#FB923C', '#F97316', '#EA580C'];

// The core timer mark, rendered on a 128x128 tile.
const mark = ([c1, c2, c3], run) => `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="0.5" stop-color="${c2}"/>
      <stop offset="1" stop-color="${c3}"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg)"/>
  <circle cx="64" cy="64" r="34" fill="none" stroke="#ffffff" stroke-opacity="0.32" stroke-width="8"/>
  <path d="M 64 30 A 34 34 0 1 1 30 64" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <path d="M 56 50 L 82 64 L 56 78 Z" fill="#ffffff" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>
  ${run ? '<circle cx="99" cy="99" r="18" fill="#22C55E" stroke="#ffffff" stroke-width="7"/>' : ''}
`;

const iconSvg = (colors, run) =>
  `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">${mark(colors, run)}</svg>`;

const renderPng = (svg, size) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();

const SIZES = [16, 32, 48, 128];
const VARIANTS = [
  { suffix: '', colors: BLUE, run: false }, // idle
  { suffix: '-run', colors: BLUE, run: true }, // working
  { suffix: '-orange', colors: ORANGE, run: false }, // breakReady
  { suffix: '-orange-run', colors: ORANGE, run: true }, // breakRunning
];

for (const v of VARIANTS) {
  const svg = iconSvg(v.colors, v.run);
  for (const s of SIZES) {
    const out = path.join(ICONS_DIR, `icon-${s}${v.suffix}.png`);
    fs.writeFileSync(out, renderPng(svg, s));
    console.log('wrote', path.relative(process.cwd(), out));
  }
}

// Store icon (128, idle look).
fs.writeFileSync(path.join(STORE_DIR, 'store-icon-128.png'), renderPng(iconSvg(BLUE, false), 128));
console.log('wrote store-assets/store-icon-128.png');

// Small promo tile (440x280).
const promo = `<svg width="440" height="280" viewBox="0 0 440 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="440" y2="280" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2563EB"/>
      <stop offset="0.5" stop-color="#6366F1"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="440" height="280" fill="url(#pbg)"/>
  <g transform="translate(30,89) scale(0.8)">
    <rect width="128" height="128" rx="28" fill="#ffffff" fill-opacity="0.12"/>
    <circle cx="64" cy="64" r="34" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="8"/>
    <path d="M 64 30 A 34 34 0 1 1 30 64" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    <path d="M 56 50 L 82 64 L 56 78 Z" fill="#ffffff" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>
  </g>
  <text x="150" y="138" font-family="DejaVu Sans, sans-serif" font-size="38" font-weight="700" fill="#ffffff">Flowmodoro</text>
  <text x="152" y="168" font-family="DejaVu Sans, sans-serif" font-size="15.5" fill="#ffffff" fill-opacity="0.88">Work in flow. Rest in balance.</text>
</svg>`;
fs.writeFileSync(path.join(STORE_DIR, 'promo-tile-440x280.png'), renderPng(promo, 440));
console.log('wrote store-assets/promo-tile-440x280.png');
