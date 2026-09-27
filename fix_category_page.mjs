import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newCategoryPageContent = `
function CategoryPage() {
  const { id } = useParams();
  
  const categoryMatch = categories.find(c => toSlug(c.label) === id) 
    || topCategories.find(c => toSlug(c.label) === id);
    
  const title = categoryMatch 
    ? categoryMatch.label 
    : (id ? id.replace(/-/g, " ").replace(/(^\\w|[\\s]\\S)/g, l => l.toUpperCase()) : "Danh mục");

  const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void, cartItems: any[], clearCart: () => void }>();

  let pageProducts = smartphones;
  if (id === 'laptop') pageProducts = laptops;
  else if (id === 'may-tinh-bang' || id === 'tablet') pageProducts = tablets;
  else if (id === 'am-thanh') pageProducts = audio;
  else if (id === 'dong-ho-thong-minh' || id === 'smartwatch') pageProducts = smartwatches;
  else if (id === 'phu-kien') pageProducts = accessoriesData;
  else if (id === 'camera') pageProducts = cameras;
  else if (id === 'man-hinh') pageProducts = monitors;

  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filters = id === 'phu-kien' ? [
    "Tất cả", "Phụ kiện iPhone", "Phụ kiện Mac", "Phụ kiện iPad", "Phụ kiện Apple Watch", "Sạc dự phòng", "Bàn phím", "Adapter sạc", "Cáp sạc", "Hub, cáp chuyển đổi", "Ốp lưng, ví da iPhone", "Ốp lưng iPad", "Chuột máy tính", "Bút tablet", "Airtag", "Apple TV", "Túi đựng AirPods", "Balo, túi chống sốc", "Dây/Ốp Apple Watch", "Phụ kiện công nghệ", "Phụ kiện bảo vệ"
  ] : id === 'laptop' ? [
    "Tất cả", "MacBook", "Dell", "HP", "Asus", "Acer", "Lenovo", "MSI"
  ] : [
    "Tất cả", "Nổi bật", "Mới nhất", "Giá giảm nhiều"
  ];

  return (
    <div className="bg-[#3e3e3f] min-h-screen pb-16">
      {/* Header Banner - Giống ảnh */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
        {id === 'phu-kien' && (
          <div className="bg-white rounded-2xl p-6 mx-auto max-w-4xl shadow-lg flex items-center justify-between overflow-hidden">
            <div className="text-left flex-1 pl-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Apple Pencil Pro</h2>
            </div>
            <div className="w-1/3 flex justify-center">
              <img src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop" alt="Banner Image" className="w-full object-contain" />
            </div>
            <div className="flex-1 pr-4 text-right">
              <h2 className="text-3xl font-black text-[#1a6fdb] mb-2 uppercase tracking-tight">Say Mướt</h2>
              <p className="text-sm font-semibold text-gray-600 mb-3">Vẽ đẹp. Thích Mê.</p>
              <div className="inline-flex items-center text-sm">
                <div className="bg-[#1a6fdb] text-white px-3 py-1.5 font-bold rounded-l-lg border-r border-blue-400">Giá chỉ từ<br/>3.290.000₫</div>
                <div className="bg-[#1a6fdb] text-white px-3 py-1.5 font-bold rounded-r-lg">Trả chậm<br/>0%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-8">
        {/* Chips/Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-5xl mx-auto">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={\`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors \${
                activeFilter === filter
                  ? "bg-[#1a6fdb] text-white border border-[#1a6fdb]"
                  : "bg-transparent text-gray-300 border border-gray-600 hover:border-gray-400 hover:text-white"
              }\`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sort order line */}
        <div className="flex items-center justify-start gap-3 text-xs text-gray-400 max-w-5xl mx-auto mb-8 font-medium">
          <span>Sắp xếp theo:</span>
          <button className="text-white hover:underline">Nổi bật</button> •
          <button className="hover:text-white transition-colors">Bán chạy</button> •
          <button className="hover:text-white transition-colors">Giảm giá</button> •
          <button className="hover:text-white transition-colors">Mới</button> •
          <button className="hover:text-white transition-colors">Giá ▼</button>
        </div>

        {/* Product Grid */}
        {pageProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {pageProducts.map((p, i) => (
              <div key={i} className="bg-[#323232] rounded-2xl p-4 flex flex-col items-center hover:shadow-2xl transition-all cursor-pointer group relative hover:-translate-y-1">
                <span className="absolute top-4 left-4 border border-[#f5a623] text-[#f5a623] text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                  Mới
                </span>
                
                <Link to={\`/product/\${toSlug(p.name)}\`} className="w-full aspect-square flex items-center justify-center mb-4 mt-2">
                  <img src={p.img} alt={p.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl" />
                </Link>
                
                <div className="text-center w-full mt-auto">
                  <Link to={\`/product/\${toSlug(p.name)}\`} className="text-sm font-semibold text-white leading-snug hover:text-[#1a6fdb] line-clamp-2 mb-2">
                    {p.name}
                  </Link>
                  <div className="flex flex-col items-center gap-1 mb-3">
                    <span className="text-base font-bold text-white">{fmt(p.price)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through">{fmt(p.original)}</span>
                      {p.off > 0 && <span className="text-xs text-gray-300">-{p.off}%</span>}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); onAddToCart(p); }}
                    className="w-full py-2 text-xs font-bold text-white bg-white/10 rounded-xl hover:bg-[#1a6fdb] transition-colors"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#323232] p-12 rounded-2xl border border-white/10 text-center max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">📦</div>
            <h2 className="text-xl font-bold text-white mb-2">Đang cập nhật sản phẩm</h2>
            <p className="text-gray-400">Các sản phẩm thuộc danh mục {title} sẽ sớm được cập nhật. Vui lòng quay lại sau!</p>
          </div>
        )}
      </div>
    </div>
  );
}`;

content = content.replace(/function CategoryPage\(\) \{[\s\S]*?<\/>\s*\);\s*\}/, newCategoryPageContent);

// A little hack in the above replacement because the original ended with `</div>\n  );\n}`, so the regex might fail if it matches too greedily. Let's fix that safely.
content = content.replace(/function CategoryPage\(\) \{[\s\S]*?return \([\s\S]*?\}\n\nfunction SearchPage/g, newCategoryPageContent + '\n\nfunction SearchPage');

fs.writeFileSync('src/App.tsx', content);
