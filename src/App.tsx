import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Link, useParams, useOutletContext, useNavigate, useLocation, useSearchParams, NavLink } from "react-router";

// ─── Data ───────────────────────────────────────────────────────────────────

const categories = [
  { label: "Điện thoại", icon: "📱" },
  { label: "Laptop", icon: "💻" },
  { label: "Máy tính bảng", icon: "📱" },
  { label: "Âm thanh", icon: "🎧" },
  { label: "Đồng hồ thông minh", icon: "⌚" },
  { label: "Phụ kiện", icon: "🔌" },
  { label: "Camera", icon: "📷" },
  { label: "Màn hình", icon: "🖥️" },
];

const banners = [
  {
    bg: "#0f1b3d",
    tag: "Best Deal Online on smart watches",
    title: "SMART WEARABLE.",
    sub: "Up to 80% OFF",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=280&fit=crop&auto=format",
    alt: "Smart watch", link: "/category/dong-ho-thong-minh"
  },
  {
    bg: "#1a3a1a",
    tag: "Latest smartphones at unbeatable prices",
    title: "FLAGSHIP PHONES.",
    sub: "Up to 60% OFF",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=280&fit=crop&auto=format",
    alt: "Smartphone", link: "/category/dien-thoai"
  },
  {
    bg: "#3a1a0f",
    tag: "Power up your workspace",
    title: "LAPTOPS & PCs.",
    sub: "Up to 40% OFF",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=280&fit=crop&auto=format",
    alt: "Laptop", link: "/category/laptop"
  },
];

const smartphones = [
  {
    name: "Galaxy S22 Ultra",
    price: 32999,
    original: 54000,
    off: 56,
    img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=240&fit=crop&auto=format",
  },
  {
    name: "Galaxy M13 (4GB | 64GB)",
    price: 10499,
    original: 14999,
    off: 30,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=240&fit=crop&auto=format",
  },
  {
    name: "Galaxy M33 (4GB | 64GB)",
    price: 16999,
    original: 24999,
    off: 32,
    img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=240&fit=crop&auto=format",
  },
  {
    name: "Galaxy M53 (4GB | 64GB)",
    price: 31999,
    original: 40999,
    off: 22,
    img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=240&fit=crop&auto=format",
  },
  {
    name: "Galaxy S22 Ultra 5G",
    price: 67999,
    original: 85999,
    off: 21,
    img: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=200&h=240&fit=crop&auto=format",
  },
];


