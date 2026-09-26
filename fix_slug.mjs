import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const slugFn = `
const toSlug = (str: string) => {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\\s+/g, "-")
    .replace(/-+/g, "-");
};

const fmt = (n: number) => \`₫\${n.toLocaleString("vi-VN")}\`;`;

content = content.replace(/const fmt = \(n: number\) => `₫\$\{n\.toLocaleString\("vi-VN"\)\}`;/, slugFn);

content = content.replace(/const slug = c\.label\.toLowerCase\(\)\.replace\(\/ \/g, '-'\);/g, 'const slug = toSlug(c.label);');
content = content.replace(/const slug = l\.toLowerCase\(\)\.replace\(\/ \/g, '-'\);/g, 'const slug = toSlug(l);');
content = content.replace(/const slug = l\.toLowerCase\(\)\.replace\(\/ & \/g, '-'\)\.replace\(\/ \/g, '-'\);/g, 'const slug = toSlug(l);');

fs.writeFileSync('src/App.tsx', content);
