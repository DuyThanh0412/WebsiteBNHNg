import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add paymentMethod state
content = content.replace(
  /const \[isSuccess, setIsSuccess\] = useState\(false\);/,
  'const [isSuccess, setIsSuccess] = useState(false);\n  const [paymentMethod, setPaymentMethod] = useState("cod");'
);

// Replace payment section
const newPaymentSection = `<h2 className="text-lg font-bold text-[#1a2236] mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label className={\`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors \${paymentMethod === 'cod' ? 'border-[#1a6fdb] bg-[#f0f5fc]' : 'border-[#e2eaf6] hover:bg-gray-50'}\`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-[#1a6fdb]" />
                <span className="font-medium text-[#1a2236]">Thanh toán khi nhận hàng (COD)</span>
              </label>
              
              <label className={\`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors \${paymentMethod === 'qr' ? 'border-[#1a6fdb] bg-[#f0f5fc]' : 'border-[#e2eaf6] hover:bg-gray-50'}\`}>
                <input type="radio" name="payment" value="qr" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} className="w-4 h-4 text-[#1a6fdb]" />
                <span className="font-medium text-[#1a2236]">Thanh toán qua mã QR (Momo, VNPay, ZaloPay)</span>
              </label>
              {paymentMethod === 'qr' && (
                <div className="p-4 border border-[#e2eaf6] rounded-xl bg-white flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
                  <p className="text-sm font-semibold text-[#1a2236] mb-3">Quét mã QR để thanh toán</p>
                  <div className="w-48 h-48 bg-white border-2 border-[#1a6fdb] rounded-xl p-2 mb-3">
                    {/* Placeholder cho mã QR */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs text-[#6b7a99] text-center">Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã.<br/>Đơn hàng sẽ tự động xác nhận sau khi thanh toán thành công.</p>
                </div>
              )}

              <label className={\`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors \${paymentMethod === 'card' ? 'border-[#1a6fdb] bg-[#f0f5fc]' : 'border-[#e2eaf6] hover:bg-gray-50'}\`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-[#1a6fdb]" />
                <span className="font-medium text-[#1a2236]">Thẻ Tín dụng / Ghi nợ</span>
              </label>
              {paymentMethod === 'card' && (
                <div className="p-4 border border-[#e2eaf6] rounded-xl bg-white space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-xs font-medium text-[#6b7a99] mb-1">Số thẻ</label>
                    <input required type="text" className="w-full px-4 py-2 text-sm border border-[#e2eaf6] rounded-lg outline-none focus:border-[#1a6fdb]" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#6b7a99] mb-1">Ngày hết hạn</label>
                      <input required type="text" className="w-full px-4 py-2 text-sm border border-[#e2eaf6] rounded-lg outline-none focus:border-[#1a6fdb]" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6b7a99] mb-1">Mã CVV</label>
                      <input required type="password" maxLength={3} className="w-full px-4 py-2 text-sm border border-[#e2eaf6] rounded-lg outline-none focus:border-[#1a6fdb]" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b7a99] mb-1">Tên chủ thẻ</label>
                    <input required type="text" className="w-full px-4 py-2 text-sm border border-[#e2eaf6] rounded-lg outline-none focus:border-[#1a6fdb]" placeholder="NGUYEN VAN A" />
                  </div>
                </div>
              )}
            </div>`;

content = content.replace(
  /<h2 className="text-lg font-bold text-\[#1a2236\] mb-4">Phương thức thanh toán<\/h2>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Order Summary \*\/\}/,
  newPaymentSection + '\n          </div>\n        </div>\n\n        {/* Order Summary */}'
);

fs.writeFileSync('src/App.tsx', content);