const laptops = [
  { name: "MacBook Pro M2", price: 32000000, original: 35000000, off: 8, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=240&fit=crop&auto=format" },
  { name: "Dell XPS 13", price: 28000000, original: 30000000, off: 6, img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=240&fit=crop&auto=format" },
  { name: "Asus ROG Zephyrus", price: 35000000, original: 40000000, off: 12, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&h=240&fit=crop&auto=format" },
  { name: "ThinkPad X1 Carbon", price: 31000000, original: 34000000, off: 9, img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=240&fit=crop&auto=format" },
  { name: "Acer Swift 3", price: 24000000, original: 27000000, off: 11, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=240&fit=crop&auto=format" }
];

const tablets = [
  { name: "iPad Pro 11 inch", price: 22000000, original: 25000000, off: 12, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=240&fit=crop&auto=format" },
  { name: "Galaxy Tab S8", price: 16000000, original: 18000000, off: 11, img: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=200&h=240&fit=crop&auto=format" },
  { name: "iPad Air 5", price: 15000000, original: 17000000, off: 11, img: "https://images.unsplash.com/photo-1554672408-730436b60dde?w=200&h=240&fit=crop&auto=format" }
];

const audio = [
  { name: "AirPods Pro 2", price: 6000000, original: 7000000, off: 14, img: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=200&h=240&fit=crop&auto=format" },
  { name: "Sony WH-1000XM5", price: 7500000, original: 8500000, off: 11, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=240&fit=crop&auto=format" },
  { name: "JBL Flip 6", price: 2500000, original: 3000000, off: 16, img: "https://images.unsplash.com/photo-1572569433114-1e0f089606d2?w=200&h=240&fit=crop&auto=format" },
  { name: "Marshall Emberton", price: 3500000, original: 4000000, off: 12, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=240&fit=crop&auto=format" }
];

const smartwatches = [
  { name: "Apple Watch Series 8", price: 10000000, original: 12000000, off: 16, img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&h=240&fit=crop&auto=format" },
  { name: "Galaxy Watch 5", price: 6500000, original: 7500000, off: 13, img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&h=240&fit=crop&auto=format" },
  { name: "Garmin Fenix 7", price: 15000000, original: 17000000, off: 11, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=240&fit=crop&auto=format" },
];

const accessoriesData = [
  { name: "Tai nghe Bluetooth", price: 500000, original: 800000, off: 37, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=240&fit=crop&auto=format" },
  { name: "Cáp sạc Type-C", price: 150000, original: 250000, off: 40, img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&h=240&fit=crop&auto=format" },
  { name: "Ốp lưng chống sốc", price: 200000, original: 300000, off: 33, img: "https://images.unsplash.com/photo-1541560052-5e137f229371?w=200&h=240&fit=crop&auto=format" },
  { name: "Sạc dự phòng 10000mAh", price: 450000, original: 600000, off: 25, img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=240&fit=crop&auto=format" },
  { name: "Chuột không dây", price: 350000, original: 500000, off: 30, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=240&fit=crop&auto=format" },
  { name: "Bàn phím cơ", price: 950000, original: 1200000, off: 20, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=200&h=240&fit=crop&auto=format" },
];


const cameras = [
  { name: "Sony Alpha A7 IV", price: 55000000, original: 60000000, off: 8, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=240&fit=crop&auto=format" },
  { name: "Canon EOS R6", price: 62000000, original: 68000000, off: 9, img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=240&fit=crop&auto=format" },
  { name: "Fujifilm X-T4", price: 40000000, original: 45000000, off: 11, img: "https://images.unsplash.com/photo-1560264280-080f48ce3a56?w=200&h=240&fit=crop&auto=format" },
  { name: "GoPro Hero 11", price: 10500000, original: 12000000, off: 12, img: "https://images.unsplash.com/photo-1565526439243-7f2e15bc99ec?w=200&h=240&fit=crop&auto=format" }
];

const monitors = [
  { name: "Dell UltraSharp 27", price: 12500000, original: 14000000, off: 11, img: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=200&h=240&fit=crop&auto=format" },
  { name: "LG UltraGear 27", price: 8900000, original: 10000000, off: 11, img: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=200&h=240&fit=crop&auto=format" },
  { name: "Samsung Odyssey G5", price: 7500000, original: 8500000, off: 12, img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&h=240&fit=crop&auto=format" },
  { name: "Asus ProArt 27", price: 11000000, original: 12500000, off: 12, img: "https://images.unsplash.com/photo-1586952518485-11b180e92764?w=200&h=240&fit=crop&auto=format" }
];

const topCategories = [
  { label: "Điện thoại", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop&auto=format" },
  { label: "Laptop", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop&auto=format" },
  { label: "Âm thanh", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&auto=format" },
  { label: "Tablet", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop&auto=format" },
  { label: "Smartwatch", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&auto=format" },
  { label: "Camera", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop&auto=format" },
  { label: "Phụ kiện", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop&auto=format" },
];

const accessories = [
  { label: "Tai nghe Bluetooth", sub: "UP to 50% OFF", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=180&h=140&fit=crop&auto=format" },
  { label: "Cáp sạc", sub: "UP to 60% OFF", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=180&h=140&fit=crop&auto=format" },
  { label: "Ốp lưng", sub: "UP to 50% OFF", img: "https://images.unsplash.com/photo-1541560052-5e137f229371?w=180&h=140&fit=crop&auto=format" },
  { label: "Sạc dự phòng", sub: "UP to 50% OFF", img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=180&h=140&fit=crop&auto=format" },
  { label: "Chuột không dây", sub: "UP to 50% OFF", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=180&h=140&fit=crop&auto=format" },
  { label: "Bàn phím cơ", sub: "UP to 50% OFF", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=180&h=140&fit=crop&auto=format" },
];


const toSlug = (str: string) => {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};


const getProductSpecs = (name: string) => {
  const lower = name.toLowerCase();
  
  if (lower.includes("macbook") || lower.includes("xps") || lower.includes("zephyrus") || lower.includes("thinkpad") || lower.includes("swift")) {
    return [
      ["Màn hình", "13.3 - 16 inch, IPS / Liquid Retina XDR"],
      ["CPU", "Intel Core i5/i7/i9 hoặc Apple M-Series"],
      ["RAM", "8GB / 16GB / 32GB"],
      ["Ổ cứng", "SSD 256GB / 512GB / 1TB"],
      ["Card đồ họa", "Đồ họa tích hợp / NVIDIA RTX"],
      ["Hệ điều hành", "Windows 11 / macOS"],
      ["Cổng kết nối", "Thunderbolt 4, USB-C, HDMI"],
      ["Trọng lượng", "Khoảng 1.2kg - 2.0kg"],
    ];
  }
  
  if (lower.includes("ipad") || lower.includes("tab")) {
    return [
      ["Màn hình", "10.9 - 12.9 inch, Liquid Retina / AMOLED"],
      ["Hệ điều hành", "iPadOS / Android"],
      ["Chip xử lý", "Apple M1/M2 hoặc Snapdragon"],
      ["RAM", "8GB / 12GB"],
      ["Bộ nhớ trong", "128GB / 256GB / 512GB"],
      ["Camera sau", "12MP / 13MP"],
      ["Camera trước", "12MP Ultra Wide"],
      ["Pin", "7000 - 10000 mAh, Sạc nhanh 20W+"],
    ];
  }
  
  if (lower.includes("airpods") || lower.includes("wh-") || lower.includes("jbl") || lower.includes("marshall") || lower.includes("tai nghe")) {
    return [
      ["Loại thiết bị", "Tai nghe không dây / Loa Bluetooth"],
      ["Kết nối", "Bluetooth 5.0 - 5.3"],
      ["Thời lượng pin", "Lên đến 30 - 40 giờ"],
      ["Cổng sạc", "USB-C / Lightning"],
      ["Chống nước", "IPX4 - IP67"],
      ["Công nghệ âm thanh", "Chống ồn chủ động (ANC), Xuyên âm"],
      ["Trọng lượng", "Siêu nhẹ, thiết kế công thái học"],
      ["Micro", "Tích hợp đàm thoại rõ nét"],
    ];
  }
  
  if (lower.includes("watch") || lower.includes("fenix")) {
    return [
      ["Màn hình", "OLED / AMOLED, Kính cường lực / Sapphire"],
      ["Đường kính mặt", "40mm - 45mm"],
      ["Kết nối", "Bluetooth, Wi-Fi, GPS, Cellular"],
      ["Thời lượng pin", "1 - 14 ngày (tùy chế độ)"],
      ["Theo dõi sức khỏe", "Nhịp tim, SpO2, ECG, Giấc ngủ"],
      ["Chế độ thể thao", "Chạy bộ, bơi lội, đạp xe..."],
      ["Chống nước", "5 ATM - 10 ATM (50m - 100m)"],
      ["Chất liệu dây", "Silicone, Thép không gỉ, Da"],
    ];
  }
  
  if (lower.includes("alpha") || lower.includes("eos") || lower.includes("x-t4") || lower.includes("hero") || lower.includes("camera")) {
    return [
      ["Loại máy", "Mirrorless / Action Camera"],
      ["Cảm biến", "Full-Frame / APS-C"],
      ["Độ phân giải", "20.1MP - 33MP"],
      ["Quay video", "4K 60fps / 8K 30fps / 10-bit 4:2:2"],
      ["ISO", "100 - 51200 (Mở rộng 204800)"],
      ["Màn hình", "Cảm ứng xoay lật 3.0 inch"],
      ["Kết nối", "Wi-Fi, Bluetooth, USB-C, micro-HDMI"],
      ["Thẻ nhớ", "Khe cắm thẻ SD / CFexpress"],
    ];
  }
  
  if (lower.includes("ultrasharp") || lower.includes("ultragear") || lower.includes("odyssey") || lower.includes("proart")) {
    return [
      ["Kích thước", "27 inch - 32 inch"],
      ["Độ phân giải", "2K (2560x1440) / 4K (3840x2160)"],
      ["Tấm nền", "IPS / Nano IPS / VA"],
      ["Tần số quét", "60Hz / 144Hz / 165Hz"],
      ["Thời gian phản hồi", "1ms (GtG) - 5ms"],
      ["Độ phủ màu", "99% sRGB / 98% DCI-P3"],
      ["Công nghệ", "HDR10, FreeSync, G-Sync Compatible"],
      ["Cổng kết nối", "HDMI 2.1, DisplayPort 1.4, USB-C"],
    ];
  }
  
  if (lower.includes("chuột") || lower.includes("bàn phím") || lower.includes("cáp") || lower.includes("sạc") || lower.includes("ốp")) {
    return [
      ["Loại sản phẩm", "Phụ kiện thiết bị công nghệ"],
      ["Thương hiệu", "Chính hãng"],
      ["Chất liệu", "Nhựa ABS, Hợp kim nhôm, Cáp bọc dù..."],
      ["Tương thích", "Đa thiết bị (iOS, Android, Windows, Mac)"],
      ["Kết nối", "Không dây (Bluetooth, 2.4GHz) / Có dây"],
      ["Màu sắc", "Đen / Trắng / Bạc"],
      ["Bảo hành", "12 tháng chính hãng"],
      ["Tính năng", "Thiết kế cao cấp, an toàn, siêu bền"],
    ];
  }
  
  // Default (Phones)
  return [
    ["Màn hình", "Super Retina XDR / Dynamic AMOLED, 120Hz"],
    ["Hệ điều hành", "Phiên bản mới nhất (iOS / Android)"],
    ["Camera sau", "Chính 48MP/108MP & Phụ góc siêu rộng, Tele"],
    ["Camera trước", "12MP - 40MP, Quay video 4K"],
    ["Chip xử lý", "Apple A-series / Snapdragon thế hệ mới"],
    ["RAM", "8GB / 12GB / 16GB"],
    ["Bộ nhớ trong", "128GB / 256GB / 512GB / 1TB"],
    ["Pin & Sạc", "Sạc nhanh 25W - 45W, Hỗ trợ sạc không dây"],
  ];
};

const fmt = (n: number) => `₫${n.toLocaleString("vi-VN")}`;


// ─── Custom Toast ────────────────────────────────────────────────────────────

function Toast({ message, isError, onClose }: { message: string, isError?: boolean, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-[#1a2236] border-[#1a2236] text-white'}`}>
        <span className="text-xl">{isError ? '⚠️' : '🔔'}</span>
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}


function ProductCarousel({ title, products, icon, onAdd }: { title: string; products: any[]; icon: string; onAdd: (product: any) => void }) {
  return (
    <div className="py-12 border-b border-[#e2eaf6]">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-3xl font-bold text-[#1a2236] text-center mb-8 flex items-center justify-center gap-2">
          <span>{icon}</span> {title}
        </h2>
        
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 bg-black/10 text-[#1a2236] rounded-full flex items-center justify-center hover:bg-black/20:bg-black/60 transition-colors z-10 hidden md:flex">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex flex-col items-center hover:shadow-2xl transition-all cursor-pointer group relative hover:-translate-y-1 border border-[#e2eaf6]">
              <span className="absolute top-4 left-4 border border-[#f5a623] text-[#f5a623] text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                Mới
              </span>
              
              <Link to={`/product/${toSlug(product.name)}`} className="w-full aspect-square flex items-center justify-center mb-4 mt-2">
                <img src={product.img} alt={product.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl" />
              </Link>
              
              <div className="text-center w-full mt-auto">
                <Link to={`/product/${toSlug(product.name)}`} className="text-sm font-semibold text-[#1a2236] leading-snug hover:text-[#1a6fdb] line-clamp-2 mb-2">
                  {product.name}
                </Link>
                <div className="flex flex-col items-center gap-1 mb-3">
                  <span className="text-base font-bold text-[#1a2236]">{fmt(product.price)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 line-through">{fmt(product.original)}</span>
                    <span className="text-xs text-[#1a6fdb]">-{product.off}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">Hàng sắp về</p>
                <button
                  onClick={(e) => { e.preventDefault(); onAdd(product); }}
                  className="w-full py-2 text-xs font-bold text-[#1a6fdb] bg-[#f0f5fc] rounded-xl hover:bg-[#1a6fdb] hover:text-white transition-colors"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 bg-black/10 text-[#1a2236] rounded-full flex items-center justify-center hover:bg-black/20:bg-black/60 transition-colors z-10 hidden md:flex">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}


// ─── Components ─────────────────────────────────────────────────────────────


function AnnouncementBar() {
  return (
    <div className="bg-[#1a2236] text-white text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <span className="opacity-70">Chào mừng đến BigBangMart — Mua sắm toàn quốc!</span>
        <div className="flex items-center gap-5 opacity-80">
          <span className="flex items-center gap-1"><span>📍</span> Giao đến TP.HCM</span>
          <span className="flex items-center gap-1"><span>📦</span> Theo dõi đơn hàng</span>
          <span className="flex items-center gap-1"><span>🎁</span> Tất cả ưu đãi</span>
        </div>
      </div>
    </div>
  );
}

function Header({ cartCount, onCartClick, isLoggedIn, user, onLogout }: { cartCount: number; onCartClick: () => void; isLoggedIn?: boolean; user?: any; onLogout?: () => void }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-transparent shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[#1a6fdb] rounded-lg flex items-center justify-center text-white font-black text-sm">B</div>
          <span className="text-xl font-bold text-[#1a6fdb] tracking-tight">BigBangMart</span>
        </Link>

        {/* Search */}
        <div className="flex-1 flex items-center bg-[#f0f5fc] border border-[#e2eaf6] rounded-xl px-4 py-2.5 gap-3 max-w-2xl transition-colors">
          <svg className="w-4 h-4 text-[#6b7a99] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <form className="flex-1 flex items-center" onSubmit={(e) => { e.preventDefault(); if (search) navigate(`/search?q=${encodeURIComponent(search)}`); }}>
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6b7a99]"
              placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-[#6b7a99] hover:text-[#1a2236] transition-colors mr-2">✕</button>
            )}
            <button type="submit" className="hidden">Tìm kiếm</button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-4 px-4">
              <span className="text-sm font-semibold text-[#1a2236] hidden sm:inline">Xin chào, {user.name}</span>
              <button onClick={onLogout} className="text-sm text-red-500 font-medium hover:underline">Đăng xuất</button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f0f5fc]:bg-white/10 transition-colors text-sm font-medium text-[#1a2236]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline text-[#1a2236]">Đăng nhập</span>
            </Link>
          )}
          <button
            onClick={onCartClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a6fdb] text-white rounded-xl hover:bg-[#1558b0] transition-colors text-sm font-medium relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="hidden sm:inline">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#f97316] text-white text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function CategoryNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <nav className="bg-white border-b border-[#e2eaf6] transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
          {categories.map((c) => {
            const slug = toSlug(c.label);
            const path = `/category/${slug}`;
            const isActive = currentPath === path || (currentPath === '/' && slug === 'dien-thoai'); // Default first item on home if wanted, or just currentPath === path
            return (
              <Link
                key={c.label}
                to={path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#1a6fdb] text-white"
                    : "text-[#1a2236] hover:bg-[#f0f5fc]:bg-white/10"
                }`}
              >
                <span>{c.icon}</span>
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const b = banners[current];
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div
        className="relative rounded-2xl overflow-hidden transition-colors duration-500"
        style={{ background: b.bg, minHeight: 240 }}
      >
        <div className="flex items-center justify-between px-10 py-8 min-h-[240px]">
          <div className="text-white max-w-sm">
            <p className="text-sm font-medium opacity-70 mb-2">{b.tag}</p>
            <h1 className="text-4xl font-extrabold tracking-tight leading-none mb-3">{b.title}</h1>
            <p className="text-lg font-semibold text-[#f97316]">{b.sub}</p>
            <Link to={b.link} className="inline-block mt-5 px-6 py-2.5 bg-[#1a6fdb] text-white text-sm font-semibold rounded-xl hover:bg-[#1558b0] transition-colors">
              Mua ngay
            </Link>
          </div>
          <img src={b.img} alt={b.alt} className="h-48 w-auto object-contain hidden sm:block rounded-xl" />
        </div>

        {/* Arrows */}
        <button
          onClick={() => setCurrent((current - 1 + banners.length) % banners.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors text-sm"
        >‹</button>
        <button
          onClick={() => setCurrent((current + 1) % banners.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors text-sm"
        >›</button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, accent, onViewAll }: { title: string; accent: string; onViewAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-[#1a2236]">
        {title}{" "}
        <span className="text-[#1a6fdb]">{accent}</span>
      </h2>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-sm text-[#1a6fdb] font-medium hover:underline flex items-center gap-1"
        >
          Xem tất cả <span>›</span>
        </button>
      )}
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: typeof smartphones[0]; onAdd: (product: typeof smartphones[0]) => void }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    setAdded(true);
    onAdd(product);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow group border border-[#e2eaf6] relative">
      <span className="absolute top-3 right-3 bg-[#1a6fdb] text-white text-xs font-bold px-2 py-0.5 rounded-lg">
        {product.off}% OFF
      </span>
      <Link to={`/product/${toSlug(product.name)}`} className="block bg-[#f0f5fc] rounded-xl overflow-hidden h-40 flex items-center justify-center">
        <img src={product.img} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>
      <div>
        <Link to={`/product/${toSlug(product.name)}`} className="text-sm font-semibold text-[#1a2236] leading-snug hover:text-[#1a6fdb] line-clamp-2">
          {product.name}
        </Link>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold text-[#1a2236]">{fmt(product.price)}</span>
          <span className="text-xs text-[#6b7a99] line-through">{fmt(product.original)}</span>
        </div>
        <p className="text-xs text-emerald-600 font-medium mt-0.5">Tiết kiệm {fmt(product.original - product.price)}</p>
      </div>
      <button
        onClick={handleAdd}
        className={`w-full py-2 text-sm font-semibold rounded-xl transition-all ${
          added ? "bg-emerald-500 text-white" : "bg-[#f0f5fc] text-[#1a6fdb] hover:bg-[#1a6fdb] hover:text-white"
        }`}
      >
        {added ? "✓ Đã thêm" : "Thêm vào giỏ"}
      </button>
    </div>
  );
}

function SmartphonesSection({ onAddToCart }: { onAddToCart: (product: typeof smartphones[0]) => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl p-5 border border-[#e2eaf6] transition-colors">
        <SectionHeader title="Ưu đãi hàng đầu về" accent="Điện thoại" onViewAll={() => {}} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {smartphones.map((p) => (
            <ProductCard key={p.name} product={p} onAdd={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TopCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl p-5 border border-[#e2eaf6] shadow-sm">
        <SectionHeader title="Mua sắm theo" accent="Danh mục hàng đầu" onViewAll={() => {}} />
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
          {topCategories.map((c) => {
            const slug = toSlug(c.label);
            return (
              <Link key={c.label} to={`/category/${slug}`} className="flex flex-col items-center gap-2 group">
                
              <div className="w-16 h-16 rounded-full border-2 border-[#e2eaf6] group-hover:border-[#1a6fdb] overflow-hidden transition-colors bg-[#f0f5fc]">
                <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-medium text-[#1a2236] text-center leading-tight">{c.label}</span>
            
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BrandsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-[#323232] rounded-2xl p-5 border border-white/10">
        <SectionHeader title="Thương hiệu" accent="Điện tử hàng đầu" onViewAll={() => {}} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {brands.map((b) => (
            <button
              key={b.name}
              className="relative rounded-xl overflow-hidden h-36 group flex items-end"
              style={{ background: b.color }}
            >
              <img
                src={b.img}
                alt={b.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
              />
              <div className="relative z-10 p-4 text-left text-white">
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">{b.name}</p>
                <p className="text-sm font-bold">{b.tagline}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccessoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-[#323232] rounded-2xl p-5 border border-white/10">
        <SectionHeader title="Phụ kiện" accent="Nổi bật" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {accessories.map((e) => (
            <Link key={e.label} to={`/search?q=${encodeURIComponent(e.label)}`} className="flex flex-col items-center gap-2 group">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f0f5fc] border border-[#e2eaf6] group-hover:border-[#1a6fdb] transition-colors">
                <img src={e.img} alt={e.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#1a2236] leading-tight">{e.label}</p>
                <p className="text-xs text-[#1a6fdb] font-medium">{e.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1a6fdb] text-white mt-6">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1a6fdb] font-black text-sm">B</div>
            <span className="text-xl font-bold tracking-tight">BigBangMart</span>
          </div>
          <p className="text-sm opacity-80 mb-4">Nền tảng mua sắm trực tuyến hàng đầu Việt Nam.</p>
          <div className="space-y-1 text-sm opacity-80">
            <p>📱 WhatsApp: 0848675966</p>
            <p>📞 Hotline: 0848675966</p>
          </div>
          
        </div>

        <div>
          <h3 className="font-bold mb-3">Danh mục phổ biến</h3>
          <ul className="space-y-1.5 text-sm opacity-80">
            {["Điện thoại", "Laptop", "Máy tính bảng", "Âm thanh", "Đồng hồ thông minh", "Phụ kiện", "Camera", "Màn hình"].map(l => {
              const slug = toSlug(l);
              return (
                <li key={l}><Link to={`/category/${slug}`} className="hover:opacity-100 hover:underline transition-opacity">› {l}</Link></li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Dịch vụ khách hàng</h3>
          <ul className="space-y-1.5 text-sm opacity-80">
            {["Về chúng tôi", "Điều khoản & Điều kiện", "FAQ", "Chính sách bảo mật", "Chính sách đổi trả", "Chính sách hủy đơn"].map(l => {
              const slug = toSlug(l);
              return (
                <li key={l}><Link to={`/page/${slug}`} className="hover:opacity-100 hover:underline transition-opacity">› {l}</Link></li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 text-center py-4 text-xs opacity-60">
        © 2024 BigBangMart — Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}

// ─── Cart Drawer ─────────────────────────────────────────────────────────────

function CartDrawer({ items, onUpdateQty, onClose }: { items: (typeof smartphones[0] & { qty: number })[]; onUpdateQty: (name: string, delta: number) => void; onClose: () => void }) {
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
            <Link
              to="/checkout"
              onClick={onClose}
              className="block text-center w-full py-3 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors"
            >
              Tiến hành thanh toán
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

function LoginPage() {
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
  };

  return (
    <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-2xl border border-[#e2eaf6] shadow-sm">
      <h1 className="text-2xl font-bold text-center text-[#1a2236] mb-6">Đăng nhập</h1>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-[#1a2236] mb-1">Email / Số điện thoại</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" 
            placeholder="Nhập email hoặc SĐT..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a2236] mb-1">Mật khẩu</label>
          <input 
            type="password" 
            className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" 
            placeholder="Nhập mật khẩu..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
        Chưa có tài khoản? <Link to="/register" className="text-[#1a6fdb] hover:underline font-bold">Đăng ký ngay</Link>
      </p>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-2xl border border-[#e2eaf6] shadow-sm">
      <h1 className="text-2xl font-bold text-center text-[#1a2236] mb-6">Đăng ký tài khoản</h1>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-[#1a2236] mb-1">Họ và tên</label>
          <input type="text" className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="Nhập họ và tên..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a2236] mb-1">Email / Số điện thoại</label>
          <input type="text" className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="Nhập email hoặc SĐT..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a2236] mb-1">Mật khẩu</label>
          <input type="password" className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="Nhập mật khẩu..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a2236] mb-1">Xác nhận mật khẩu</label>
          <input type="password" className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="Nhập lại mật khẩu..." />
        </div>
        <button type="submit" className="w-full py-3 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors mt-2">Đăng ký</button>
      </form>
      <p className="text-center text-sm text-[#6b7a99] mt-6">
        Đã có tài khoản? <Link to="/login" className="text-[#1a6fdb] hover:underline font-bold">Đăng nhập</Link>
      </p>
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f0f5fc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e2eaf6] flex flex-col">
        <div className="p-4 border-b border-[#e2eaf6] flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1a2236] rounded-lg flex items-center justify-center text-white font-black text-sm">A</div>
          <span className="text-xl font-bold text-[#1a2236] tracking-tight">AdminPanel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink end to="/admin" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1a6fdb] text-white shadow-md shadow-blue-500/20' : 'text-[#6b7a99] hover:bg-[#f0f5fc]'}`}>
            <span>📊</span> Tổng quan
          </NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1a6fdb] text-white shadow-md shadow-blue-500/20' : 'text-[#6b7a99] hover:bg-[#f0f5fc]'}`}>
            <span>📦</span> Đơn hàng
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1a6fdb] text-white shadow-md shadow-blue-500/20' : 'text-[#6b7a99] hover:bg-[#f0f5fc]'}`}>
            <span>📱</span> Sản phẩm
          </NavLink>
          <NavLink to="/admin/customers" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1a6fdb] text-white shadow-md shadow-blue-500/20' : 'text-[#6b7a99] hover:bg-[#f0f5fc]'}`}>
            <span>👥</span> Khách hàng
          </NavLink>
        </nav>
        <div className="p-4 border-t border-[#e2eaf6]">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-[#ef4444] hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
            <span>🚪</span> Về trang cửa hàng
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-[#e2eaf6] px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1a2236]">Dashboard</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#1a2236]">Xin chào, Admin</span>
            <div className="w-10 h-10 rounded-full bg-[#f0f5fc] flex items-center justify-center text-lg">👨‍💼</div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm">
          <p className="text-sm font-medium text-[#6b7a99] mb-2">Tổng doanh thu</p>
          <p className="text-3xl font-bold text-[#1a2236]">₫124.500.000</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">↑ 12% so với tháng trước</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm">
          <p className="text-sm font-medium text-[#6b7a99] mb-2">Đơn hàng mới</p>
          <p className="text-3xl font-bold text-[#1a2236]">86</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">↑ 5% so với hôm qua</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm">
          <p className="text-sm font-medium text-[#6b7a99] mb-2">Người dùng mới</p>
          <p className="text-3xl font-bold text-[#1a2236]">24</p>
          <p className="text-xs text-red-500 font-medium mt-2">↓ 2% so với tuần trước</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-[#e2eaf6] shadow-sm">
        <h3 className="text-lg font-bold text-[#1a2236] mb-4">Đơn hàng gần đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#6b7a99] border-b border-[#e2eaf6]">
                <th className="pb-3 font-medium">Mã ĐH</th>
                <th className="pb-3 font-medium">Khách hàng</th>
                <th className="pb-3 font-medium">Sản phẩm</th>
                <th className="pb-3 font-medium">Tổng tiền</th>
                <th className="pb-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-[#1a2236]">
              <tr className="border-b border-[#e2eaf6]/50">
                <td className="py-4">#ORD-001</td>
                <td className="py-4">Nguyễn Văn A</td>
                <td className="py-4">Galaxy S22 Ultra</td>
                <td className="py-4">₫32.999.000</td>
                <td className="py-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">Đã giao</span></td>
              </tr>
              <tr className="border-b border-[#e2eaf6]/50">
                <td className="py-4">#ORD-002</td>
                <td className="py-4">Trần Thị B</td>
                <td className="py-4">Tai nghe Bluetooth</td>
                <td className="py-4">₫2.500.000</td>
                <td className="py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Đang xử lý</span></td>
              </tr>
              <tr>
                <td className="py-4">#ORD-003</td>
                <td className="py-4">Lê Văn C</td>
                <td className="py-4">Laptop Dell XPS</td>
                <td className="py-4">₫45.000.000</td>
                <td className="py-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">Chờ thanh toán</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void }>();
  
  // Collect all products to filter from
  const allProducts = [...smartphones, ...laptops, ...tablets, ...audio, ...smartwatches, ...accessoriesData, ...cameras, ...monitors];
  
  // Very basic search filter: check if product name includes the search query (case-insensitive)
  const results = allProducts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold text-[#1a2236] mb-6">Kết quả tìm kiếm cho: "{q}"</h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {results.map((p, i) => (
            <ProductCard key={i} product={p} onAdd={onAddToCart} />
          ))}
        </div>
      ) : (
         <div className="bg-white p-12 rounded-2xl border border-[#e2eaf6] text-center">
           <div className="w-16 h-16 bg-[#f0f5fc] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🔍</div>
           <h2 className="text-xl font-bold text-[#1a2236] mb-2">Không tìm thấy sản phẩm</h2>
           <p className="text-[#6b7a99]">Rất tiếc, chúng tôi không tìm thấy sản phẩm nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác.</p>
         </div>
      )}
    </div>
  );
}

function CategoryPage() {
  const { id } = useParams();
  
  const categoryMatch = categories.find(c => toSlug(c.label) === id) 
    || topCategories.find(c => toSlug(c.label) === id);
    
  const title = categoryMatch 
    ? categoryMatch.label 
    : (id ? id.replace(/-/g, " ").replace(/(^\w|[\s]\S)/g, l => l.toUpperCase()) : "Danh mục");

  const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void, cartItems: any[], clearCart: () => void }>();

  let pageProducts = smartphones;
  if (id === 'laptop') pageProducts = laptops;
  else if (id === 'may-tinh-bang' || id === 'tablet') pageProducts = tablets;
  else if (id === 'am-thanh') pageProducts = audio;
  else if (id === 'dong-ho-thong-minh' || id === 'smartwatch') pageProducts = smartwatches;
  else if (id === 'phu-kien') pageProducts = accessoriesData;
  else if (id === 'camera') pageProducts = cameras;
  else if (id === 'man-hinh') pageProducts = monitors;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };
  
  const clearFilters = () => setSelectedFilters([]);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh] relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a2236]">Danh mục: {title}</h1>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-[#e2eaf6] rounded-lg text-sm font-medium hover:bg-[#f0f5fc] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Bộ lọc
        </button>
      </div>

      {/* Filter Modal (Mô phỏng TopZone) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
          <div className="relative bg-[#323232] text-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#323232] z-10 flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold mx-auto">Tất cả bộ lọc</h2>
              <button onClick={() => setIsFilterOpen(false)} className="absolute right-6 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8">
              
              <div>
                <h3 className="font-bold mb-3">Dòng sản phẩm</h3>
                <div className="flex flex-wrap gap-3">
                  {["Cao cấp", "Tầm trung", "Giá rẻ", "Phiên bản đặc biệt"].map(f => {
                    const isSelected = selectedFilters.includes(f);
                    return (
                      <button 
                        key={f} 
                        onClick={() => toggleFilter(f)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          isSelected 
                            ? 'bg-transparent border-[#3b82f6] text-[#3b82f6]' 
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3">Giá</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {["Dưới 15 triệu", "Từ 15 - 20 triệu", "Từ 20 - 25 triệu", "Từ 25 - 30 triệu", "Trên 30 triệu"].map(f => {
                    const isSelected = selectedFilters.includes(f);
                    return (
                      <button 
                        key={f} 
                        onClick={() => toggleFilter(f)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          isSelected 
                            ? 'bg-transparent border-[#3b82f6] text-[#3b82f6]' 
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-[#3b82f6] mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  <span>Hoặc chọn mức giá phù hợp với bạn</span>
                </div>
                
                {/* Giả lập thanh kéo Range Slider */}
                <div className="relative h-1 bg-white/20 rounded-full mb-6 mx-2">
                   <div className="absolute left-[20%] right-[30%] h-full bg-[#3b82f6] rounded-full"></div>
                   <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#3b82f6] rounded-full shadow cursor-pointer"></div>
                   <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#3b82f6] rounded-full shadow cursor-pointer"></div>
                </div>

                <div className="flex justify-center gap-4">
                  <div className="px-4 py-2 bg-transparent border border-white/20 rounded-lg w-32 text-center text-sm">15.000.000đ</div>
                  <div className="px-4 py-2 bg-transparent border border-white/20 rounded-lg w-32 text-center text-sm">40.000.000đ</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3">Dung lượng lưu trữ</h3>
                <div className="flex flex-wrap gap-3">
                  {["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"].map(f => {
                    const isSelected = selectedFilters.includes(f);
                    return (
                      <button 
                        key={f} 
                        onClick={() => toggleFilter(f)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          isSelected 
                            ? 'bg-transparent border-[#3b82f6] text-[#3b82f6]' 
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3">RAM</h3>
                <div className="flex flex-wrap gap-3">
                  {["4 GB", "6 GB", "8 GB", "12 GB"].map(f => {
                    const isSelected = selectedFilters.includes(f);
                    return (
                      <button 
                        key={f} 
                        onClick={() => toggleFilter(f)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          isSelected 
                            ? 'bg-transparent border-[#3b82f6] text-[#3b82f6]' 
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-[#2c2c2e] p-4 border-t border-white/10 flex justify-center gap-4">
              <button onClick={clearFilters} className="px-8 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">Bỏ chọn</button>
              <button onClick={() => setIsFilterOpen(false)} className="px-8 py-2.5 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">Xem 15 kết quả</button>
            </div>

          </div>
        </div>
      )}

      {pageProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {pageProducts.map((p, i) => (
            <ProductCard key={i} product={p} onAdd={onAddToCart} />
          ))}
        </div>
      ) : (
         <div className="bg-white p-12 rounded-2xl border border-[#e2eaf6] text-center">
           <div className="w-16 h-16 bg-[#f0f5fc] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">📦</div>
           <h2 className="text-xl font-bold text-[#1a2236] mb-2">Đang cập nhật sản phẩm</h2>
           <p className="text-[#6b7a99]">Các sản phẩm thuộc danh mục {title} sẽ sớm được cập nhật. Vui lòng quay lại sau!</p>
         </div>
      )}
    </div>
  );
}

function HomePage() {
  const { onAddToCart } = useOutletContext<{ onAddToCart: () => void }>();
  return (
    <div className="bg-transparent">
      <HeroBanner />
      <TopCategories />
      <ProductCarousel title="Điện thoại" products={smartphones} icon="📱" onAdd={onAddToCart} />
      <ProductCarousel title="Laptop / Mac" products={laptops} icon="💻" onAdd={onAddToCart} />
      <ProductCarousel title="Máy tính bảng" products={tablets} icon="📱" onAdd={onAddToCart} />
      <ProductCarousel title="Phụ kiện" products={accessoriesData} icon="🔌" onAdd={onAddToCart} />
    </div>
  );
}




function ProductPage() {
  const { id } = useParams();
  const { onAddToCart } = useOutletContext<{ onAddToCart: (product: typeof smartphones[0]) => void, cartItems: any[], clearCart: () => void }>();
  
  // Find product by slug
  const allProducts = [...smartphones, ...laptops, ...tablets, ...audio, ...smartwatches, ...accessoriesData, ...cameras, ...monitors];
  const product = allProducts.find(p => toSlug(p.name) === id);

  const [activeTab, setActiveTab] = useState("features");
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#1a2236] mb-4">Không tìm thấy sản phẩm</h1>
        <p className="text-[#6b7a99] mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link to="/" className="inline-block px-8 py-3 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <div className="bg-[#f0f5fc] rounded-3xl aspect-square flex items-center justify-center p-8 overflow-hidden relative">
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                Giảm {product.off}%
              </span>
              <img src={product.img} alt={product.name} className="w-full h-full object-contain" />
            </div>
            {/* Thumbnails (Giả lập) */}
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} className={`aspect-square rounded-xl overflow-hidden border-2 ${i === 1 ? 'border-[#1a6fdb]' : 'border-[#e2eaf6] hover:border-[#1a6fdb]'} bg-[#f0f5fc]`}>
                  <img src={product.img} alt={`${product.name} thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Thông tin chi tiết (Giống TopZone mockup) */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-[#1a2236] mb-2">{product.name}</h1>
            <p className="text-sm text-[#6b7a99] mb-4">Mã SP: {toSlug(product.name).toUpperCase().substring(0, 8)} | Đánh giá: 4.9/5 (128 lượt)</p>
            
            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-[#e2eaf6]">
              <div className="text-3xl font-extrabold text-[#1a6fdb]">{fmt(product.price)}</div>
              <div className="text-lg text-[#6b7a99] line-through mb-1">{fmt(product.original)}</div>
              <div className="text-sm font-medium text-emerald-600 mb-1.5 px-2 py-0.5 bg-emerald-50 rounded-md">
                Tiết kiệm {fmt(product.original - product.price)}
              </div>
            </div>

            {/* Các tùy chọn - Giả lập cho sinh động */}
            <div className="space-y-6 mb-8 flex-1">
              <div>
                <p className="text-sm font-bold text-[#1a2236] mb-3">Dung lượng / Phiên bản:</p>
                <div className="flex flex-wrap gap-3">
                  {["Tiêu chuẩn", "Nâng cao", "Cao cấp"].map((cap, i) => (
                    <button key={cap} className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${i === 0 ? 'border-[#1a6fdb] bg-[#f0f5fc] text-[#1a6fdb]' : 'border-[#e2eaf6] text-[#6b7a99] hover:border-[#1a6fdb] hover:text-[#1a6fdb]'}`}>
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-bold text-[#1a2236] mb-3">Màu sắc:</p>
                <div className="flex gap-3">
                  {[
                    {name: "Đen Midnight", color: "#1a2236"},
                    {name: "Trắng Starlight", color: "#f8fafc"},
                    {name: "Xanh Navy", color: "#1a6fdb"}
                  ].map((c, i) => (
                    <button key={c.name} title={c.name} className={`w-10 h-10 rounded-full border-2 ${i === 0 ? 'border-[#1a6fdb] p-0.5' : 'border-transparent'} transition-all`}>
                      <span className="w-full h-full block rounded-full border border-black/10" style={{backgroundColor: c.color}}></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hộp khuyến mãi */}
              <div className="bg-[#f0f5fc] border border-[#1a6fdb]/20 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#1a6fdb]"></div>
                <h3 className="font-bold text-[#1a6fdb] flex items-center gap-2 mb-3">
                  <span>🎁</span> Khuyến mãi đặc biệt
                </h3>
                <ul className="space-y-2 text-sm text-[#1a2236]">
                  <li className="flex gap-2"><span className="text-[#1a6fdb]">•</span> Tặng Voucher 500.000đ khi mua kèm phụ kiện.</li>
                  <li className="flex gap-2"><span className="text-[#1a6fdb]">•</span> Thu cũ đổi mới trợ giá thêm đến 2.000.000đ.</li>
                  <li className="flex gap-2"><span className="text-[#1a6fdb]">•</span> Giảm thêm 5% khi thanh toán qua SePay VietQR.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 mt-auto pt-6">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 py-4 bg-[#1a6fdb] text-white font-bold rounded-xl hover:bg-[#1558b0] transition-colors shadow-lg shadow-blue-500/20 text-lg flex items-center justify-center gap-2"
              >
                Thêm vào giỏ
              </button>
              <button className="w-16 h-16 bg-[#f0f5fc] text-[#1a6fdb] rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors border border-[#e2eaf6]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Thông tin thêm bên dưới */}
        <div className="mt-16 pt-12 border-t border-[#e2eaf6]">
          <div className="flex gap-8 border-b border-[#e2eaf6] mb-8 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab("features")}
              className={`pb-4 font-bold text-lg whitespace-nowrap transition-colors border-b-2 ${activeTab === 'features' ? 'border-[#1a6fdb] text-[#1a6fdb]' : 'border-transparent text-[#6b7a99] hover:text-[#1a2236]'}`}
            >
              Đặc điểm nổi bật
            </button>
            <button 
              onClick={() => setActiveTab("specs")}
              className={`pb-4 font-bold text-lg whitespace-nowrap transition-colors border-b-2 ${activeTab === 'specs' ? 'border-[#1a6fdb] text-[#1a6fdb]' : 'border-transparent text-[#6b7a99] hover:text-[#1a2236]'}`}
            >
              Thông số kỹ thuật
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6 text-[#1a2236] leading-relaxed">
              {activeTab === 'features' ? (
                <>
                  <h3 className="text-xl font-bold">Mô tả sản phẩm</h3>
                  <p>{product.name} là một trong những sản phẩm công nghệ hàng đầu hiện nay, mang đến trải nghiệm đột phá với hiệu năng vượt trội và thiết kế tinh tế. Máy được trang bị bộ vi xử lý thế hệ mới nhất, giúp xử lý mượt mà mọi tác vụ từ làm việc đến giải trí.</p>
                  <img src={product.img} className="w-full h-80 object-cover rounded-2xl bg-[#f0f5fc]" alt="Feature" />
                  <p>Màn hình hiển thị xuất sắc với độ phân giải siêu cao, dải màu rộng và tần số quét lớn mang lại hình ảnh sống động, chân thực đến từng chi tiết. Bên cạnh đó, hệ thống tản nhiệt tiên tiến đảm bảo máy luôn hoạt động mát mẻ trong thời gian dài.</p>
                </>
              ) : (
                <div className="bg-[#f0f5fc] rounded-2xl p-6 border border-[#e2eaf6]">
                  <h3 className="text-xl font-bold mb-6">Thông số kỹ thuật chi tiết</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {getProductSpecs(product.name).map((row, i) => (
                        <tr key={i} className={`border-b border-[#e2eaf6] ${i % 2 === 0 ? 'bg-white' : ''}`}>
                          <td className="py-3 px-4 font-medium text-[#6b7a99] w-1/3">{row[0]}</td>
                          <td className="py-3 px-4 font-semibold text-[#1a2236]">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#e2eaf6] rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-lg text-[#1a2236] mb-4">Sản phẩm tương tự</h3>
                <div className="space-y-4">
                  {smartphones.slice(0, 3).map((p, i) => (
                    <Link to={`/product/${toSlug(p.name)}`} key={i} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-[#f0f5fc] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                        <img src={p.img} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-sm font-semibold text-[#1a2236] group-hover:text-[#1a6fdb] transition-colors line-clamp-2 mb-1">{p.name}</p>
                        <p className="text-sm font-bold text-[#1a6fdb]">{fmt(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const { cartItems, clearCart } = useOutletContext<{ cartItems: (typeof smartphones[0] & { qty: number })[], clearCart: () => void }>();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = total > 0 ? 30000 : 0;
  const finalTotal = total + shipping;
  const [orderId] = useState(() => "BBM" + Math.floor(Math.random() * 1000000));
  
  // Cấu hình SePay (Thay đổi thành tài khoản thật khi triển khai)
  const sepayBank = "MBBank"; 
  const sepayAcc = "0123456789"; 
  const sepayTemplate = "compact";
  const qrUrl = `https://qr.sepay.vn/img?bank=${sepayBank}&acc=${sepayAcc}&amount=${finalTotal}&des=${orderId}&template=${sepayTemplate}`;

  const API_TOKEN = "SG832BCLRMSG6D7LU4HFEKQCV0HLIHWYHQPXFA0JBEUYP6LCZXOVIATFNO8MCJQA";
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const verifySePayTransaction = async () => {
    setIsVerifying(true);
    setPaymentError("");
    try {
      const res = await fetch("https://my.sepay.vn/userapi/transactions/list", {
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
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
          "Authorization": `Bearer ${API_TOKEN}`,
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
  }, [paymentMethod, isSuccess, orderId, finalTotal, clearCart]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'qr') {
      verifySePayTransaction();
    } else {
      setIsSuccess(true);
      clearCart();
    }
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
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#1a6fdb] bg-[#f0f5fc]' : 'border-[#e2eaf6] hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-[#1a6fdb]" />
                <span className="font-medium text-[#1a2236]">Thanh toán khi nhận hàng (COD)</span>
              </label>
              
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'qr' ? 'border-[#1a6fdb] bg-[#f0f5fc]' : 'border-[#e2eaf6] hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="qr" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} className="w-4 h-4 text-[#1a6fdb]" />
                <span className="font-medium text-[#1a2236]">Thanh toán qua mã QR (Momo, VNPay, ZaloPay)</span>
              </label>
              {paymentMethod === 'qr' && (
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
                  <p className="text-xs text-[#6b7a99] text-center px-4 mb-3">Sử dụng ứng dụng ngân hàng để quét mã.<br/>Hệ thống SePay sẽ tự động xác nhận thanh toán khi nhận được tiền (Auto đối soát).</p>
                  <button type="button" onClick={verifySePayTransaction} disabled={isVerifying} className="px-6 py-2.5 bg-[#f0f5fc] text-[#1a6fdb] font-semibold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                    {isVerifying ? (
                      <><span className="w-4 h-4 border-2 border-[#1a6fdb] border-t-transparent rounded-full animate-spin"></span> Đang kiểm tra...</>
                    ) : "Tôi đã chuyển khoản"}
                  </button>
                  {paymentError && <p className="text-xs text-red-500 text-center mt-3 bg-red-50 p-2 rounded-lg">{paymentError}</p>}
                </div>
              )}

              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#1a6fdb] bg-[#f0f5fc]' : 'border-[#e2eaf6] hover:bg-gray-50'}`}>
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

            <button type="submit" form="checkout-form" disabled={isVerifying && paymentMethod === 'qr'} className="w-full mt-6 py-3 bg-[#1a6fdb] text-white font-bold rounded-xl hover:bg-[#1558b0] transition-colors shadow-md shadow-blue-500/20 disabled:opacity-70">
              {paymentMethod === 'qr' ? 'Kiểm tra thanh toán & Đặt hàng' : 'Xác nhận Đặt hàng'}
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

function GenericPage() {
  const { id } = useParams();
  const title = id 
    ? decodeURIComponent(id).replace(/-/g, " ").replace(/(^\w|[\s]\S)/g, l => l.toUpperCase()) 
    : "Trang";

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-[60vh]">
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-[#e2eaf6] shadow-sm max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a2236] mb-6">{title}</h1>
        <div className="space-y-4 text-[#6b7a99] leading-relaxed">
          <p>Chào mừng bạn đến với trang <strong>{title}</strong>. Nội dung của trang này hiện đang được cập nhật.</p>
          <p>Chúng tôi đang nỗ lực hoàn thiện các thông tin và chính sách để mang đến cho bạn trải nghiệm mua sắm tốt nhất tại BigBangMart. Mọi thắc mắc xin vui lòng liên hệ bộ phận hỗ trợ khách hàng qua Hotline hoặc WhatsApp.</p>
          <p>Xin cảm ơn sự đồng hành và tin tưởng của bạn!</p>
        </div>
      </div>
    </div>
  );
}


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
                  <td className="py-4"><span className={`px-2.5 py-1 bg-${order.color}-100 text-${order.color}-700 rounded-lg text-xs font-semibold`}>{order.status}</span></td>
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
  // Dữ liệu khởi tạo (Mock data)
  const initialProducts = smartphones.slice(0, 3).concat(laptops.slice(0, 2)).map((p, index) => ({
    ...p, 
    id: index.toString(),
    stock: Math.floor(Math.random() * 50) + 5, 
    category: p.price > 20000000 ? "Laptop" : "Điện thoại"
  }));

  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "Điện thoại", price: 0, original: 0, stock: 0, img: "" });

  const handleDelete = (id: string) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
       setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({ name: p.name, category: p.category, price: p.price, original: p.original || p.price, stock: p.stock, img: p.img });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: "", category: "Điện thoại", price: 0, original: 0, stock: 0, img: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const off = formData.original > formData.price ? Math.round((1 - formData.price / formData.original) * 100) : 0;
    
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...formData, off } : p));
    } else {
      setProducts([{ ...formData, id: Math.random().toString(), off }, ...products]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a2236]">Quản lý sản phẩm</h2>
        <button onClick={handleAdd} className="px-4 py-2 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors text-sm flex items-center gap-2 shadow-md shadow-blue-500/20">
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
                <th className="pb-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-[#1a2236]">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-[#6b7a99]">Chưa có sản phẩm nào.</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="border-b border-[#e2eaf6]/50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 flex items-center gap-3 min-w-[250px]">
                    <div className="w-12 h-12 bg-[#f0f5fc] rounded-lg overflow-hidden flex items-center justify-center p-1.5 shrink-0 border border-[#e2eaf6]">
                      <img src={p.img || 'https://via.placeholder.com/150'} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-[#1a2236] whitespace-normal line-clamp-2">{p.name}</span>
                  </td>
                  <td className="py-4 text-[#6b7a99]">{p.category}</td>
                  <td className="py-4 font-bold text-[#1a6fdb]">{fmt(Number(p.price))}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${p.stock < 10 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => handleEdit(p)} className="text-[#1a6fdb] hover:underline font-medium">Sửa</button>
                      <span className="text-[#e2eaf6]">|</span>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline font-medium">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa Sản phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[#1a2236] mb-6">{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1a2236] mb-1">Tên sản phẩm</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="VD: iPhone 15 Pro Max..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Danh mục</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb] bg-white">
                    {["Điện thoại", "Laptop", "Máy tính bảng", "Âm thanh", "Đồng hồ thông minh", "Phụ kiện", "Camera", "Màn hình"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Tồn kho</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Giá bán (VNĐ)</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Giá gốc (VNĐ)</label>
                  <input required type="number" min="0" value={formData.original} onChange={e => setFormData({...formData, original: Number(e.target.value)})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2236] mb-1">Đường dẫn hình ảnh (URL)</label>
                <input required type="url" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} className="w-full px-4 py-2 border border-[#e2eaf6] rounded-xl outline-none focus:border-[#1a6fdb]" placeholder="https://..." />
              </div>
              
              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-[#e2eaf6]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-[#6b7a99] font-medium hover:bg-[#f0f5fc] rounded-xl transition-colors">
                  Hủy bỏ
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#1a6fdb] text-white font-semibold rounded-xl hover:bg-[#1558b0] transition-colors">
                  {editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.rank === 'VVIP' ? 'bg-purple-100 text-purple-700' : user.rank === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`flex items-center gap-1.5 ${user.status === 'Khóa' ? 'text-red-500' : 'text-emerald-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Khóa' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
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

function RootLayout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  const [cartItems, setCartItems] = useState<(typeof smartphones[0] & { qty: number })[]>([]);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  const handleAddToCart = (product: typeof smartphones[0]) => {
    if (!isLoggedIn) {
      setToastMsg({text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", isError: true});
      setTimeout(() => navigate("/login"), 1000);
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
  const [toastMsg, setToastMsg] = useState<{text: string, isError: boolean} | null>(null);

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToastMsg({text: "Đăng nhập thành công!", isError: false});
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCartItems([]); // Clear cart on logout
  };

  return (
    <div className="min-h-screen bg-[#f0f5fc] flex flex-col transition-colors">
      <AnnouncementBar />
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <CategoryNav />
      <div className="flex-1">
        <Outlet context={{ onAddToCart: handleAddToCart, cartItems, clearCart: () => setCartItems([]), login: handleLogin, showToast: (text: string, isError = false) => setToastMsg({text, isError}) }} />
      </div>
      <Footer />
      {cartOpen && <CartDrawer items={cartItems} onUpdateQty={handleUpdateQty} onClose={() => setCartOpen(false)} />}
      {toastMsg && <Toast message={toastMsg.text} isError={toastMsg.isError} onClose={() => setToastMsg(null)} />}
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
      { path: "register", Component: RegisterPage },
      { path: "category/:id", Component: CategoryPage },
      { path: "search", Component: SearchPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "product/:id", Component: ProductPage },
      { path: "page/:id", Component: GenericPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "orders", Component: AdminOrders },
      { path: "products", Component: AdminProducts },
      { path: "customers", Component: AdminCustomers },
    ],
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
