import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Change ProductCard to pass product
content = content.replace(
  /function ProductCard\(\{ product, onAdd \}: \{ product: typeof smartphones\[0\]; onAdd: \(\) => void \}\) \{/g,
  'function ProductCard({ product, onAdd }: { product: typeof smartphones[0]; onAdd: (product: typeof smartphones[0]) => void }) {'
);

content = content.replace(
  /onAdd\(\);/g,
  'onAdd(product);'
);

// 2. Change SmartphonesSection
content = content.replace(
  /function SmartphonesSection\(\{ onAddToCart \}: \{ onAddToCart: \(\) => void \}\) \{/g,
  'function SmartphonesSection({ onAddToCart }: { onAddToCart: (product: typeof smartphones[0]) => void }) {'
);

// 3. Update CategoryPage Context usage
content = content.replace(
  /const \{ onAddToCart \} = useOutletContext<\{ onAddToCart: \(\) => void \}>\(\);/g,
  'const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void }>();'
);
content = content.replace(
  /<Outlet context=\{\{ onAddToCart: \(\) => setCartCount\(c => c \+ 1\) \}\} \/>/g,
  '<Outlet context={{ onAddToCart: handleAddToCart }} />'
);


// 4. Update RootLayout state
content = content.replace(
  /const \[cartCount, setCartCount\] = useState\(0\);/g,
  `const [cartItems, setCartItems] = useState<(typeof smartphones[0] & { qty: number })[]>([]);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  const handleAddToCart = (product: typeof smartphones[0]) => {
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
  `
);

// 5. Replace {cartOpen && <CartDrawer count={cartCount} onClose={() => setCartOpen(false)} />}
content = content.replace(
  /\{cartOpen && <CartDrawer count=\{cartCount\} onClose=\{\(\) => setCartOpen\(false\)\} \/>\}/g,
  `{cartOpen && <CartDrawer items={cartItems} onUpdateQty={handleUpdateQty} onClose={() => setCartOpen(false)} />}`
);

// 6. Rewrite CartDrawer
const newCartDrawer = `function CartDrawer({ items, onUpdateQty, onClose }: { items: (typeof smartphones[0] & { qty: number })[]; onUpdateQty: (name: string, delta: number) => void; onClose: () => void }) {
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const count = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-80 sm:w-96 bg-white flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#e2eaf6]">
          <h2 className="font-bold text-[#1a2236]">Giỏ hàng của bạn ({count})</h2>
          <button onClick={onClose} className="text-[#6b7a99] hover:text-[#1a2236] transition-colors">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 mt-10">
              <div className="w-16 h-16 bg-[#f0f5fc] rounded-full flex items-center justify-center text-2xl mb-4">🛒</div>
              <p className="font-semibold text-[#1a2236]">Giỏ hàng trống</p>
              <p className="text-sm text-[#6b7a99]">Hãy thêm sản phẩm vào giỏ nhé!</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.name} className="flex gap-3 border-b border-[#e2eaf6] pb-4">
                <div className="w-16 h-16 bg-[#f0f5fc] rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1a2236] line-clamp-2">{item.name}</p>
                    <p className="text-sm font-bold text-[#1a6fdb]">{fmt(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-[#e2eaf6] rounded-lg">
                      <button onClick={() => onUpdateQty(item.name, -1)} className="w-7 h-7 flex items-center justify-center text-[#6b7a99] hover:bg-[#f0f5fc] hover:text-[#1a6fdb] rounded-l-lg">-</button>
                      <span className="w-6 text-center text-xs font-semibold">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.name, 1)} className="w-7 h-7 flex items-center justify-center text-[#6b7a99] hover:bg-[#f0f5fc] hover:text-[#1a6fdb] rounded-r-lg">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[#e2eaf6] bg-[#f8fafc]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#6b7a99]">Tổng cộng:</span>
              <span className="text-lg font-bold text-[#1a6fdb]">{fmt(total)}</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors"
            >
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </div>
    </div>
  );
}`;

content = content.replace(/function CartDrawer\(\{ count, onClose \}: \{ count: number; onClose: \(\) => void \}\) \{[\s\S]*?\n\}\n/g, newCartDrawer + '\n');

fs.writeFileSync('src/App.tsx', content);
