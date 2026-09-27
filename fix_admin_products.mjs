import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldAdminProductsRegex = /function AdminProducts\(\) \{[\s\S]*?\n\}\n\nfunction AdminCustomers\(\)/;

const newAdminProducts = `function AdminProducts() {
  // Dữ liệu khởi tạo (Mock data)
  const initialProducts = smartphones.slice(0, 3).concat(laptops.slice(0, 2)).map((p, index) => ({
    ...p, 
    id: index.toString(),
    stock: Math.floor(Math.random() * 50) + 5, 
    category: p.price > 20000000 ? "Laptop" : "Điện thoại"
  }));

  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "Điện thoại", price: 0, original: 0, stock: 0, img: "" });

  const handleDelete = (id: string) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
       setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({ name: p.name, category: p.category, price: p.price, original: p.original || p.price, stock: p.stock, img: p.img });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: "", category: "Điện thoại", price: 0, original: 0, stock: 0, img: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const off = formData.original > formData.price ? Math.round((1 - formData.price / formData.original) * 100) : 0;
    
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...formData, off } : p));
    } else {
      setProducts([{ ...formData, id: Math.random().toString(), off }, ...products]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a2236]">Quản lý sản phẩm</h2>
        <button onClick={handleAdd} className="px-4 py-2 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors text-sm flex items-center gap-2 shadow-md shadow-blue-500/20">
          <span className="text-lg leading-none mb-0.5">+</span> Thêm sản phẩm mới
        </button>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-[#6b7a99] border-b border-[#e2eaf6]">
                <th className="pb-3 font-medium">Sản phẩm</th>
                <th className="pb-3 font-medium">Danh mục</th>
                <th className="pb-3 font-medium">Giá bán</th>
                <th className="pb-3 font-medium">Tồn kho</th>
                <th className="pb-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-[#1a2236]">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-[#6b7a99]">Chưa có sản phẩm nào.</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="border-b border-[#e2eaf6]/50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 flex items-center gap-3 min-w-[250px]">
                    <div className="w-12 h-12 bg-[#f0f5fc] rounded-lg overflow-hidden flex items-center justify-center p-1.5 shrink-0 border border-[#e2eaf6]">
                      <img src={p.img || 'https://via.placeholder.com/150'} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-[#1a2236] whitespace-normal line-clamp-2">{p.name}</span>
                  </td>
                  <td className="py-4 text-[#6b7a99]">{p.category}</td>
                  <td className="py-4 font-bold text-[#1a6fdb]">{fmt(Number(p.price))}</td>
                  <td className="py-4">
                    <span className={\`px-2.5 py-1 rounded-lg text-xs font-semibold border \${p.stock < 10 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'}\`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => handleEdit(p)} className="text-[#1a6fdb] hover:underline font-medium">Sửa</button>
                      <span className="text-[#e2eaf6]">|</span>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline font-medium">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa Sản phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[#1a2236] mb-6">{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1a2236] mb-1">Tên sản phẩm</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="VD: iPhone 15 Pro Max..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Danh mục</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb] bg-white">
                    {["Điện thoại", "Laptop", "Máy tính bảng", "Âm thanh", "Đồng hồ thông minh", "Phụ kiện", "Camera", "Màn hình"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Tồn kho</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Giá bán (VNĐ)</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Giá gốc (VNĐ)</label>
                  <input required type="number" min="0" value={formData.original} onChange={e => setFormData({...formData, original: Number(e.target.value)})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2236] mb-1">Đường dẫn hình ảnh (URL)</label>
                <input required type="url" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="https://..." />
              </div>
              
              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-[#e2eaf6]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-[#6b7a99] font-medium hover:bg-[#f0f5fc] rounded-xl transition-colors">
                  Hủy bỏ
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors">
                  {editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCustomers()`;

content = content.replace(oldAdminProductsRegex, newAdminProducts);
fs.writeFileSync('src/App.tsx', content);
