import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update Outlet context in RootLayout
content = content.replace(
  /<Outlet context=\{\{ onAddToCart: handleAddToCart \}\} \/>/,
  '<Outlet context={{ onAddToCart: handleAddToCart, cartItems, clearCart: () => setCartItems([]) }} />'
);

// 2. Update CartDrawer checkout button to be a Link
content = content.replace(
  /<button\n\s*onClick=\{onClose\}\n\s*className="w-full py-3 bg-\[#1a6fdb\] text-white font-semibold rounded-xl hover:bg-\[#1558b0\] transition-colors"\n\s*>\n\s*Tiến hành thanh toán\n\s*<\/button>/,
  `<Link\n              to="/checkout"\n              onClick={onClose}\n              className="block text-center w-full py-3 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors"\n            >\n              Tiến hành thanh toán\n            </Link>`
);

// 3. Update CategoryPage Context usage (since we added to the outlet context)
content = content.replace(
  /const \{ onAddToCart \} = useOutletContext<\{ onAddToCart: \(product: typeof smartphones\[0\]\) => void \}>\(\);/g,
  'const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void, cartItems: any[], clearCart: () => void }>();'
);
content = content.replace(
  /const \{ onAddToCart \} = useOutletContext<\{ onAddToCart: \(\) => void \}>\(\);/g, // fallback if previous replace wasn't applied exactly
  'const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void, cartItems: any[], clearCart: () => void }>();'
);


// 4. Create CheckoutPage Component
const checkoutPage = `
function CheckoutPage() {
  const { cartItems, clearCart } = useOutletContext<{ cartItems: (typeof smartphones[0] & { qty: number })[], clearCart: () => void }>();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = total > 0 ? 30000 : 0;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
        <h1 className="text-3xl font-bold text-[#1a2236] mb-4">Đặt hàng thành công!</h1>
        <p className="text-[#6b7a99] mb-8">Cảm ơn bạn đã mua sắm tại BigBangMart. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.</p>
        <Link to="/" className="inline-block px-8 py-3 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-[#f0f5fc] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-[#1a2236] mb-4">Giỏ hàng trống</h1>
        <p className="text-[#6b7a99] mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng để thanh toán.</p>
        <Link to="/" className="inline-block px-8 py-3 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors">
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a2236] mb-8">Thanh toán đơn hàng</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm mb-6">
            <h2 className="text-lg font-bold text-[#1a2236] mb-4">Thông tin giao hàng</h2>
            <form id="checkout-form" className="space-y-4" onSubmit={handleCheckout}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Họ và tên</label>
                  <input required type="text" className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="VD: Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Số điện thoại</label>
                  <input required type="tel" className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="VD: 0912345678" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2236] mb-1">Địa chỉ nhận hàng</label>
                <input required type="text" className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, thành phố..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2236] mb-1">Ghi chú (Tùy chọn)</label>
                <textarea className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb] resize-none h-24" placeholder="Ghi chú về giao hàng..."></textarea>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm">
            <h2 className="text-lg font-bold text-[#1a2236] mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-[#1a6fdb] bg-[#f0f5fc] rounded-xl cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-[#1a6fdb]" />
                <span className="font-medium text-[#1a2236]">Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#e2eaf6] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="payment" className="w-4 h-4 text-[#1a6fdb]" />
                <span className="font-medium text-[#1a2236]">Chuyển khoản ngân hàng / VNPay</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#e2eaf6] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="payment" className="w-4 h-4 text-[#1a6fdb]" />
                <span className="font-medium text-[#1a2236]">Thẻ Tín dụng / Ghi nợ</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-[#1a2236] mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 bg-[#f0f5fc] rounded-lg overflow-hidden shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1a2236] line-clamp-1">{item.name}</p>
                    <p className="text-xs text-[#6b7a99] mt-1">SL: {item.qty}</p>
                    <p className="text-sm font-bold text-[#1a6fdb] mt-1">{fmt(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e2eaf6] pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-[#6b7a99]">
                <span>Tạm tính</span>
                <span className="font-medium text-[#1a2236]">{fmt(total)}</span>
              </div>
              <div className="flex justify-between text-[#6b7a99]">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-[#1a2236]">{fmt(shipping)}</span>
              </div>
              <div className="flex justify-between text-[#6b7a99] pb-4">
                <span>Giảm giá</span>
                <span className="font-medium text-emerald-600">- {fmt(0)}</span>
              </div>
              <div className="flex justify-between border-t border-[#e2eaf6] pt-4">
                <span className="font-bold text-[#1a2236] text-base">Tổng cộng</span>
                <span className="font-bold text-[#1a6fdb] text-xl">{fmt(total + shipping)}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" className="w-full mt-6 py-3 bg-[#1a6fdb] text-white font-bold rounded-xl hover:bg-[#1558b0] transition-colors shadow-md shadow-blue-500/20">
              Xác nhận Đặt hàng
            </button>
            <p className="text-xs text-center text-[#6b7a99] mt-4">
              Bằng việc đặt hàng, bạn đồng ý với Điều khoản và điều kiện của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(/function GenericPage\(\) \{/, checkoutPage + '\nfunction GenericPage() {');

// 5. Add route for checkout
content = content.replace(
  /\{ path: "category\/:id", Component: CategoryPage \},/,
  `{ path: "category/:id", Component: CategoryPage },\n      { path: "checkout", Component: CheckoutPage },`
);

fs.writeFileSync('src/App.tsx', content);
