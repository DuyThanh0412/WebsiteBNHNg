import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. RootLayout - add auth state and restrict cart
const newRootLayout = `function RootLayout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  const [cartItems, setCartItems] = useState<(typeof smartphones[0] & { qty: number })[]>([]);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  const handleAddToCart = (product: typeof smartphones[0]) => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(item => item.name === product.name);
      if (existing) {
        return prev.map(item => item.name === product.name ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };
  
  const handleUpdateQty = (name: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.name === name) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(item => item.qty > 0));
  };
  
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCartItems([]); // Clear cart on logout
  };

  return (
    <div className="min-h-screen bg-[#f0f5fc] flex flex-col">
      <AnnouncementBar />
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <CategoryNav />
      <div className="flex-1">
        <Outlet context={{ onAddToCart: handleAddToCart, cartItems, clearCart: () => setCartItems([]), login: handleLogin }} />
      </div>
      <Footer />
      {cartOpen && <CartDrawer items={cartItems} onUpdateQty={handleUpdateQty} onClose={() => setCartOpen(false)} />}
    </div>
  );
}`;

content = content.replace(/function RootLayout\(\) \{[\s\S]*?<div className="flex-1">\s*<Outlet context=\{\{ onAddToCart: handleAddToCart, cartItems, clearCart: \(\) => setCartItems\(\[\]\) \}\} \/>\s*<\/div>\s*<Footer \/>\s*\{cartOpen && <CartDrawer items=\{cartItems\} onUpdateQty=\{handleUpdateQty\} onClose=\{\(\) => setCartOpen\(false\)\} \/>\}\s*<\/div>\s*\);\s*\}/, newRootLayout);

// 2. Header - accept new props and show user info
const oldHeaderSig = 'function Header({ cartCount, onCartClick }: { cartCount: number; onCartClick: () => void }) {';
const newHeaderSig = 'function Header({ cartCount, onCartClick, isLoggedIn, user, onLogout }: { cartCount: number; onCartClick: () => void; isLoggedIn?: boolean; user?: any; onLogout?: () => void }) {';
content = content.replace(oldHeaderSig, newHeaderSig);

const oldHeaderLogin = `<Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f0f5fc] transition-colors text-sm font-medium text-[#1a2236]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Đăng nhập</span>
          </Link>`;

const newHeaderLogin = `{isLoggedIn && user ? (
            <div className="flex items-center gap-4 px-4">
              <span className="text-sm font-semibold text-[#1a2236] hidden sm:inline">Xin chào, {user.name}</span>
              <button onClick={onLogout} className="text-sm text-red-500 font-medium hover:underline">Đăng xuất</button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f0f5fc] transition-colors text-sm font-medium text-[#1a2236]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}`;

content = content.replace(oldHeaderLogin, newHeaderLogin);

// 3. LoginPage - trigger login function from context
const oldLoginPageLoginFn = `const handleLogin = (e) => {
    e.preventDefault();
    if ((email === "admin" || email === "admin@bigbangmart.com") && password === "123") {
      navigate("/admin");
    } else if (email && password) {
      // Giả lập đăng nhập khách hàng thành công
      navigate("/");
    } else {
      alert("Vui lòng nhập tài khoản và mật khẩu!");
    }
  };`;
  
const newLoginPageLoginFn = `const { login } = useOutletContext<any>();
  
  const handleLogin = (e: any) => {
    e.preventDefault();
    if ((email === "admin" || email === "admin@bigbangmart.com") && password === "123") {
      navigate("/admin");
    } else if (email && password) {
      // Giả lập đăng nhập khách hàng thành công
      const name = email.split('@')[0];
      if (login) login({ name: name, email });
      navigate("/");
    } else {
      alert("Vui lòng nhập tài khoản và mật khẩu!");
    }
  };`;

content = content.replace(oldLoginPageLoginFn, newLoginPageLoginFn);

fs.writeFileSync('src/App.tsx', content);
