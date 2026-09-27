import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update banners to add link target
content = content.replace(
  /alt: "Smart watch",/g,
  'alt: "Smart watch", link: "/category/dong-ho-thong-minh"'
);
content = content.replace(
  /alt: "Smartphone",/g,
  'alt: "Smartphone", link: "/category/dien-thoai"'
);
content = content.replace(
  /alt: "Laptop",/g,
  'alt: "Laptop", link: "/category/laptop"'
);

// Update HeroBanner component to use Link for "Mua ngay"
content = content.replace(
  /<button className="mt-5 px-6 py-2\.5 bg-\[#1a6fdb\] text-white text-sm font-semibold rounded-xl hover:bg-\[#1558b0\] transition-colors">\s*Mua ngay\s*<\/button>/g,
  `<Link to={b.link} className="inline-block mt-5 px-6 py-2.5 bg-[#1a6fdb] text-white text-sm font-semibold rounded-xl hover:bg-[#1558b0] transition-colors">
              Mua ngay
            </Link>`
);

fs.writeFileSync('src/App.tsx', content);
