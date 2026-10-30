/**
 * High-Resolution Professional Automotive Studio Photography Registry for Roshani Traders
 * Maps all 28 products across all 10 categories to their individual studio photography images.
 */

export const PRODUCT_IMAGE_MAP = {
  // Category 1: Body Parts & Panels
  'bajaj-re-front-rear-wheel-mudguard-set-majgad': '/images/products/mudguard-set.webp',
  'custom-molded-three-wheeler-dashboard-console-assembly': '/images/products/dashboard-console.webp',
  'bajaj-re-mudguard-majgad-set': '/images/products/mudguard-set.webp',
  'three-wheeler-dashboard-console': '/images/products/dashboard-console.webp',

  // Category 2: Bumpers & Protection Guards
  'bajaj-re-front-bumper-heavy-duty-steel': '/images/products/front-bumper.webp',
  'universal-rear-bumper-bar-with-safety-reflector': '/images/products/rear-bumper.webp',
  'bajaj-re-front-bumper-heavy-duty': '/images/products/front-bumper.webp',
  'universal-rear-bumper-safety-reflector': '/images/products/rear-bumper.webp',

  // Category 3: Side Mirrors & Rear View
  'auto-rickshaw-convex-side-mirror-pair': '/images/products/convex-side-mirror.webp',
  'chrome-plated-auto-rickshaw-mirror-set': '/images/products/chrome-mirror-set.webp',

  // Category 4: Lights & Indicators
  'auto-rickshaw-high-intensity-headlight-assembly': '/images/products/headlight-assembly.webp',
  'led-multi-function-rear-tail-light-pair': '/images/products/led-tail-light.webp',
  'side-indicator-amber-light-lens-pack-set-of-4': '/images/products/indicator-light-pack.webp',
  'auto-rickshaw-high-intensity-headlight': '/images/products/headlight-assembly.webp',
  'side-indicator-amber-light-lens-pack': '/images/products/indicator-light-pack.webp',

  // Category 5: Brake Systems & Drums
  'tvs-king-bajaj-re-heavy-duty-brake-shoe-set': '/images/products/brake-shoe-set.webp',
  'piaggio-ape-heavy-duty-brake-drum-assembly': '/images/products/brake-drum.webp',
  'tvs-king-heavy-duty-brake-shoe-set': '/images/products/brake-shoe-set.webp',

  // Category 6: Engine & Clutch Parts
  'bajaj-re-205cc-cylinder-block-piston-kit': '/images/products/cylinder-piston-kit.webp',
  'heavy-duty-clutch-plate-pressure-plate-kit': '/images/products/clutch-plate-kit.webp',
  'carburetor-assembly-for-bajaj-re-2-stroke-4-stroke': '/images/products/carburetor-assembly.webp',
  'bajaj-re-cylinder-piston-kit': '/images/products/cylinder-piston-kit.webp',
  'heavy-duty-clutch-plate-pressure-kit': '/images/products/clutch-plate-kit.webp',
  'bajaj-re-carburetor-assembly': '/images/products/carburetor-assembly.webp',

  // Category 7: Suspension & Shock Absorbers
  'front-hydraulic-shock-absorber-assembly': '/images/products/front-shock-absorber.webp',
  'rear-suspension-bush-pin-kit': '/images/products/suspension-bush-pin-kit.webp',
  'front-hydraulic-shock-absorber': '/images/products/front-shock-absorber.webp',

  // Category 8: Electrical & Wiring
  'ignition-switch-lock-assembly-with-2-master-keys': '/images/products/ignition-switch.webp',
  'heavy-duty-100-copper-battery-wiring-harness-cable': '/images/products/battery-wiring-cable.webp',
  'wiper-motor-assembly-12v-dc-with-arm-blade': '/images/products/wiper-motor.webp',
  'speedometer-gauge-meter-assembly-bajaj-re-4-stroke': '/images/products/speedometer-meter.webp',
  'bajaj-re-ignition-switch-lock': '/images/products/ignition-switch.webp',
  'copper-battery-wiring-harness-cable': '/images/products/battery-wiring-cable.webp',
  'auto-rickshaw-wiper-motor-assembly': '/images/products/wiper-motor.webp',
  'speedometer-gauge-meter-assembly': '/images/products/speedometer-meter.webp',

  // Category 9: Decorative Items & Chrome Badges
  'stop-mono-chrome-emblem-led-reflector-light': '/images/products/chrome-led-emblem.webp',
  'dera-patty-inco-stainless-steel-side-strip-set': '/images/products/stainless-steel-side-strips.webp',
  'monogram-morris-vintage-chrome-badge-emblem': '/images/products/vintage-chrome-badge.webp',
  'aerodynamic-roof-spoiler-with-integrated-led-brake-light': '/images/products/roof-spoiler.webp',
  'decorative-chrome-wheel-cap-cover-set-4-pcs': '/images/products/chrome-wheel-caps.webp',
  'stop-mono-chrome-emblem-led-reflector': '/images/products/chrome-led-emblem.webp',
  'dera-patty-inco-stainless-side-strip-set': '/images/products/stainless-steel-side-strips.webp',
  'monogram-morris-vintage-chrome-badge': '/images/products/vintage-chrome-badge.webp',
  'aerodynamic-roof-spoiler-led-brake-light': '/images/products/roof-spoiler.webp',
  'decorative-chrome-wheel-cap-cover-set': '/images/products/chrome-wheel-caps.webp',

  // Category 10: Accessories & Canopies
  'waterproof-cabin-rain-canopy-cover-600d-pvc': '/images/products/rain-canopy.webp',
  'luxury-leatherette-auto-rickshaw-seat-cover-set': '/images/products/leatherette-seat-cover.webp',
  'soft-touch-anti-slip-rubber-handle-grip-set': '/images/products/rubber-handle-grips.webp',
  'auto-rickshaw-rain-canopy': '/images/products/rain-canopy.webp',
  'auto-rickshaw-seat-cover-set': '/images/products/leatherette-seat-cover.webp',
  'rubber-handle-grip-set': '/images/products/rubber-handle-grips.webp'
};

