import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace name
content = content.replace(/MegaMart/g, 'BigBangMart');

// Replace logo "M"
content = content.replace(/>M<\/div>/g, '>B</div>');

// The user might have typed admin@megamart.com in the login instructions, replace with bigbangmart.com
content = content.replace(/admin@megamart\.com/g, 'admin@bigbangmart.com');

fs.writeFileSync('src/App.tsx', content);
