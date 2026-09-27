import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The issue in TopCategories is that the text color is #1a2236 (dark blue/black) on a #323232 (dark grey) background, or similarly unreadable combo. 
// SectionHeader has hardcoded text-[#1a2236] and TopCategories span has text-[#1a2236].
// Since we removed dark mode globally but kept bg-[#323232] in TopCategories from the dark theme attempt, we need to revert TopCategories to a light background or make the text white.
// Let's change TopCategories background back to white to match the rest of the light theme.

content = content.replace(
  /<div className="bg-\[#323232\] rounded-2xl p-5 border border-white\/10">/,
  '<div className="bg-white rounded-2xl p-5 border border-[#e2eaf6] shadow-sm">'
);

fs.writeFileSync('src/App.tsx', content);
