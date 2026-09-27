import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I need to look closely at the previous error. Ah, my previous `CategoryPage` update using regex probably failed to match properly or was overridden by an even older version, because the code I just read for CategoryPage is NOT the dark theme one I built. 
// Wait, the user's screenshot shows the OLD light theme ProductCards rendered on a DARK background, which makes the text black-on-dark-grey (unreadable).
// Let's remove the dark classes globally.

content = content.replace(/ dark:[a-z0-9A-Z\-\/\[\]#]+/g, '');
content = content.replace(/dark:[a-z0-9A-Z\-\/\[\]#]+/g, ''); // just in case without space

fs.writeFileSync('src/App.tsx', content);
