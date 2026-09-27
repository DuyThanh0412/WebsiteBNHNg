import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update phone numbers
content = content.replace(/\+84 203-918-3132/g, '0848675966');

// Remove App Store and Google Play buttons
const appStoreBlock = `<div className="flex gap-2 mt-4">
            <button className="bg-black/30 hover:bg-black/50 transition-colors px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
              🍎 App Store
            </button>
            <button className="bg-black/30 hover:bg-black/50 transition-colors px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
              ▶ Google Play
            </button>
          </div>`;

content = content.replace(appStoreBlock, '');

fs.writeFileSync('src/App.tsx', content);
