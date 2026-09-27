import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Rename DarkProductCarousel to ProductCarousel and add dark: variants
const oldDarkCarouselRegex = /function DarkProductCarousel\(\{ title, products, icon, onAdd \}: \{ title: string; products: any\[\]; icon: string; onAdd: \(product: any\) => void \}\) \{[\s\S]*?\n\}\n/g;

const newProductCarousel = `function ProductCarousel({ title, products, icon, onAdd }: { title: string; products: any[]; icon: string; onAdd: (product: any) => void }) {
  return (
    <div className="py-12 border-b border-[#e2eaf6] dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-3xl font-bold text-[#1a2236] dark:text-white text-center mb-8 flex items-center justify-center gap-2">
          <span>{icon}</span> {title}
        </h2>
        
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 bg-black/10 dark:bg-black/40 text-[#1a2236] dark:text-white rounded-full flex items-center justify-center hover:bg-black/20 dark:hover:bg-black/60 transition-colors z-10 hidden md:flex">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product, i) => (
            <div key={i} className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-4 flex flex-col items-center hover:shadow-2xl transition-all cursor-pointer group relative hover:-translate-y-1 border border-[#e2eaf6] dark:border-transparent">
              <span className="absolute top-4 left-4 border border-[#f5a623] text-[#f5a623] text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                Mới
              </span>
              
              <Link to={\`/product/\${toSlug(product.name)}\`} className="w-full aspect-square flex items-center justify-center mb-4 mt-2">
                <img src={product.img} alt={product.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl" />
              </Link>
              
              <div className="text-center w-full mt-auto">
                <Link to={\`/product/\${toSlug(product.name)}\`} className="text-sm font-semibold text-[#1a2236] dark:text-white leading-snug hover:text-[#1a6fdb] line-clamp-2 mb-2">
                  {product.name}
                </Link>
                <div className="flex flex-col items-center gap-1 mb-3">
                  <span className="text-base font-bold text-[#1a2236] dark:text-white">{fmt(product.price)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 line-through">{fmt(product.original)}</span>
                    <span className="text-xs text-[#1a6fdb] dark:text-gray-300">-{product.off}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Hàng sắp về</p>
                <button
                  onClick={(e) => { e.preventDefault(); onAdd(product); }}
                  className="w-full py-2 text-xs font-bold text-[#1a6fdb] dark:text-white bg-[#f0f5fc] dark:bg-white/10 rounded-xl hover:bg-[#1a6fdb] hover:text-white transition-colors"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 bg-black/10 dark:bg-black/40 text-[#1a2236] dark:text-white rounded-full flex items-center justify-center hover:bg-black/20 dark:hover:bg-black/60 transition-colors z-10 hidden md:flex">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
`;

content = content.replace(oldDarkCarouselRegex, newProductCarousel);

// 2. Update HomePage to use ProductCarousel
const oldHomePage = `function HomePage() {
  const { onAddToCart } = useOutletContext<{ onAddToCart: () => void }>();
  return (
    <div className="bg-[#3e3e3f]">
      <HeroBanner />
      <TopCategories />
      <DarkProductCarousel title="Điện thoại" products={smartphones} icon="📱" onAdd={onAddToCart} />
      <DarkProductCarousel title="Laptop / Mac" products={laptops} icon="💻" onAdd={onAddToCart} />
      <DarkProductCarousel title="Máy tính bảng" products={tablets} icon="📱" onAdd={onAddToCart} />
      <DarkProductCarousel title="Phụ kiện" products={accessoriesData} icon="🔌" onAdd={onAddToCart} />
    </div>
  );
}`;

const newHomePage = `function HomePage() {
  const { onAddToCart } = useOutletContext<{ onAddToCart: () => void }>();
  return (
    <div className="bg-transparent">
      <HeroBanner />
      <TopCategories />
      <ProductCarousel title="Điện thoại" products={smartphones} icon="📱" onAdd={onAddToCart} />
      <ProductCarousel title="Laptop / Mac" products={laptops} icon="💻" onAdd={onAddToCart} />
      <ProductCarousel title="Máy tính bảng" products={tablets} icon="📱" onAdd={onAddToCart} />
      <ProductCarousel title="Phụ kiện" products={accessoriesData} icon="🔌" onAdd={onAddToCart} />
    </div>
  );
}`;

