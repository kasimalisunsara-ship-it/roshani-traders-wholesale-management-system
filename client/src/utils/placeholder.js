// High Quality Vector SVG Product Generator for Three-Wheeler Auto Rickshaw Spare Parts

export const getRickshawPartSVG = (name = 'Auto Rickshaw Spare Part', category = 'Auto Parts') => {
  const titleStr = String(name).trim();
  const lowerName = titleStr.toLowerCase();
  const safeTitle = titleStr.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
  const safeCat = String(category).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

  let partGraphic = '';

  if (lowerName.includes('bumper')) {
    // Tubular Steel Bumper Graphic
    partGraphic = `
      <rect x='100' y='120' width='400' height='30' rx='15' fill='%23334155' stroke='%23f59e0b' stroke-width='6'/>
      <path d='M120,150 L120,210 M480,150 L480,210' stroke='%23cbd5e1' stroke-width='8' stroke-linecap='round'/>
      <rect x='160' y='140' width='280' height='20' rx='10' fill='%231e293b' stroke='%2338bdf8' stroke-width='4'/>
      <circle cx='200' cy='150' r='8' fill='%23ef4444'/>
      <circle cx='400' cy='150' r='8' fill='%23ef4444'/>
    `;
  } else if (lowerName.includes('brake shoe') || lowerName.includes('brake drum')) {
    // Brake Shoe / Drum Graphic
    partGraphic = `
      <path d='M180,200 A120,120 0 0,1 420,200' fill='none' stroke='%23f59e0b' stroke-width='28' stroke-linecap='round'/>
      <path d='M195,195 A100,100 0 0,1 405,195' fill='none' stroke='%23334155' stroke-width='14'/>
      <circle cx='220' cy='160' r='6' fill='%23ef4444'/>
      <circle cx='380' cy='160' r='6' fill='%23ef4444'/>
      <line x1='220' y1='160' x2='380' y2='160' stroke='%2310b981' stroke-width='4' stroke-dasharray='6,4'/>
    `;
  } else if (lowerName.includes('cylinder') || lowerName.includes('piston') || lowerName.includes('engine')) {
    // Cylinder Block & Piston Graphic
    partGraphic = `
      <rect x='220' y='70' width='160' height='150' rx='12' fill='%23334155' stroke='%23f59e0b' stroke-width='6'/>
      <line x1='200' y1='100' x2='400' y2='100' stroke='%2394a3b8' stroke-width='8'/>
      <line x1='200' y1='130' x2='400' y2='130' stroke='%2394a3b8' stroke-width='8'/>
      <line x1='200' y1='160' x2='400' y2='160' stroke='%2394a3b8' stroke-width='8'/>
      <line x1='200' y1='190' x2='400' y2='190' stroke='%2394a3b8' stroke-width='8'/>
      <circle cx='300' cy='145' r='40' fill='%230f172a' stroke='%2310b981' stroke-width='5'/>
    `;
  } else if (lowerName.includes('mirror')) {
    // Convex Side Mirror Graphic
    partGraphic = `
      <ellipse cx='300' cy='130' rx='110' ry='75' fill='%231e293b' stroke='%23f59e0b' stroke-width='6'/>
      <ellipse cx='300' cy='130' rx='95' ry='60' fill='%230284c7' opacity='0.4' stroke='%2338bdf8' stroke-width='4'/>
      <path d='M300,205 L300,250 M300,250 L220,270' stroke='%2394a3b8' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/>
      <circle cx='220' cy='270' r='12' fill='%23334155' stroke='%23f59e0b' stroke-width='4'/>
    `;
  } else if (lowerName.includes('headlight') || lowerName.includes('light') || lowerName.includes('indicator')) {
    // Headlight / LED Tail Light Graphic
    partGraphic = `
      <circle cx='300' cy='140' r='85' fill='%231e293b' stroke='%23f59e0b' stroke-width='6'/>
      <circle cx='300' cy='140' r='65' fill='%230f172a' stroke='%2338bdf8' stroke-width='4'/>
      <circle cx='300' cy='140' r='30' fill='%23fef08a' stroke='%23eab308' stroke-width='4'/>
      <path d='M230,140 L160,100 M230,140 L160,180 M370,140 L440,100 M370,140 L440,180' stroke='%23eab308' stroke-width='4' stroke-dasharray='8,4'/>
    `;
  } else if (lowerName.includes('canopy') || lowerName.includes('cover') || lowerName.includes('rain')) {
    // Rain Canopy Cover Graphic
    partGraphic = `
      <path d='M140,210 L180,80 L420,80 L460,210 Z' fill='%231e293b' stroke='%23f59e0b' stroke-width='6'/>
      <rect x='210' y='105' width='180' height='75' rx='10' fill='%230284c7' opacity='0.5' stroke='%2338bdf8' stroke-width='4'/>
      <line x1='140' y1='210' x2='460' y2='210' stroke='%2310b981' stroke-width='8'/>
    `;
  } else if (lowerName.includes('seat')) {
    // Seat Cover Graphic
    partGraphic = `
      <rect x='150' y='100' width='300' height='130' rx='20' fill='%231e293b' stroke='%23ef4444' stroke-width='6'/>
      <line x1='250' y1='100' x2='250' y2='230' stroke='%23f59e0b' stroke-width='4' stroke-dasharray='6,4'/>
      <line x1='350' y1='100' x2='350' y2='230' stroke='%23f59e0b' stroke-width='4' stroke-dasharray='6,4'/>
      <rect x='170' y='120' width='260' height='90' rx='12' fill='none' stroke='%23334155' stroke-width='4'/>
    `;
  } else if (lowerName.includes('wheel') || lowerName.includes('cap') || lowerName.includes('rim')) {
    // Chrome Wheel Cap Graphic
    partGraphic = `
      <circle cx='300' cy='140' r='90' fill='%23334155' stroke='%23f59e0b' stroke-width='6'/>
      <circle cx='300' cy='140' r='60' fill='%230f172a' stroke='%23cbd5e1' stroke-width='6'/>
      <circle cx='300' cy='140' r='20' fill='%23f59e0b'/>
      <circle cx='300' cy='95' r='8' fill='%23cbd5e1'/>
      <circle cx='300' cy='185' r='8' fill='%23cbd5e1'/>
      <circle cx='255' cy='140' r='8' fill='%23cbd5e1'/>
      <circle cx='345' cy='140' r='8' fill='%23cbd5e1'/>
    `;
  } else if (lowerName.includes('emblem') || lowerName.includes('badge') || lowerName.includes('trim') || lowerName.includes('strip')) {
    // Chrome Emblem / Strip Graphic
    partGraphic = `
      <rect x='130' y='110' width='340' height='70' rx='16' fill='%231e293b' stroke='%23f59e0b' stroke-width='6'/>
      <rect x='145' y='122' width='310' height='46' rx='10' fill='%230f172a' stroke='%23cbd5e1' stroke-width='4'/>
      <text x='300' y='153' fill='%23f59e0b' font-family='system-ui, sans-serif' font-size='22' text-anchor='middle' font-weight='900'>ROSHANI CHROME</text>
    `;
  } else {
    // Default Auto Rickshaw Chassis Graphic
    partGraphic = `
      <path d='M220,200 L250,70 L350,70 L380,200 Z' fill='%231e293b' stroke='%23f59e0b' stroke-width='6'/>
      <circle cx='300' cy='225' r='26' fill='%23334155' stroke='%2310b981' stroke-width='6'/>
      <path d='M190,200 L410,200 L380,115 L220,115 Z' fill='%230f172a' stroke='%23f59e0b' stroke-width='4'/>
      <rect x='235' y='90' width='130' height='45' rx='6' stroke='%2338bdf8' stroke-width='4' fill='%231e293b'/>
      <circle cx='235' cy='185' r='10' fill='%23ef4444'/>
      <circle cx='365' cy='185' r='10' fill='%23ef4444'/>
    `;
  }

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'><rect width='600' height='450' fill='%230f172a'/>${partGraphic}<rect x='30' y='315' width='540' height='105' rx='16' fill='%231e293b' stroke='%23334155'/><text x='300' y='352' fill='%23f59e0b' font-family='system-ui, sans-serif' font-size='18' text-anchor='middle' font-weight='800'>${safeTitle}</text><text x='300' y='382' fill='%2310b981' font-family='system-ui, sans-serif' font-size='13' text-anchor='middle' font-weight='700'>${safeCat} • Genuine Bajaj RE / TVS King / Piaggio Ape Fitment</text><text x='300' y='404' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='11' text-anchor='middle' font-weight='600'>ROSHANI TRADERS WHOLESALE MANAGEMENT</text></svg>`;
};

export const getRickshawSVG = getRickshawPartSVG;
export const handleImageError = (e, title = 'Auto Rickshaw Spare') => {
  e.target.onerror = null;
  e.target.src = '/images/products/fallback-product.svg';
};
