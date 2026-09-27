import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Thêm Alert / Toast component thay vì dùng window.alert
const toastComponent = `
// ─── Custom Toast ────────────────────────────────────────────────────────────

function Toast({ message, isError, onClose }: { message: string, isError?: boolean, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={\`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border \${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-[#1a2236] border-[#1a2236] text-white'}\`}>
        <span className="text-xl">{isError ? '⚠️' : '🔔'}</span>
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}

// ─── Components ─────────────────────────────────────────────────────────────
`;

content = content.replace(/\/\/ ─── Components ─────────────────────────────────────────────────────────────/, toastComponent);


// 1. RootLayout - Dùng Custom Toast
const rootLayoutState = `const [cartOpen, setCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{text: string, isError: boolean} | null>(null);

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToastMsg({text: "Đăng nhập thành công!", isError: false});
  };`;
  
content = content.replace(/const \[cartOpen, setCartOpen\] = useState\(false\);\s*const handleLogin = \(userData: any\) => \{\s*setIsLoggedIn\(true\);\s*setUser\(userData\);\s*\};/, rootLayoutState);

const rootLayoutAddToCart = `const handleAddToCart = (product: typeof smartphones[0]) => {
    if (!isLoggedIn) {
      setToastMsg({text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", isError: true});
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    setCartItems(prev => {`;
    
content = content.replace(/const handleAddToCart = \(product: typeof smartphones\[0\]\) => \{\s*if \(!isLoggedIn\) \{\s*alert\("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!"\);\s*navigate\("\/login"\);\s*return;\s*\}\s*setCartItems\(prev => \{/, rootLayoutAddToCart);

// Provide setToastMsg in context for LoginPage
content = content.replace(
  /<Outlet context=\{\{ onAddToCart: handleAddToCart, cartItems, clearCart: \(\) => setCartItems\(\[\]\), login: handleLogin \}\} \/>/,
  '<Outlet context={{ onAddToCart: handleAddToCart, cartItems, clearCart: () => setCartItems([]), login: handleLogin, showToast: (text: string, isError = false) => setToastMsg({text, isError}) }} />'
);

// Include Toast rendering in RootLayout return
content = content.replace(
  /\{cartOpen && <CartDrawer items=\{cartItems\} onUpdateQty=\{handleUpdateQty\} onClose=\{\(\) => setCartOpen\(false\)\} \/>\}/,
  `{cartOpen && <CartDrawer items={cartItems} onUpdateQty={handleUpdateQty} onClose={() => setCartOpen(false)} />}
      {toastMsg && <Toast message={toastMsg.text} isError={toastMsg.isError} onClose={() => setToastMsg(null)} />}`
);


// 2. LoginPage - Dùng Custom Toast 
const loginPageLogic = `function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, showToast } = useOutletContext<any>();
  
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
      if (showToast) showToast("Vui lòng nhập đầy đủ tài khoản và mật khẩu!", true);
    }
  };`;

content = content.replace(/function LoginPage\(\) \{[\s\S]*?const handleLogin = \(e: any\) => \{[\s\S]*?alert\("Vui lòng nhập tài khoản và mật khẩu!"\);\s*\}\s*\};/, loginPageLogic);


fs.writeFileSync('src/App.tsx', content);
