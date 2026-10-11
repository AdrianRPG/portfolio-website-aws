// Generates og-image.png (1200x630) for social sharing previews.
// Run with: node generate-og-image.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1200;
const H = 630;
const PHOTO_W = 420; // width of the right-side photo panel

async function main() {
  // 1. Prepare the headshot: cover-crop into the right panel size.
  const photo = await sharp('headshot.jpg')
    .resize(PHOTO_W, H, { fit: 'cover', position: 'top' })
    .toBuffer();

  // 2. Background + text layer as SVG.
  const bg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="monospace">
  <rect width="${W}" height="${H}" fill="#101113"/>
  <g stroke="#ffffff" stroke-opacity="0.03">
    <line x1="0" y1="105" x2="${W}" y2="105"/><line x1="0" y1="210" x2="${W}" y2="210"/>
    <line x1="0" y1="315" x2="${W}" y2="315"/><line x1="0" y1="420" x2="${W}" y2="420"/><line x1="0" y1="525" x2="${W}" y2="525"/>
    <line x1="150" y1="0" x2="150" y2="${H}"/><line x1="300" y1="0" x2="300" y2="${H}"/><line x1="450" y1="0" x2="450" y2="${H}"/><line x1="600" y1="0" x2="600" y2="${H}"/>
  </g>
  <g color="#82d8e5" opacity="0.08">
    <g transform="translate(600,120)"><circle r="34" fill="none" stroke="currentColor" stroke-width="3"/><ellipse rx="34" ry="12" fill="none" stroke="currentColor" stroke-width="2"/><line x1="0" y1="34" x2="0" y2="-34" stroke="currentColor" stroke-width="2"/></g>
    <g transform="translate(660,520)"><rect x="-24" y="-3" width="48" height="36" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M-13 -3 V-16 a13 13 0 0 1 26 0 V-3" fill="none" stroke="currentColor" stroke-width="3"/></g>
  </g>
  <text x="78" y="80" font-size="26" font-weight="600" fill="#f0f1f2">[ ARP<tspan fill="#82d8e5">G.</tspan> ]</text>
  <rect x="80" y="150" width="12" height="12" fill="#82d8e5"/>
  <text x="106" y="161" font-size="19" fill="#82d8e5" letter-spacing="2">BACHELOR OF ARTS IN COMPUTER SCIENCE</text>
  <text x="76" y="285" font-size="70" font-weight="500" fill="#f0f1f2" letter-spacing="-2">Adrian Renato</text>
  <text x="76" y="365" font-size="70" font-weight="500" fill="#f0f1f2" letter-spacing="-2">Pérez Galindo</text>
  <rect x="80" y="420" width="4" height="66" fill="#82d8e5"/>
  <text x="104" y="449" font-size="27" fill="#82d8e5">Cybersecurity · Software</text>
  <text x="104" y="483" font-size="27" fill="#82d8e5">Quantum Computing · Cloud · IT</text>
  <text x="80" y="560" font-size="20" fill="#afb4bc">Lima, Peru → Miami, FL   ·   Seeking OPT-eligible roles</text>
</svg>`);

  // 3. A thin accent divider on the left edge of the photo panel.
  const divider = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="${H}"><rect width="4" height="${H}" fill="#82d8e5"/></svg>`
  );

  // 4. Dark overlay on the photo so it blends with the dark theme.
  const overlay = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO_W}" height="${H}"><rect width="${PHOTO_W}" height="${H}" fill="#101113" fill-opacity="0.06"/></svg>`
  );

  await sharp(bg)
    .composite([
      { input: photo, left: W - PHOTO_W, top: 0 },
      { input: overlay, left: W - PHOTO_W, top: 0 },
      { input: divider, left: W - PHOTO_W - 4, top: 0 },
    ])
    .png()
    .toFile('og-image.png');

  const stat = fs.statSync('og-image.png');
  console.log('og-image.png created:', (stat.size / 1024).toFixed(1), 'KB');
}

main().catch((e) => { console.error(e); process.exit(1); });
