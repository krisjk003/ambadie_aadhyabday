# TWO - Cinematic Birthday Website

## How to run the project
1. Ensure you have Node.js installed.
2. Run `npm install` in this directory.
3. Run `npm run dev` to start the development server.
4. Open `http://localhost:3000` in your browser.

## Where to edit content
The entire website is controlled by a single configuration file. Open `src/data/config.ts` to edit:
- **Names:** Edit `config.names`
- **Statistics:** Edit `config.stats`
- **Timeline Events:** Edit `config.timeline`
- **Memories:** Edit `config.memories`
- **Heist Puzzles:** Edit `config.heist.puzzles`
- **Friendship Wrapped:** Edit `config.wrapped`
- **Messages/Transmissions:** Edit `config.transmissions`

## Where to replace media
All placeholder media files are inside `public/media/`. The folders are:
- `/public/media/person1/` - Portrait for [NAME_01]
- `/public/media/person2/` - Portrait for [NAME_02]
- `/public/media/shared/` - Photos for timeline and memory vault
- `/public/media/audio/` - Background music file (placeholder-bgm.mp3)
- `/public/media/videos/` - Video slots

To replace a photo, just overwrite the file in the `public/media` folder and make sure the filename matches what's written in `src/data/config.ts`.

## Easter Eggs
1. **Konami Code:** Press `↑ ↑ ↓ ↓ ← → ← → B A` anywhere on the site to trigger a secret message.
2. **Roast Mode:** Click the toggle at the bottom left to glitch the site and turn it red.
3. **Cursor Magnetism:** Hover over any button or interactive element to see the cursor grow.
