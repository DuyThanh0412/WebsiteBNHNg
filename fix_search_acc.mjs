import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldAccessoriesSection = `function AccessoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl p-5 border border-[#e2eaf6]">
        <SectionHeader title="Phụ kiện" accent="Nổi bật" onViewAll={() => {}} />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {accessories.map((e) => (
            <button key={e.label} className="flex flex-col items-center gap-2 group">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f0f5fc] border border-[#e2eaf6] group-hover:border-[#1a6fdb] transition-colors">
                <img src={e.img} alt={e.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#1a2236] leading-tight">{e.label}</p>
                <p className="text-xs text-[#1a6fdb] font-medium">{e.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}`;

const newAccessoriesSection = `function AccessoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl p-5 border border-[#e2eaf6]">
        <SectionHeader title="Phụ kiện" accent="Nổi bật" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {accessories.map((e) => (
            <Link key={e.label} to={\`/search?q=\${encodeURIComponent(e.label)}\`} className="flex flex-col items-center gap-2 group">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f0f5fc] border border-[#e2eaf6] group-hover:border-[#1a6fdb] transition-colors">
                <img src={e.img} alt={e.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#1a2236] leading-tight">{e.label}</p>
                <p className="text-xs text-[#1a6fdb] font-medium">{e.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}`;

content = content.replace(oldAccessoriesSection, newAccessoriesSection);

// 3. Create SearchPage component
const searchPageCode = `
function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void }>();
  
  // Collect all products to filter from
  const allProducts = [...smartphones, ...laptops, ...tablets, ...audio, ...smartwatches, ...accessoriesData, ...cameras, ...monitors];
  
  // Very basic search filter: check if product name includes the search query (case-insensitive)
  const results = allProducts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold text-[#1a2236] mb-6">Kết quả tìm kiếm cho: "{q}"</h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {results.map((p, i) => (
            <ProductCard key={i} product={p} onAdd={onAddToCart} />
          ))}
        </div>
      ) : (
         <div className="bg-white p-12 rounded-2xl border border-[#e2eaf6] text-center">
           <div className="w-16 h-16 bg-[#f0f5fc] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🔍</div>
           <h2 className="text-xl font-bold text-[#1a2236] mb-2">Không tìm thấy sản phẩm</h2>
           <p className="text-[#6b7a99]">Rất tiếc, chúng tôi không tìm thấy sản phẩm nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác.</p>
         </div>
      )}
    </div>
  );
}
`;

content = content.replace(/function CategoryPage\(\) \{/, searchPageCode + '\nfunction CategoryPage() {');

// 4. Register Search route
content = content.replace(
  /\{ path: "category\/:id", Component: CategoryPage \},/,
  `{ path: "category/:id", Component: CategoryPage },\n      { path: "search", Component: SearchPage },`
);

// 5. Update header search input to actually navigate to search
const oldHeaderSearch = `<input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6b7a99]"
            placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[#6b7a99] hover:text-[#1a2236] transition-colors">✕</button>
          )}`;
          
const newHeaderSearch = `<form className="flex-1 flex items-center" onSubmit={(e) => { e.preventDefault(); if (search) window.location.href = \`/search?q=\${encodeURIComponent(search)}\`; }}>
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6b7a99]"
              placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-[#6b7a99] hover:text-[#1a2236] transition-colors mr-2">✕</button>
            )}
            <button type="submit" className="hidden">Tìm kiếm</button>
          </form>`;

content = content.replace(oldHeaderSearch, newHeaderSearch);

fs.writeFileSync('src/App.tsx', content);
