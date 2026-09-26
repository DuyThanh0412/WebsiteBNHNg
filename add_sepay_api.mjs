import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add useEffect to imports
content = content.replace(
  'import { useState } from "react";',
  'import { useState, useEffect } from "react";'
);

// 2. Add SePay logic
const oldSepayConfig = 'const qrUrl = `https://qr.sepay.vn/img?bank=${sepayBank}&acc=${sepayAcc}&amount=${finalTotal}&des=${orderId}&template=${sepayTemplate}`;';

const newSepayLogic = `const qrUrl = \`https://qr.sepay.vn/img?bank=\${sepayBank}&acc=\${sepayAcc}&amount=\${finalTotal}&des=\${orderId}&template=\${sepayTemplate}\`;

  const API_TOKEN = "SG832BCLRMSG6D7LU4HFEKQCV0HLIHWYHQPXFA0JBEUYP6LCZXOVIATFNO8MCJQA";
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const verifySePayTransaction = async () => {
    setIsVerifying(true);
    setPaymentError("");
    try {
      const res = await fetch("https://my.sepay.vn/userapi/transactions/list", {
        headers: {
          "Authorization": \`Bearer \${API_TOKEN}\`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      
      if (data && data.transactions) {
        // Tìm giao dịch có nội dung chứa mã đơn hàng (không phân biệt hoa thường) và số tiền khớp
        const found = data.transactions.find((t: any) => 
          t.transaction_content.toLowerCase().includes(orderId.toLowerCase()) && 
          parseInt(t.amount_in) >= finalTotal
        );
        
        if (found) {
          setIsSuccess(true);
          clearCart();
        } else {
          setPaymentError("Chưa tìm thấy giao dịch. Vui lòng thử lại sau ít phút nếu bạn vừa chuyển khoản.");
        }
      } else {
        setPaymentError("Không thể kết nối đến máy chủ SePay.");
      }
    } catch (err) {
       setPaymentError("Lỗi mạng khi kiểm tra thanh toán.");
    }
    setIsVerifying(false);
  };

  // Tự động kiểm tra (polling) mỗi 5 giây
  useEffect(() => {
    if (paymentMethod !== 'qr' || isSuccess) return;
    
    const interval = setInterval(() => {
      fetch("https://my.sepay.vn/userapi/transactions/list", {
        headers: {
          "Authorization": \`Bearer \${API_TOKEN}\`,
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(data => {
        if (data && data.transactions) {
          const found = data.transactions.find((t: any) => 
            t.transaction_content.toLowerCase().includes(orderId.toLowerCase()) && 
            parseInt(t.amount_in) >= finalTotal
          );
          if (found) {
            setIsSuccess(true);
            clearCart();
          }
        }
      }).catch(() => {});
    }, 5000);
    
    return () => clearInterval(interval);
  }, [paymentMethod, isSuccess, orderId, finalTotal, clearCart]);`;

content = content.replace(oldSepayConfig, newSepayLogic);

// 3. Update handleCheckout function
const oldHandleCheckout = `const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    clearCart();
  };`;

const newHandleCheckout = `const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'qr') {
      verifySePayTransaction();
    } else {
      setIsSuccess(true);
      clearCart();
    }
  };`;

content = content.replace(oldHandleCheckout, newHandleCheckout);

// 4. Update QR UI to include Verify button and error messages
const oldQrUi = `<p className="text-xs text-[#6b7a99] text-center px-4">Sử dụng ứng dụng ngân hàng để quét mã.<br/>Hệ thống SePay sẽ tự động xác nhận thanh toán khi nhận được tiền (Auto đối soát).</p>
                </div>`;

const newQrUi = `<p className="text-xs text-[#6b7a99] text-center px-4 mb-3">Sử dụng ứng dụng ngân hàng để quét mã.<br/>Hệ thống SePay sẽ tự động xác nhận thanh toán khi nhận được tiền (Auto đối soát).</p>
                  <button type="button" onClick={verifySePayTransaction} disabled={isVerifying} className="px-6 py-2.5 bg-[#f0f5fc] text-[#1a6fdb] font-semibold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                    {isVerifying ? (
                      <><span className="w-4 h-4 border-2 border-[#1a6fdb] border-t-transparent rounded-full animate-spin"></span> Đang kiểm tra...</>
                    ) : "Tôi đã chuyển khoản"}
                  </button>
                  {paymentError && <p className="text-xs text-red-500 text-center mt-3 bg-red-50 p-2 rounded-lg">{paymentError}</p>}
                </div>`;

content = content.replace(oldQrUi, newQrUi);

// 5. Update checkout submit button text based on payment method
const oldSubmitBtn = `<button type="submit" form="checkout-form" className="w-full mt-6 py-3 bg-[#1a6fdb] text-white font-bold rounded-xl hover:bg-[#1558b0] transition-colors shadow-md shadow-blue-500/20">
              Xác nhận Đặt hàng
            </button>`;

const newSubmitBtn = `<button type="submit" form="checkout-form" disabled={isVerifying && paymentMethod === 'qr'} className="w-full mt-6 py-3 bg-[#1a6fdb] text-white font-bold rounded-xl hover:bg-[#1558b0] transition-colors shadow-md shadow-blue-500/20 disabled:opacity-70">
              {paymentMethod === 'qr' ? 'Kiểm tra thanh toán & Đặt hàng' : 'Xác nhận Đặt hàng'}
            </button>`;

content = content.replace(oldSubmitBtn, newSubmitBtn);

fs.writeFileSync('src/App.tsx', content);
