import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add order ID and total to CheckoutPage
content = content.replace(
  /const total = cartItems\.reduce\(\(acc, item\) => acc \+ item\.price \* item\.qty, 0\);\n\s*const shipping = total > 0 \? 30000 : 0;/,
  `const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = total > 0 ? 30000 : 0;
  const finalTotal = total + shipping;
  const [orderId] = useState(() => "BBM" + Math.floor(Math.random() * 1000000));
  
  // Cấu hình SePay (Thay đổi thành tài khoản thật khi triển khai)
  const sepayBank = "MBBank"; 
  const sepayAcc = "0123456789"; 
  const sepayTemplate = "compact";
  const qrUrl = \`https://qr.sepay.vn/img?bank=\${sepayBank}&acc=\${sepayAcc}&amount=\${finalTotal}&des=\${orderId}&template=\${sepayTemplate}\`;`
);

// 2. Exact match string replace for QR section
const oldQrBlock = `{paymentMethod === 'qr' && (
                <div className="p-4 border border-[#e2eaf6] rounded-xl bg-white flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
                  <p className="text-sm font-semibold text-[#1a2236] mb-3">Quét mã QR để thanh toán</p>
                  <div className="w-48 h-48 bg-white border-2 border-[#1a6fdb] rounded-xl p-2 mb-3">
                    {/* Placeholder cho mã QR */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs text-[#6b7a99] text-center">Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã.<br/>Đơn hàng sẽ tự động xác nhận sau khi thanh toán thành công.</p>
                </div>
              )}`;

const newQrBlock = `{paymentMethod === 'qr' && (
                <div className="p-4 border border-[#e2eaf6] rounded-xl bg-white flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
                  <p className="text-sm font-semibold text-[#1a2236] mb-3">Quét mã VietQR để thanh toán (Tích hợp SePay)</p>
                  <div className="w-64 h-64 bg-white border-2 border-[#1a6fdb] rounded-xl overflow-hidden mb-3 shadow-sm">
                    <img src={qrUrl} alt="SePay QR Code" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-[#f0f5fc] p-4 rounded-xl w-full text-sm space-y-2 mb-3 border border-[#e2eaf6]">
                    <div className="flex justify-between border-b border-[#e2eaf6] pb-2"><span className="text-[#6b7a99]">Ngân hàng:</span><span className="font-bold text-[#1a2236]">{sepayBank}</span></div>
                    <div className="flex justify-between border-b border-[#e2eaf6] pb-2"><span className="text-[#6b7a99]">Số tài khoản:</span><span className="font-bold text-[#1a2236]">{sepayAcc}</span></div>
                    <div className="flex justify-between border-b border-[#e2eaf6] pb-2"><span className="text-[#6b7a99]">Số tiền:</span><span className="font-bold text-[#1a6fdb]">{fmt(finalTotal)}</span></div>
                    <div className="flex justify-between"><span className="text-[#6b7a99]">Nội dung CK:</span><span className="font-bold text-emerald-600">{orderId}</span></div>
                  </div>
                  <p className="text-xs text-[#6b7a99] text-center px-4">Sử dụng ứng dụng ngân hàng để quét mã.<br/>Hệ thống SePay sẽ tự động xác nhận thanh toán khi nhận được tiền (Auto đối soát).</p>
                </div>
              )}`;

content = content.replace(oldQrBlock, newQrBlock);

fs.writeFileSync('src/App.tsx', content);
