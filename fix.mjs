import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Notice that the exported App component is still the old one!
// Our previous replacement failed because of regex boundaries.

content = content.replace(
  /\/\/ ─── App ───[\s\S]*$/,
`// ─── App ─────────────────────────────────────────────────────────────────────

function LoginPage() {
  return (
    <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-2xl border border-[#e2eaf6] shadow-sm">
      <h1 className="text-2xl font-bold text-center text-[#1a2236] mb-6">Đăng nhập khách hàng</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-[#1a2236] mb-1">Email / Số điện thoại</label>
          <input type="text" className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="Nhập email hoặc SĐT..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a2236] mb-1">Mật khẩu</label>
          <input type="password" className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="Nhập mật khẩu..." />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-[#e2eaf6]" />
            <span className="text-[#1a2236]">Ghi nhớ đăng nhập</span>
          </label>
          <button type="button" className="text-[#1a6fdb] hover:underline font-medium">Quên mật khẩu?</button>
        </div>
        <button type="submit" className="w-full py-3 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors mt-2">Đăng nhập</button>
      </form>
      <p className="text-center text-sm text-[#6b7a99] mt-6">
        Chưa có tài khoản? <button className="text-[#1a6fdb] hover:underline font-bold">Đăng ký ngay</button>
      </p>
    </div>
  );
}

function CategoryPage() {
  const { id } = useParams();
  const title = id ? id.replace(/-/g, " ").replace(/\\b\\w/g, l => l.toUpperCase()) : "Danh mục";
  const { onAddToCart } = useOutletContext<{ onAddToCart: () => void }>();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold text-[#1a2236] mb-6">Danh mục: {title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {smartphones.map((p, i) => (
          <ProductCard key={i} product={p} onAdd={onAddToCart} />
        ))}
        {smartphones.map((p, i) => (
          <ProductCard key={\`dup-\${i}\`} product={p} onAdd={onAddToCart} />
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const { onAddToCart } = useOutletContext<{ onAddToCart: () => void }>();
  return (
    <>
      <HeroBanner />
      <SmartphonesSection onAddToCart={onAddToCart} />
      <TopCategories />
      <BrandsSection />
      <AccessoriesSection />
    </>
  );
}

function RootLayout() {
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f5fc] flex flex-col">
      <AnnouncementBar />
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <CategoryNav />
      <div className="flex-1">
        <Outlet context={{ onAddToCart: () => setCartCount(c => c + 1) }} />
      </div>
      <Footer />
      {cartOpen && <CartDrawer count={cartCount} onClose={() => setCartOpen(false)} />}
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "category/:id", Component: CategoryPage },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
`
);

fs.writeFileSync('src/App.tsx', content);