content = content.replace(oldHomePage, newHomePage);

// 3. Update RootLayout to have dark variants
content = content.replace(
  /<div className="min-h-screen bg-\[#f0f5fc\] flex flex-col">/,
  '<div className="min-h-screen bg-[#f0f5fc] dark:bg-[#1c1c1e] flex flex-col transition-colors">'
);

// 4. Update Header
content = content.replace(
  /<header className="bg-white shadow-sm sticky top-0 z-50">/,
  '<header className="bg-white dark:bg-[#2c2c2e] border-b border-transparent dark:border-white/10 shadow-sm sticky top-0 z-50 transition-colors">'
);
content = content.replace(
  /<div className="flex-1 flex items-center bg-\[#f0f5fc\] border border-\[#e2eaf6\] rounded-xl px-4 py-2\.5 gap-3 max-w-2xl">/,
  '<div className="flex-1 flex items-center bg-[#f0f5fc] dark:bg-[#1c1c1e] border border-[#e2eaf6] dark:border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-2xl transition-colors">'
);
content = content.replace(
  /<span className="text-xl font-bold text-\[#1a6fdb\] tracking-tight">BigBangMart<\/span>/,
  '<span className="text-xl font-bold text-[#1a6fdb] dark:text-blue-400 tracking-tight">BigBangMart</span>'
);
content = content.replace(
  /<span className="hidden sm:inline">Đăng nhập<\/span>/,
  '<span className="hidden sm:inline text-[#1a2236] dark:text-white">Đăng nhập</span>'
);
content = content.replace(
  /<span className="text-sm font-semibold text-\[#1a2236\] hidden sm:inline">Xin chào, \{user\.name\}<\/span>/,
  '<span className="text-sm font-semibold text-[#1a2236] dark:text-white hidden sm:inline">Xin chào, {user.name}</span>'
);
// fix link hover in header
content = content.replace(
  /<Link to="\/login" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-\[#f0f5fc\] transition-colors text-sm font-medium text-\[#1a2236\]">/,
  '<Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f0f5fc] dark:hover:bg-white/10 transition-colors text-sm font-medium text-[#1a2236] dark:text-white">'
);


// 5. Update CategoryNav
content = content.replace(
  /<nav className="bg-white border-b border-\[#e2eaf6\]">/,
  '<nav className="bg-white dark:bg-[#2c2c2e] border-b border-[#e2eaf6] dark:border-white/10 transition-colors">'
);
content = content.replace(
  /\? "bg-\[#1a6fdb\] text-white"\n                    : "text-\[#1a2236\] hover:bg-\[#f0f5fc\]"/,
  '? "bg-[#1a6fdb] text-white"\n                    : "text-[#1a2236] dark:text-white hover:bg-[#f0f5fc] dark:hover:bg-white/10"'
);

// 6. Update TopCategories
content = content.replace(
  /<div className="bg-\[#323232\] rounded-2xl p-5 border border-white\/10">/,
  '<div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-5 border border-[#e2eaf6] dark:border-white/10 transition-colors">'
);
content = content.replace(
  /<h2 className="text-lg font-bold text-white">/,
  '<h2 className="text-lg font-bold text-[#1a2236] dark:text-white">'
);
content = content.replace(
  /<span className="text-xs font-medium text-white text-center leading-tight">\{c\.label\}<\/span>/g,
  '<span className="text-xs font-medium text-[#1a2236] dark:text-white text-center leading-tight">{c.label}</span>'
);
content = content.replace(
  /bg-\[#f0f5fc\]">/g,
  'bg-[#f0f5fc] dark:bg-[#1c1c1e]">'
);

fs.writeFileSync('src/App.tsx', content);
