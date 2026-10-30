const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'client/public/images/products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Studio Part Graphic Generator for SEO-named vector images
const createStudioSVG = (name, category, partType, colorPrimary = '#f59e0b', colorSecondary = '#38bdf8') => {
  let graphic = '';

  if (partType === 'bumper') {
    graphic = `
      <g filter="url(#glow)">
        <rect x="80" y="150" width="440" height="36" rx="18" fill="#1e293b" stroke="${colorPrimary}" stroke-width="6"/>
        <line x1="120" y1="186" x2="120" y2="250" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
        <line x1="480" y1="186" x2="480" y2="250" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
        <rect x="150" y="170" width="300" height="24" rx="12" fill="#0f172a" stroke="${colorSecondary}" stroke-width="4"/>
        <circle cx="200" cy="182" r="10" fill="#ef4444"/>
        <circle cx="400" cy="182" r="10" fill="#ef4444"/>
      </g>
    `;
  } else if (partType === 'brake') {
    graphic = `
      <g filter="url(#glow)">
        <path d="M160,240 A140,140 0 0,1 440,240" fill="none" stroke="${colorPrimary}" stroke-width="32" stroke-linecap="round"/>
        <path d="M180,230 A115,115 0 0,1 420,230" fill="none" stroke="#334155" stroke-width="16"/>
        <circle cx="210" cy="190" r="8" fill="#ef4444"/>
        <circle cx="390" cy="190" r="8" fill="#ef4444"/>
        <line x1="210" y1="190" x2="390" y2="190" stroke="#10b981" stroke-width="6" stroke-dasharray="8,6"/>
      </g>
    `;
  } else if (partType === 'cylinder' || partType === 'engine') {
    graphic = `
      <g filter="url(#glow)">
        <rect x="210" y="90" width="180" height="170" rx="16" fill="#1e293b" stroke="${colorPrimary}" stroke-width="6"/>
        <line x1="190" y1="120" x2="410" y2="120" stroke="#94a3b8" stroke-width="8"/>
        <line x1="190" y1="155" x2="410" y2="155" stroke="#94a3b8" stroke-width="8"/>
        <line x1="190" y1="190" x2="410" y2="190" stroke="#94a3b8" stroke-width="8"/>
        <line x1="190" y1="225" x2="410" y2="225" stroke="#94a3b8" stroke-width="8"/>
        <circle cx="300" cy="175" r="45" fill="#0f172a" stroke="#10b981" stroke-width="6"/>
      </g>
    `;
  } else if (partType === 'mirror') {
    graphic = `
      <g filter="url(#glow)">
        <ellipse cx="300" cy="140" rx="120" ry="85" fill="#1e293b" stroke="${colorPrimary}" stroke-width="6"/>
        <ellipse cx="300" cy="140" rx="105" ry="70" fill="#0284c7" opacity="0.35" stroke="${colorSecondary}" stroke-width="4"/>
        <path d="M300,225 L300,270 M300,270 L210,295" stroke="#94a3b8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="210" cy="295" r="14" fill="#334155" stroke="${colorPrimary}" stroke-width="4"/>
      </g>
    `;
  } else if (partType === 'light') {
    graphic = `
      <g filter="url(#glow)">
        <circle cx="300" cy="160" r="95" fill="#1e293b" stroke="${colorPrimary}" stroke-width="6"/>
        <circle cx="300" cy="160" r="75" fill="#0f172a" stroke="${colorSecondary}" stroke-width="4"/>
        <circle cx="300" cy="160" r="35" fill="#fef08a" stroke="#eab308" stroke-width="5"/>
        <path d="M220,160 L140,110 M220,160 L140,210 M380,160 L460,110 M380,160 L460,210" stroke="#eab308" stroke-width="5" stroke-dasharray="8,5"/>
      </g>
    `;
  } else if (partType === 'shock') {
    graphic = `
      <g filter="url(#glow)">
        <rect x="285" y="60" width="30" height="230" rx="15" fill="#1e293b" stroke="${colorPrimary}" stroke-width="5"/>
        <path d="M275,100 Q325,115 275,130 Q325,145 275,160 Q325,175 275,190 Q325,205 275,220" fill="none" stroke="#ef4444" stroke-width="12" stroke-linecap="round"/>
        <circle cx="300" cy="65" r="14" fill="#334155" stroke="${colorSecondary}" stroke-width="4"/>
        <circle cx="300" cy="285" r="14" fill="#334155" stroke="${colorSecondary}" stroke-width="4"/>
      </g>
    `;
  } else if (partType === 'electrical') {
    graphic = `
      <g filter="url(#glow)">
        <rect x="230" y="110" width="140" height="110" rx="14" fill="#1e293b" stroke="${colorPrimary}" stroke-width="6"/>
        <circle cx="300" cy="165" r="28" fill="#0f172a" stroke="${colorSecondary}" stroke-width="4"/>
        <path d="M300,150 L300,180 M285,165 L315,165" stroke="#f59e0b" stroke-width="4"/>
        <path d="M200,190 Q230,240 300,240 T400,190" fill="none" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>
      </g>
    `;
  } else if (partType === 'accessory') {
    graphic = `
      <g filter="url(#glow)">
        <path d="M160,180 Q300,100 440,180 L420,260 Q300,220 180,260 Z" fill="#1e293b" stroke="${colorPrimary}" stroke-width="6"/>
        <rect x="220" y="160" width="160" height="60" rx="10" fill="#0284c7" opacity="0.3" stroke="${colorSecondary}" stroke-width="3"/>
        <line x1="300" y1="110" x2="300" y2="250" stroke="#f59e0b" stroke-width="4" stroke-dasharray="6,6"/>
      </g>
    `;
  } else {
    // Default decorative / chrome / multi part
    graphic = `
      <g filter="url(#glow)">
        <polygon points="300,70 380,140 350,250 250,250 220,140" fill="#1e293b" stroke="${colorPrimary}" stroke-width="6"/>
        <circle cx="300" cy="170" r="38" fill="#0f172a" stroke="${colorSecondary}" stroke-width="5"/>
        <text x="300" y="177" fill="${colorPrimary}" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">★</text>
      </g>
    `;
  }

  const safeTitle = String(name).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
  const safeCat = String(category).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 600 450">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <radialGradient id="studioLight" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.7"/>
    </filter>
  </defs>
  
  <!-- Background Studio Box -->
  <rect width="600" height="450" fill="url(#bgGrad)"/>
  <rect width="600" height="450" fill="url(#studioLight)"/>
  
  <!-- Isolated Studio Grid Floor -->
  <line x1="50" y1="310" x2="550" y2="310" stroke="#334155" stroke-width="2" stroke-dasharray="6,4"/>
  <ellipse cx="300" cy="310" rx="200" ry="18" fill="#000000" opacity="0.45"/>

  <!-- Product Graphic -->
  ${graphic}

  <!-- Studio Spec Banner -->
  <rect x="30" y="340" width="540" height="85" rx="14" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
  <text x="300" y="372" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="16" text-anchor="middle" font-weight="800">${safeTitle}</text>
  <text x="300" y="398" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="12" text-anchor="middle" font-weight="700">${safeCat} • OEM Standard Fitment</text>
  <text x="300" y="415" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="10" text-anchor="middle" font-weight="600">ROSHANI TRADERS WHOLESALE MANAGEMENT</text>
</svg>`;
};

// 25 Product Image definitions mapped to SEO filenames
const productImages = [
  { file: 'stop-mono-chrome-emblem-led-reflector.svg', name: 'Stop Mono Chrome Emblem & LED Reflector Light', category: 'Decorative Items & Chrome Badges', type: 'decorative' },
  { file: 'dera-patty-inco-stainless-side-strip-set.svg', name: 'Dera Patty Inco Stainless Steel Side Strip Set', category: 'Decorative Items & Chrome Badges', type: 'decorative' },
  { file: 'bajaj-re-front-bumper-heavy-duty.svg', name: 'Bajaj RE Front Bumper - Heavy Duty Steel', category: 'Bumpers & Protection Guards', type: 'bumper' },
  { file: 'universal-rear-bumper-safety-reflector.svg', name: 'Universal Rear Bumper Bar with Safety Reflector', category: 'Bumpers & Protection Guards', type: 'bumper' },
  { file: 'bajaj-re-mudguard-majgad-set.svg', name: 'Bajaj RE Front & Rear Wheel Mudguard Set (Majgad)', category: 'Body Parts & Panels', type: 'accessory' },
  { file: 'monogram-morris-vintage-chrome-badge.svg', name: 'Monogram Morris Vintage Chrome Badge Emblem', category: 'Decorative Items & Chrome Badges', type: 'decorative' },
  { file: 'aerodynamic-roof-spoiler-led-brake-light.svg', name: 'Aerodynamic Roof Spoiler with Integrated LED Brake Light', category: 'Decorative Items & Chrome Badges', type: 'decorative' },
  { file: 'three-wheeler-dashboard-console.svg', name: 'Custom Molded Three Wheeler Dashboard Console Assembly', category: 'Body Parts & Panels', type: 'accessory' },
  { file: 'tvs-king-heavy-duty-brake-shoe-set.svg', name: 'TVS King & Bajaj RE Heavy Duty Brake Shoe Set', category: 'Brake Systems & Drums', type: 'brake' },
  { file: 'piaggio-ape-brake-drum-assembly.svg', name: 'Piaggio Ape Heavy Duty Brake Drum Assembly', category: 'Brake Systems & Drums', type: 'brake' },
  { file: 'bajaj-re-cylinder-piston-kit.svg', name: 'Bajaj RE 205cc Cylinder Block & Piston Kit', category: 'Engine & Clutch Parts', type: 'cylinder' },
  { file: 'heavy-duty-clutch-plate-pressure-kit.svg', name: 'Heavy Duty Clutch Plate & Pressure Plate Kit', category: 'Engine & Clutch Parts', type: 'engine' },
  { file: 'auto-rickshaw-high-intensity-headlight.svg', name: 'Auto Rickshaw High Intensity Headlight Assembly', category: 'Lights & Indicators', type: 'light' },
  { file: 'auto-rickshaw-led-rear-tail-light-pair.svg', name: 'LED Multi-Function Rear Tail Light Pair', category: 'Lights & Indicators', type: 'light' },
  { file: 'side-indicator-amber-light-lens-pack.svg', name: 'Side Indicator Amber Light Lens Pack (Set of 4)', category: 'Lights & Indicators', type: 'light' },
  { file: 'auto-rickshaw-convex-side-mirror-pair.svg', name: 'Auto Rickshaw Convex Side Mirror Pair', category: 'Side Mirrors & Rear View', type: 'mirror' },
  { file: 'chrome-plated-auto-rickshaw-mirror-set.svg', name: 'Chrome Plated Auto Rickshaw Mirror Set', category: 'Side Mirrors & Rear View', type: 'mirror' },
  { file: 'front-hydraulic-shock-absorber.svg', name: 'Front Hydraulic Shock Absorber Assembly', category: 'Suspension & Shock Absorbers', type: 'shock' },
  { file: 'rear-suspension-bush-pin-kit.svg', name: 'Rear Suspension Bush & Pin Kit', category: 'Suspension & Shock Absorbers', type: 'shock' },
  { file: 'bajaj-re-ignition-switch-lock.svg', name: 'Ignition Switch Lock Assembly with 2 Master Keys', category: 'Electrical & Wiring', type: 'electrical' },
  { file: 'copper-battery-wiring-harness-cable.svg', name: 'Heavy Duty 100% Copper Battery Wiring Harness Cable', category: 'Electrical & Wiring', type: 'electrical' },
  { file: 'auto-rickshaw-wiper-motor-assembly.svg', name: 'Wiper Motor Assembly 12V DC with Arm & Blade', category: 'Electrical & Wiring', type: 'electrical' },
  { file: 'auto-rickshaw-rain-canopy.svg', name: 'Waterproof Cabin Rain Canopy Cover (600D PVC)', category: 'Accessories & Canopies', type: 'accessory' },
  { file: 'auto-rickshaw-seat-cover-set.svg', name: 'Luxury Leatherette Auto Rickshaw Seat Cover Set', category: 'Accessories & Canopies', type: 'accessory' },
  { file: 'rubber-handle-grip-set.svg', name: 'Soft Touch Anti-Slip Rubber Handle Grip Set', category: 'Accessories & Canopies', type: 'accessory' },
  { file: 'decorative-chrome-wheel-cap-cover-set.svg', name: 'Decorative Chrome Wheel Cap Cover Set (4 Pcs)', category: 'Decorative Items & Chrome Badges', type: 'decorative' },
  { file: 'speedometer-gauge-meter-assembly.svg', name: 'Speedometer Gauge Meter Assembly (Bajaj RE 4-Stroke)', category: 'Electrical & Wiring', type: 'electrical' },
  { file: 'bajaj-re-carburetor-assembly.svg', name: 'Carburetor Assembly for Bajaj RE 2-Stroke & 4-Stroke', category: 'Engine & Clutch Parts', type: 'engine' }
];

console.log(`Generating ${productImages.length} isolated studio SVG product image assets...`);
for (const p of productImages) {
  const svgContent = createStudioSVG(p.name, p.category, p.type);
  const outPath = path.join(targetDir, p.file);
  fs.writeFileSync(outPath, svgContent, 'utf8');
}

// Write Universal Fallback Product Image
const fallbackSvg = createStudioSVG('Genuine Auto Spare Part', 'Auto Rickshaw Spare Parts', 'default', '#94a3b8', '#64748b');
fs.writeFileSync(path.join(targetDir, 'fallback-product.svg'), fallbackSvg, 'utf8');

console.log('✅ Generated all SEO product image assets in client/public/images/products/');
