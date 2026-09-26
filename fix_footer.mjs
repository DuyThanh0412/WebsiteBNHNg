import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace footer links with Link component
const footerCategoryLinks = `{["Điện thoại", "Laptop", "Máy tính bảng", "Âm thanh", "Đồng hồ thông minh", "Phụ kiện", "Camera", "Màn hình"].map(l => {
              const slug = l.toLowerCase().replace(/ /g, '-');
              return (
                <li key={l}><Link to={\`/category/\${slug}\`} className="hover:opacity-100 hover:underline transition-opacity">› {l}</Link></li>
              );
            })}`;

const footerServiceLinks = `{["Về chúng tôi", "Điều khoản & Điều kiện", "FAQ", "Chính sách bảo mật", "Chính sách đổi trả", "Chính sách hủy đơn"].map(l => {
              const slug = l.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
              return (
                <li key={l}><Link to={\`/page/\${slug}\`} className="hover:opacity-100 hover:underline transition-opacity">› {l}</Link></li>
              );
            })}`;

content = content.replace(
  /\{\["Điện thoại", "Laptop", "Máy tính bảng", "Âm thanh", "Đồng hồ thông minh", "Phụ kiện", "Camera", "Màn hình"\].map\(l => \(\s*<li key=\{l\}><button className="hover:opacity-100 hover:underline transition-opacity">› \{l\}<\/button><\/li>\s*\)\)\}/,
  footerCategoryLinks
);

content = content.replace(
  /\{\["Về chúng tôi", "Điều khoản & Điều kiện", "FAQ", "Chính sách bảo mật", "Chính sách đổi trả", "Chính sách hủy đơn"\].map\(l => \(\s*<li key=\{l\}><button className="hover:opacity-100 hover:underline transition-opacity">› \{l\}<\/button><\/li>\s*\)\)\}/,
  footerServiceLinks
);

// Add standard Page template
const genericPage = `
function GenericPage() {
  const { id } = useParams();
  const title = id 
    ? decodeURIComponent(id).replace(/-/g, " ").replace(/(^\\w|[\\s]\\S)/g, l => l.toUpperCase()) 
    : "Trang";

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-[60vh]">
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-[#e2eaf6] shadow-sm max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a2236] mb-6">{title}</h1>
        <div className="space-y-4 text-[#6b7a99] leading-relaxed">
          <p>Chào mừng bạn đến với trang <strong>{title}</strong>. Nội dung của trang này hiện đang được cập nhật.</p>
          <p>Chúng tôi đang nỗ lực hoàn thiện các thông tin và chính sách để mang đến cho bạn trải nghiệm mua sắm tốt nhất tại MegaMart. Mọi thắc mắc xin vui lòng liên hệ bộ phận hỗ trợ khách hàng qua Hotline hoặc WhatsApp.</p>
          <p>Xin cảm ơn sự đồng hành và tin tưởng của bạn!</p>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(/function RootLayout\(\) \{/, genericPage + '\\nfunction RootLayout() {');

// Add to router
content = content.replace(
  /\{ path: "category\/:id", Component: CategoryPage \},/,
  `{ path: "category/:id", Component: CategoryPage },
      { path: "page/:id", Component: GenericPage },`
);

fs.writeFileSync('src/App.tsx', content);
