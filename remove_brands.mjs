import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove BrandsSection from HomePage
content = content.replace(/\s*<BrandsSection \/>\n/g, '\n');

// 2. Remove BrandsSection component definition
// Looking at the output, it was partially matched because of earlier replacements (Link instead of button). Let's use Regex.
content = content.replace(/function BrandsSection\(\) \{[\s\S]*?<\/section>\s*\n\}/, '');

// 3. Remove brands array
content = content.replace(/const brands = \[\s*\{\s*name: "Apple"[\s\S]*?\];\s*/, '');

fs.writeFileSync('src/App.tsx', content);
