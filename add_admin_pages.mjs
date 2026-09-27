import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add NavLink to react-router imports
if (!content.includes('NavLink')) {
  content = content.replace(
    /useSearchParams \} from "react-router";/,
    'useSearchParams, NavLink } from "react-router";'
  );
}

// 2. Update AdminLayout sidebar
const oldSidebar = `<nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 bg-[#1a6fdb] text-white rounded-xl text-sm font-medium">
            <span>📊</span> Tổng quan
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[#6b7a99] hover:bg-[#f0f5fc] rounded-xl text-sm font-medium transition-colors">
            <span>📦</span> Đơn hàng
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[#6b7a99] hover:bg-[#f0f5fc] rounded-xl text-sm font-medium transition-colors">
            <span>📱</span> Sản phẩm
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[#6b7a99] hover:bg-[#f0f5fc] rounded-xl text-sm font-medium transition-colors">
            <span>👥</span> Khách hàng
          </button>
        </nav>`;

const newSidebar = `<nav className="flex-1 p-4 space-y-2">
          <NavLink end to="/admin" className={({isActive}) => \`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors \${isActive ? 'bg-[#1a6fdb] text-white shadow-md shadow-blue-500/20' : 'text-[#6b7a99] hover:bg-[#f0f5fc]'}\`}>
            <span>📊</span> Tổng quan
          </NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => \`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors \${isActive ? 'bg-[#1a6fdb] text-white shadow-md shadow-blue-500/20' : 'text-[#6b7a99] hover:bg-[#f0f5fc]'}\`}>
            <span>📦</span> Đơn hàng
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => \`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors \${isActive ? 'bg-[#1a6fdb] text-white shadow-md shadow-blue-500/20' : 'text-[#6b7a99] hover:bg-[#f0f5fc]'}\`}>
            <span>📱</span> Sản phẩm
          </NavLink>
          <NavLink to="/admin/customers" className={({isActive}) => \`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors \${isActive ? 'bg-[#1a6fdb] text-white shadow-md shadow-blue-500/20' : 'text-[#6b7a99] hover:bg-[#f0f5fc]'}\`}>
            <span>👥</span> Khách hàng
          </NavLink>
        </nav>`;

content = content.replace(oldSidebar, newSidebar);

