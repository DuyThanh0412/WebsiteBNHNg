import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newCategoriesData = `
const cameras = [
  { name: "Sony Alpha A7 IV", price: 55000000, original: 60000000, off: 8, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=240&fit=crop&auto=format" },
  { name: "Canon EOS R6", price: 62000000, original: 68000000, off: 9, img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=240&fit=crop&auto=format" },
  { name: "Fujifilm X-T4", price: 40000000, original: 45000000, off: 11, img: "https://images.unsplash.com/photo-1560264280-080f48ce3a56?w=200&h=240&fit=crop&auto=format" },
  { name: "GoPro Hero 11", price: 10500000, original: 12000000, off: 12, img: "https://images.unsplash.com/photo-1565526439243-7f2e15bc99ec?w=200&h=240&fit=crop&auto=format" }
];

const monitors = [
  { name: "Dell UltraSharp 27", price: 12500000, original: 14000000, off: 11, img: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=200&h=240&fit=crop&auto=format" },
  { name: "LG UltraGear 27", price: 8900000, original: 10000000, off: 11, img: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=200&h=240&fit=crop&auto=format" },
  { name: "Samsung Odyssey G5", price: 7500000, original: 8500000, off: 12, img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&h=240&fit=crop&auto=format" },
  { name: "Asus ProArt 27", price: 11000000, original: 12500000, off: 12, img: "https://images.unsplash.com/photo-1586952518485-11b180e92764?w=200&h=240&fit=crop&auto=format" }
];

const topCategories = [`;

content = content.replace(/const topCategories = \[/, newCategoriesData);

content = content.replace(
  /else if \(id === 'camera' \|\| id === 'man-hinh'\) pageProducts = \[\]; \/\/ Empty state/,
  `else if (id === 'camera') pageProducts = cameras;
  else if (id === 'man-hinh') pageProducts = monitors;`
);

fs.writeFileSync('src/App.tsx', content);
