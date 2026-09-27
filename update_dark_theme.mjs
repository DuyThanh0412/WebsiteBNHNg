import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newDarkSection = `
function DarkProductCarousel({ title, products, icon, onAdd }: { title: string; products: any[]; icon: string; onAdd: (product: any) => void }) {
  return (
    <div className="bg-[#3e3e3f] py-12 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-3xl font-bold text-white text-center mb-8 flex items-center justify-center gap-2">
          <span>{icon}</span> {title}
        </h2>
        
        {/* Left Arrow */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors z-10 hidden md:flex">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product, i) => (
            <div key={i} className="bg-[#323232] rounded-2xl p-4 flex flex-col items-center hover:shadow-2xl transition-all cursor-pointer group relative hover:-translate-y-1">
              <span className="absolute top-4 left-4 border border-[#f5a623] text-[#f5a623] text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                Mới
              </span>
              
              <Link to={\`/product/\${toSlug(product.name)}\`} className="w-full aspect-square flex items-center justify-center mb-4 mt-2">
                <img src={product.img} alt={product.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl" />
              </Link>
              
              <div className="text-center w-full mt-auto">
                <Link to={\`/product/\${toSlug(product.name)}\`} className="text-sm font-semibold text-white leading-snug hover:text-[#1a6fdb] line-clamp-2 mb-2">
                  {product.name}
                </Link>
                <div className="flex flex-col items-center gap-1 mb-3">
                  <span className="text-base font-bold text-white">{fmt(product.price)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">{fmt(product.original)}</span>
                    <span className="text-xs text-gray-300">-{product.off}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">Hàng sắp về</p>
                <button
                  onClick={(e) => { e.preventDefault(); onAdd(product); }}
                  className="w-full py-2 text-xs font-bold text-white bg-white/10 rounded-xl hover:bg-[#1a6fdb] transition-colors"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors z-10 hidden md:flex">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
`;

content = content.replace(/\/\/ ─── Components ─────────────────────────────────────────────────────────────/, newDarkSection + '\n\n// ─── Components ─────────────────────────────────────────────────────────────');

// Replace SmartphonesSection and AccessoriesSection calls in HomePage
const oldHomePage = `function HomePage() {
  const { onAddToCart } = useOutletContext<{ onAddToCart: () => void }>();
  return (
    <>
      <HeroBanner />
      <SmartphonesSection onAddToCart={onAddToCart} />
      <TopCategories />
      
      <AccessoriesSection />
    </>
  );
}`;

const newHomePage = `function HomePage() {
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

content = content.replace(/function HomePage\(\) \{[\s\S]*?<\/>\s*\);\s*\}/, newHomePage);

// Need to change the background of TopCategories and HeroBanner slightly to fit the dark theme, or just let them stay white. TopZone has dark everywhere.
// Let's modify TopCategories to be dark theme friendly.
content = content.replace(
  /<div className="bg-white rounded-2xl p-5 border border-\[#e2eaf6\]">/g,
  '<div className="bg-[#323232] rounded-2xl p-5 border border-white/10">'
);
content = content.replace(
  /<h2 className="text-lg font-bold text-\[#1a2236\]">/g,
  '<h2 className="text-lg font-bold text-white">'
);
content = content.replace(
  /<span className="text-xs font-medium text-\[#1a2236\] text-center leading-tight">\{c\.label\}<\/span>/g,
  '<span className="text-xs font-medium text-white text-center leading-tight">{c.label}</span>'
);

fs.writeFileSync('src/App.tsx', content);