// 3. Add the Admin pages components right before RootLayout
const adminPages = `
function AdminOrders() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a2236]">Quản lý đơn hàng</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Tìm mã ĐH, khách hàng..." className="px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb] text-sm" />
          <button className="px-4 py-2 bg-[#f0f5fc] text-[#1a6fdb] font-semibold rounded-xl hover:bg-blue-100 transition-colors text-sm">Lọc</button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-[#6b7a99] border-b border-[#e2eaf6]">
                <th className="pb-3 font-medium">Mã ĐH</th>
                <th className="pb-3 font-medium">Ngày đặt</th>
                <th className="pb-3 font-medium">Khách hàng</th>
                <th className="pb-3 font-medium">Tổng tiền</th>
                <th className="pb-3 font-medium">Trạng thái</th>
                <th className="pb-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-[#1a2236]">
              {[
                { id: "#BBM-001", date: "26/09/2026 14:30", user: "Nguyễn Văn A", total: 32999000, status: "Đã giao", color: "emerald" },
                { id: "#BBM-002", date: "25/09/2026 09:15", user: "Trần Thị B", total: 2500000, status: "Đang xử lý", color: "blue" },
                { id: "#BBM-003", date: "24/09/2026 16:45", user: "Lê Văn C", total: 45000000, status: "Chờ thanh toán", color: "amber" },
                { id: "#BBM-004", date: "23/09/2026 10:00", user: "Phạm Thị D", total: 12500000, status: "Đã hủy", color: "red" },
                { id: "#BBM-005", date: "22/09/2026 20:20", user: "Hoàng Văn E", total: 8900000, status: "Đã giao", color: "emerald" },
              ].map((order, i) => (
                <tr key={i} className="border-b border-[#e2eaf6]/50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 font-bold">{order.id}</td>
                  <td className="py-4 text-[#6b7a99]">{order.date}</td>
                  <td className="py-4">{order.user}</td>
                  <td className="py-4 font-bold text-[#1a6fdb]">{fmt(order.total)}</td>
                  <td className="py-4"><span className={\`px-2.5 py-1 bg-\${order.color}-100 text-\${order.color}-700 rounded-lg text-xs font-semibold\`}>{order.status}</span></td>
                  <td className="py-4"><button className="text-[#1a6fdb] hover:underline font-medium">Chi tiết</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminProducts() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a2236]">Quản lý sản phẩm</h2>
        <button className="px-4 py-2 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors text-sm flex items-center gap-2 shadow-md shadow-blue-500/20">
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
                <th className="pb-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-[#1a2236]">
              {smartphones.slice(0, 3).concat(laptops.slice(0, 2)).map((p, i) => (
                <tr key={i} className="border-b border-[#e2eaf6]/50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 flex items-center gap-3 min-w-[250px]">
                    <div className="w-12 h-12 bg-[#f0f5fc] rounded-lg overflow-hidden flex items-center justify-center p-1.5 shrink-0 border border-[#e2eaf6]">
                      <img src={p.img} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-[#1a2236] whitespace-normal line-clamp-2">{p.name}</span>
                  </td>
                  <td className="py-4 text-[#6b7a99]">{p.price > 20000000 ? "Laptop" : "Điện thoại"}</td>
                  <td className="py-4 font-bold text-[#1a6fdb]">{fmt(p.price)}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
                      {Math.floor(Math.random() * 50) + 5}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <button className="text-[#1a6fdb] hover:underline font-medium">Sửa</button>
                      <span className="text-[#e2eaf6]">|</span>
                      <button className="text-red-500 hover:underline font-medium">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminCustomers() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a2236]">Quản lý khách hàng</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Tìm theo tên, email, sđt..." className="px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb] text-sm w-64" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-[#6b7a99] border-b border-[#e2eaf6]">
                <th className="pb-3 font-medium">Khách hàng</th>
                <th className="pb-3 font-medium">Email / SĐT</th>
                <th className="pb-3 font-medium">Tổng chi tiêu</th>
                <th className="pb-3 font-medium">Hạng thành viên</th>
                <th className="pb-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-[#1a2236]">
              {[
                { name: "Nguyễn Văn A", contact: "nguyenvana@gmail.com", spent: 45000000, rank: "VIP", status: "Hoạt động" },
                { name: "Trần Thị B", contact: "0912345678", spent: 12500000, rank: "Thường", status: "Hoạt động" },
                { name: "Lê Văn C", contact: "levanc@example.com", spent: 89000000, rank: "VVIP", status: "Hoạt động" },
                { name: "Phạm Thị D", contact: "0987654321", spent: 0, rank: "Mới", status: "Khóa" },
              ].map((user, i) => (
                <tr key={i} className="border-b border-[#e2eaf6]/50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 font-semibold flex items-center gap-3">
                     <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a6fdb] to-[#1558b0] text-white flex items-center justify-center font-bold shadow-sm">{user.name.charAt(0)}</div>
                     {user.name}
                  </td>
                  <td className="py-4 text-[#6b7a99]">{user.contact}</td>
                  <td className="py-4 font-bold text-[#1a6fdb]">{fmt(user.spent)}</td>
                  <td className="py-4">
                    <span className={\`px-2.5 py-1 rounded-lg text-xs font-bold \${user.rank === 'VVIP' ? 'bg-purple-100 text-purple-700' : user.rank === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}\`}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={\`flex items-center gap-1.5 \${user.status === 'Khóa' ? 'text-red-500' : 'text-emerald-500'}\`}>
                      <span className={\`w-2 h-2 rounded-full \${user.status === 'Khóa' ? 'bg-red-500' : 'bg-emerald-500'}\`}></span>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(/function RootLayout\(\) \{/, adminPages + '\nfunction RootLayout() {');

// 4. Update the Router to include the new routes
const oldAdminRoutes = `{
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
    ],
  }`;
  
const newAdminRoutes = `{
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "orders", Component: AdminOrders },
      { path: "products", Component: AdminProducts },
      { path: "customers", Component: AdminCustomers },
    ],
  }`;

content = content.replace(oldAdminRoutes, newAdminRoutes);

fs.writeFileSync('src/App.tsx', content);