/**
 * Resolves optimal studio photography image URL for any product
 */
export const getProductImage = (product) => {
  if (!product) return '/images/products/headlight-assembly.webp';

  // 1. If product has an explicit image URL pointing to webp or jpg or custom upload
  if (product.image && typeof product.image === 'string' && product.image.trim()) {
    const imgStr = product.image.trim();
    if (imgStr.startsWith('/images/products/') && (imgStr.endsWith('.webp') || imgStr.endsWith('.jpg') || imgStr.endsWith('.png'))) {
      return imgStr;
    }
    if (imgStr.startsWith('data:image/') || imgStr.startsWith('http://') || imgStr.startsWith('https://')) {
      return imgStr;
    }
  }

  // 2. Direct slug or ID mapping
  if (product.slug && PRODUCT_IMAGE_MAP[product.slug]) {
    return PRODUCT_IMAGE_MAP[product.slug];
  }

  // 3. Exact name keyword mapping
  const nameLower = (product.name || '').toLowerCase();

  if (nameLower.includes('mudguard') || nameLower.includes('majgad')) return '/images/products/mudguard-set.webp';
  if (nameLower.includes('dashboard') || nameLower.includes('console')) return '/images/products/dashboard-console.webp';
  if (nameLower.includes('rear bumper') || (nameLower.includes('bumper') && nameLower.includes('rear'))) return '/images/products/rear-bumper.webp';
  if (nameLower.includes('bumper')) return '/images/products/front-bumper.webp';
  if (nameLower.includes('chrome') && nameLower.includes('mirror')) return '/images/products/chrome-mirror-set.webp';
  if (nameLower.includes('mirror') || nameLower.includes('convex')) return '/images/products/convex-side-mirror.webp';
  if (nameLower.includes('headlight')) return '/images/products/headlight-assembly.webp';
  if (nameLower.includes('tail light') || nameLower.includes('rear light')) return '/images/products/led-tail-light.webp';
  if (nameLower.includes('indicator') || nameLower.includes('amber')) return '/images/products/indicator-light-pack.webp';
  if (nameLower.includes('brake shoe')) return '/images/products/brake-shoe-set.webp';
  if (nameLower.includes('brake drum')) return '/images/products/brake-drum.webp';
  if (nameLower.includes('cylinder') || nameLower.includes('piston')) return '/images/products/cylinder-piston-kit.webp';
  if (nameLower.includes('clutch')) return '/images/products/clutch-plate-kit.webp';
  if (nameLower.includes('carburetor')) return '/images/products/carburetor-assembly.webp';
  if (nameLower.includes('shock') || nameLower.includes('hydraulic')) return '/images/products/front-shock-absorber.webp';
  if (nameLower.includes('bush') || nameLower.includes('pin') || nameLower.includes('suspension')) return '/images/products/suspension-bush-pin-kit.webp';
  if (nameLower.includes('ignition') || nameLower.includes('switch') || nameLower.includes('key')) return '/images/products/ignition-switch.webp';
  if (nameLower.includes('battery') || nameLower.includes('cable') || nameLower.includes('wiring') || nameLower.includes('harness')) return '/images/products/battery-wiring-cable.webp';
  if (nameLower.includes('wiper')) return '/images/products/wiper-motor.webp';
  if (nameLower.includes('speedometer') || nameLower.includes('meter') || nameLower.includes('gauge')) return '/images/products/speedometer-meter.webp';
  if (nameLower.includes('stop mono')) return '/images/products/chrome-led-emblem.webp';
  if (nameLower.includes('dera patty') || nameLower.includes('side strip')) return '/images/products/stainless-steel-side-strips.webp';
  if (nameLower.includes('monogram') || nameLower.includes('morris')) return '/images/products/vintage-chrome-badge.webp';
  if (nameLower.includes('spoiler') || nameLower.includes('roof')) return '/images/products/roof-spoiler.webp';
  if (nameLower.includes('wheel cap') || nameLower.includes('rim') || nameLower.includes('hubcap')) return '/images/products/chrome-wheel-caps.webp';
  if (nameLower.includes('canopy') || nameLower.includes('rain')) return '/images/products/rain-canopy.webp';
  if (nameLower.includes('seat')) return '/images/products/leatherette-seat-cover.webp';
  if (nameLower.includes('grip') || nameLower.includes('handle')) return '/images/products/rubber-handle-grips.webp';

  return '/images/products/front-shock-absorber.webp';
};

export default getProductImage;
