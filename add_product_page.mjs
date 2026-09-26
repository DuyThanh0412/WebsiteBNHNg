import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update ProductCard to use Link
content = content.replace(
  /<div className="bg-white rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow cursor-pointer group border border-\[#e2eaf6\] relative">/g,
  '<div className="bg-white rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow group border border-[#e2eaf6] relative">'
);

content = content.replace(
  /<div className="bg-\[#f0f5fc\] rounded-xl overflow-hidden h-40 flex items-center justify-center">\s*<img src=\{product\.img\} alt=\{product\.name\} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" \/>\s*<\/div>/g,
  `<Link to={\`/product/\${toSlug(product.name)}\`} className="block bg-[#f0f5fc] rounded-xl overflow-hidden h-40 flex items-center justify-center">
        <img src={product.img} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>`
);

content = content.replace(
  /<div>\s*<p className="text-sm font-semibold text-\[#1a2236\] leading-snug">\{product\.name\}<\/p>/g,
  `<div>
        <Link to={\`/product/\${toSlug(product.name)}\`} className="text-sm font-semibold text-[#1a2236] leading-snug hover:text-[#1a6fdb] line-clamp-2">
          {product.name}
        </Link>`
);


// 2. Add ProductPage Component
const productPageCode = `
function ProductPage() {
  const { id } = useParams();
  const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void, cartItems: any[], clearCart: () => void }>();
  
  // Find product by slug
  const allProducts = [...smartphones, ...laptops, ...tablets, ...audio, ...smartwatches, ...accessoriesData, ...cameras, ...monitors];
  const product = allProducts.find(p => toSlug(p.name) === id);

  const [activeTab, setActiveTab] = useState("features");
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#1a2236] mb-4">Không tìm thấy sản phẩm</h1>
        <p className="text-[#6b7a99] mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link to="/" className="inline-block px-8 py-3 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <div className="bg-[#f0f5fc] rounded-3xl aspect-square flex items-center justify-center p-8 overflow-hidden relative">
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                Giảm {product.off}%
              </span>
              <img src={product.img} alt={product.name} className="w-full h-full object-contain" />
            </div>
            {/* Thumbnails (Giả lập) */}
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} className={\`aspect-square rounded-xl overflow-hidden border-2 \${i === 1 ? 'border-[#1a6fdb]' : 'border-[#e2eaf6] hover:border-[#1a6fdb]'} bg-[#f0f5fc]\`}>
                  <img src={product.img} alt={\`\${product.name} thumb \${i}\`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Thông tin chi tiết (Giống TopZone mockup) */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-[#1a2236] mb-2">{product.name}</h1>
            <p className="text-sm text-[#6b7a99] mb-4">Mã SP: {toSlug(product.name).toUpperCase().substring(0, 8)} | Đánh giá: 4.9/5 (128 lượt)</p>
            
            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-[#e2eaf6]">
              <div className="text-3xl font-extrabold text-[#1a6fdb]">{fmt(product.price)}</div>
              <div className="text-lg text-[#6b7a99] line-through mb-1">{fmt(product.original)}</div>
              <div className="text-sm font-medium text-emerald-600 mb-1.5 px-2 py-0.5 bg-emerald-50 rounded-md">
                Tiết kiệm {fmt(product.original - product.price)}
              </div>
            </div>

            {/* Các tùy chọn - Giả lập cho sinh động */}
            <div className="space-y-6 mb-8 flex-1">
              <div>
                <p className="text-sm font-bold text-[#1a2236] mb-3">Dung lượng / Phiên bản:</p>
                <div className="flex flex-wrap gap-3">
                  {["Tiêu chuẩn", "Nâng cao", "Cao cấp"].map((cap, i) => (
                    <button key={cap} className={\`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors \${i === 0 ? 'border-[#1a6fdb] bg-[#f0f5fc] text-[#1a6fdb]' : 'border-[#e2eaf6] text-[#6b7a99] hover:border-[#1a6fdb] hover:text-[#1a6fdb]'}\`}>
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-bold text-[#1a2236] mb-3">Màu sắc:</p>
                <div className="flex gap-3">
                  {[
                    {name: "Đen Midnight", color: "#1a2236"},
                    {name: "Trắng Starlight", color: "#f8fafc"},
                    {name: "Xanh Navy", color: "#1a6fdb"}
                  ].map((c, i) => (
                    <button key={c.name} title={c.name} className={\`w-10 h-10 rounded-full border-2 \${i === 0 ? 'border-[#1a6fdb] p-0.5' : 'border-transparent'} transition-all\`}>
                      <span className="w-full h-full block rounded-full border border-black/10" style={{backgroundColor: c.color}}></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hộp khuyến mãi */}
              <div className="bg-[#f0f5fc] border border-[#1a6fdb]/20 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#1a6fdb]"></div>
                <h3 className="font-bold text-[#1a6fdb] flex items-center gap-2 mb-3">
                  <span>🎁</span> Khuyến mãi đặc biệt
                </h3>
                <ul className="space-y-2 text-sm text-[#1a2236]">
                  <li className="flex gap-2"><span className="text-[#1a6fdb]">•</span> Tặng Voucher 500.000đ khi mua kèm phụ kiện.</li>
                  <li className="flex gap-2"><span className="text-[#1a6fdb]">•</span> Thu cũ đổi mới trợ giá thêm đến 2.000.000đ.</li>
                  <li className="flex gap-2"><span className="text-[#1a6fdb]">•</span> Giảm thêm 5% khi thanh toán qua SePay VietQR.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 mt-auto pt-6">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 py-4 bg-[#1a6fdb] text-white font-bold rounded-xl hover:bg-[#1558b0] transition-colors shadow-lg shadow-blue-500/20 text-lg flex items-center justify-center gap-2"
              >
                Thêm vào giỏ
              </button>
              <button className="w-16 h-16 bg-[#f0f5fc] text-[#1a6fdb] rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors border border-[#e2eaf6]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Thông tin thêm bên dưới */}
        <div className="mt-16 pt-12 border-t border-[#e2eaf6]">
          <div className="flex gap-8 border-b border-[#e2eaf6] mb-8 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab("features")}
              className={\`pb-4 font-bold text-lg whitespace-nowrap transition-colors border-b-2 \${activeTab === 'features' ? 'border-[#1a6fdb] text-[#1a6fdb]' : 'border-transparent text-[#6b7a99] hover:text-[#1a2236]'}\`}
            >
              Đặc điểm nổi bật
            </button>
            <button 
              onClick={() => setActiveTab("specs")}
              className={\`pb-4 font-bold text-lg whitespace-nowrap transition-colors border-b-2 \${activeTab === 'specs' ? 'border-[#1a6fdb] text-[#1a6fdb]' : 'border-transparent text-[#6b7a99] hover:text-[#1a2236]'}\`}
            >
              Thông số kỹ thuật
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6 text-[#1a2236] leading-relaxed">
              {activeTab === 'features' ? (
                <>
                  <h3 className="text-xl font-bold">Mô tả sản phẩm</h3>
                  <p>{product.name} là một trong những sản phẩm công nghệ hàng đầu hiện nay, mang đến trải nghiệm đột phá với hiệu năng vượt trội và thiết kế tinh tế. Máy được trang bị bộ vi xử lý thế hệ mới nhất, giúp xử lý mượt mà mọi tác vụ từ làm việc đến giải trí.</p>
                  <img src={product.img} className="w-full h-80 object-cover rounded-2xl bg-[#f0f5fc]" alt="Feature" />
                  <p>Màn hình hiển thị xuất sắc với độ phân giải siêu cao, dải màu rộng và tần số quét lớn mang lại hình ảnh sống động, chân thực đến từng chi tiết. Bên cạnh đó, hệ thống tản nhiệt tiên tiến đảm bảo máy luôn hoạt động mát mẻ trong thời gian dài.</p>
                </>
              ) : (
                <div className="bg-[#f0f5fc] rounded-2xl p-6 border border-[#e2eaf6]">
                  <h3 className="text-xl font-bold mb-6">Thông số kỹ thuật chi tiết</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Màn hình", "Super Retina XDR, OLED, HDR10, 120Hz"],
                        ["Hệ điều hành", "Phiên bản mới nhất"],
                        ["Camera sau", "Chính 48MP & Phụ 12MP, 12MP"],
                        ["Camera trước", "12MP, 3D LiDAR"],
                        ["Chip xử lý", "Vi xử lý đa nhân thế hệ mới"],
                        ["RAM", "Phiên bản 8GB / 12GB / 16GB"],
                        ["Bộ nhớ trong", "256GB / 512GB / 1TB"],
                        ["Pin & Sạc", "Hỗ trợ sạc nhanh, Sạc không dây"],
                      ].map((row, i) => (
                        <tr key={i} className={\`border-b border-[#e2eaf6] \${i % 2 === 0 ? 'bg-white' : ''}\`}>
                          <td className="py-3 px-4 font-medium text-[#6b7a99] w-1/3">{row[0]}</td>
                          <td className="py-3 px-4 font-semibold text-[#1a2236]">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#e2eaf6] rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-lg text-[#1a2236] mb-4">Sản phẩm tương tự</h3>
                <div className="space-y-4">
                  {smartphones.slice(0, 3).map((p, i) => (
                    <Link to={\`/product/\${toSlug(p.name)}\`} key={i} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-[#f0f5fc] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                        <img src={p.img} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-sm font-semibold text-[#1a2236] group-hover:text-[#1a6fdb] transition-colors line-clamp-2 mb-1">{p.name}</p>
                        <p className="text-sm font-bold text-[#1a6fdb]">{fmt(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(/function CheckoutPage\(\) \{/, productPageCode + '\nfunction CheckoutPage() {');

// 3. Add to router
content = content.replace(
  /\{ path: "checkout", Component: CheckoutPage \},/,
  `{ path: "checkout", Component: CheckoutPage },\n      { path: "product/:id", Component: ProductPage },`
);

fs.writeFileSync('src/App.tsx', content);
