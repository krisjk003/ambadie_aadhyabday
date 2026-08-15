const fs = require('fs');
const path = require('path');

const generateSvg = (width = 800, height = 600, type = 'real', seed = 1) => {
  const isReal = type === 'real';
  const bgColors = isReal ? ['#05050A', '#0A0A15'] : ['#151020', '#251530'];
  const accentColors = isReal ? ['#3FE0C5', '#F4C95D'] : ['#C05BF4', '#FF8A65'];
  
  // Create an abstract gradient / shape based on seed to look like intentional artwork
  const bg = bgColors[seed % 2];
  const accent = accentColors[seed % 2];
  const cx = 20 + (seed * 15 % 60);
  const cy = 20 + (seed * 25 % 60);
  const r = 30 + (seed * 10 % 40);

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="grad${seed}" cx="${cx}%" cy="${cy}%" r="${r}%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="${bg}" stop-opacity="1" />
      </radialGradient>
      <filter id="noise${seed}">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.1 0" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad${seed})"/>
    <rect width="100%" height="100%" filter="url(#noise${seed})" opacity="0.4" mix-blend-mode="overlay"/>
    <circle cx="${100-cx}%" cy="${100-cy}%" r="${r/2}%" fill="${accent}" opacity="0.1" filter="blur(40px)"/>
  </svg>`;
};

const basePath = path.join(__dirname, 'public', 'images');

const subjects = ['subject-01', 'subject-02'];
subjects.forEach((sub, i) => {
  ['real', 'cartoon'].forEach(type => {
    const dir = path.join(basePath, 'subjects', sub, type);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'portrait.svg'), generateSvg(600, 800, type, i + 5));
  });
});

['real', 'cartoon'].forEach(type => {
  const dir = path.join(basePath, 'memories', type);
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 1; i <= 20; i++) {
    const num = i.toString().padStart(2, '0');
    fs.writeFileSync(path.join(dir, `memory-${num}.svg`), generateSvg(800, 600, type, i));
  }
});

// Secret memory
['real', 'cartoon'].forEach(type => {
  fs.writeFileSync(path.join(basePath, 'memories', type, `memory-secret.svg`), generateSvg(800, 600, type, 99));
});

console.log('Artwork placeholders generated without watermark text.');
