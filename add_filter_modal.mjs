import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newCategoryPageStart = `function CategoryPage() {
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh] relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a2236]">Danh mục: {title}</h1>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-[#e2eaf6] rounded-lg text-sm font-medium hover:bg-[#f0f5fc] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Bộ lọc
        </button>
      </div>

      {/* Filter Modal (Mô phỏng TopZone) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
          <div className="relative bg-[#323232] text-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#323232] z-10 flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold mx-auto">Tất cả bộ lọc</h2>
              <button onClick={() => setIsFilterOpen(false)} className="absolute right-6 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8">
              
              <div>
                <h3 className="font-bold mb-3">Dòng sản phẩm</h3>
                <div className="flex flex-wrap gap-3">
                  {["Cao cấp", "Tầm trung", "Giá rẻ", "Phiên bản đặc biệt"].map(f => (
                    <button key={f} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-[#1a6fdb] hover:border-[#1a6fdb] transition-colors">{f}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3">Giá</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {["Dưới 15 triệu", "Từ 15 - 20 triệu", "Từ 20 - 25 triệu", "Từ 25 - 30 triệu", "Trên 30 triệu"].map(f => (
                    <button key={f} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-[#1a6fdb] hover:border-[#1a6fdb] transition-colors">{f}</button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-[#3b82f6] mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  <span>Hoặc chọn mức giá phù hợp với bạn</span>
                </div>
                
                {/* Giả lập thanh kéo Range Slider */}
                <div className="relative h-1 bg-white/20 rounded-full mb-6 mx-2">
                   <div className="absolute left-[20%] right-[30%] h-full bg-[#3b82f6] rounded-full"></div>
                   <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#3b82f6] rounded-full shadow cursor-pointer"></div>
                   <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#3b82f6] rounded-full shadow cursor-pointer"></div>
                </div>

                <div className="flex justify-center gap-4">
                  <div className="px-4 py-2 bg-transparent border border-white/20 rounded-lg w-32 text-center text-sm">15.000.000đ</div>
                  <div className="px-4 py-2 bg-transparent border border-white/20 rounded-lg w-32 text-center text-sm">40.000.000đ</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3">Dung lượng lưu trữ</h3>
                <div className="flex flex-wrap gap-3">
                  {["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"].map(f => (
                    <button key={f} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-[#1a6fdb] hover:border-[#1a6fdb] transition-colors">{f}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3">RAM</h3>
                <div className="flex flex-wrap gap-3">
                  {["4 GB", "6 GB", "8 GB", "12 GB"].map(f => (
                    <button key={f} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-[#1a6fdb] hover:border-[#1a6fdb] transition-colors">{f}</button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-[#2c2c2e] p-4 border-t border-white/10 flex justify-center gap-4">
              <button onClick={() => setIsFilterOpen(false)} className="px-8 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">Bỏ chọn</button>
              <button onClick={() => setIsFilterOpen(false)} className="px-8 py-2.5 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">Xem 15 kết quả</button>
            </div>

          </div>
        </div>
      )}

      {pageProducts.length > 0 ? (`

content = content.replace(/function CategoryPage\(\) \{[\s\S]*?\{pageProducts\.length > 0 \? \(/, newCategoryPageStart);

fs.writeFileSync('src/App.tsx', content);
