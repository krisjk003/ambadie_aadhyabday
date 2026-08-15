const fs = require('fs');
const path = require('path');

const generateSvg = (text, width = 800, height = 600) => {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1a1a1a"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" font-family="monospace" font-size="24" fill="#666" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
};

const placeholders = [
  { path: 'person1/placeholder-p1.svg', text: 'PERSON 1' },
  { path: 'person2/placeholder-p2.svg', text: 'PERSON 2' },
  ...[...Array(10)].map((_, i) => ({ path: `shared/timeline-202${i}.svg`, text: `TIMELINE 202${i}` })),
  ...[...Array(10)].map((_, i) => ({ path: `shared/memory-0${i+1}.svg`, text: `MEMORY 0${i+1}` })),
  { path: 'videos/poster.svg', text: 'VIDEO POSTER' }
];

const basePath = path.join(__dirname, 'public', 'media');

placeholders.forEach(p => {
  const fullPath = path.join(basePath, p.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, generateSvg(p.text));
});

// Create dummy audio file (just an empty text file with .mp3 extension so it doesn't crash, actually it won't play but won't 404 either)
const audioPath = path.join(basePath, 'audio', 'placeholder-bgm.mp3');
fs.writeFileSync(audioPath, 'dummy');

console.log('Placeholders generated successfully.');
