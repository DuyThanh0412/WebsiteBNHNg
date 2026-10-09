import { useState, useEffect } from "react";
import logoImg from "./assets/logo.png";
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

function BrandLogo({ className = "h-11" }: { className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden rounded-lg bg-black shrink-0 aspect-[1040/790] ${className}`}>
      <img src={logoImg} alt="BigBang" className="absolute max-w-none w-[192.3%] left-[-41.35%] top-[-68.35%]" />
    </span>
  );
}

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
          <BrandLogo className="h-12" />
          <span className="sr-only">BigBangMart</span>
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
            <BrandLogo className="h-14" />
            <span className="sr-only">BigBangMart</span>
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

const DEMO_CUSTOMER = { name: "Nguyễn Văn Khách", email: "khachhang@gmail.com", password: "123456" };

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { login, showToast } = useOutletContext<any>();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if ((email === "admin" || email === "admin@bigbangmart.com") && password === "123") {
      navigate("/admin");
    } else if (email.trim().toLowerCase() === DEMO_CUSTOMER.email && password === DEMO_CUSTOMER.password) {
      if (login) login({ name: DEMO_CUSTOMER.name, email: DEMO_CUSTOMER.email });
      navigate("/");
    } else if (email && password) {
      const name = email.split('@')[0];
      if (login) login({ name: name, email });
      navigate("/");
    } else {
      if (showToast) showToast("Vui lòng nhập đầy đủ tài khoản và mật khẩu!", true);
    }
  };
  const input = "w-full border border-adm-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-adm-primary";

  return (
    <div className="fixed inset-0 z-[60] overflow-auto bg-white grid lg:grid-cols-[1.1fr_1fr]">
      <div className="hidden lg:flex flex-col justify-between p-12 text-white bg-[linear-gradient(135deg,#1a6fdb_0%,#1558b0_55%,#0f3d82_100%)] relative overflow-hidden">
        <div>
          <div className="flex items-center gap-3 mb-3"><BrandLogo className="h-24" /></div>
          <p className="text-white/80">Quản lý cửa hàng điện tử của bạn, mọi lúc mọi nơi</p>
          <ul className="mt-10 space-y-4 text-[15px]">
            {["Quản lý đơn hàng nhanh chóng", "Theo dõi doanh thu hiệu quả", "Báo cáo chi tiết, trực quan", "Tối ưu trải nghiệm khách hàng"].map(t => <li key={t} className="flex items-center gap-3"><span className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-xs">✓</span>{t}</li>)}
          </ul>
        </div>
        <div className="text-[120px] leading-none opacity-90 select-none">💻🛍️📦</div>
        <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-white/10" />
      </div>
      <div className="flex items-center justify-center p-6 bg-[#f3f6fb]">
        <div className="w-full max-w-md bg-white rounded-2xl border border-adm-line p-8 shadow-sm">
          <Link to="/" className="text-xs text-adm-muted hover:text-adm-primary">← Về cửa hàng</Link>
          <h1 className="text-[22px] font-bold mt-3">Đăng nhập tài khoản</h1>
          <p className="text-sm text-adm-muted mb-5">Vui lòng nhập thông tin để đăng nhập</p>
          <div className="mb-4 rounded-lg bg-[#eef4ff] border border-[#cfe0fb] px-3 py-2.5 text-[12px] text-[#1a2236] flex items-center justify-between gap-3">
            <div><div className="font-semibold">Tài khoản khách hàng dùng thử</div><div className="text-adm-muted">{DEMO_CUSTOMER.email} / {DEMO_CUSTOMER.password}</div></div>
            <button type="button" onClick={() => { setEmail(DEMO_CUSTOMER.email); setPassword(DEMO_CUSTOMER.password); }} className="shrink-0 bg-adm-primary text-white rounded-md px-3 py-1.5 font-medium hover:bg-[#155bb5]">Điền sẵn</button>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div><label className="block text-[12px] text-adm-muted mb-1">Email / SĐT</label><input type="text" className={input} placeholder="Nhập email hoặc số điện thoại" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div><label className="block text-[12px] text-adm-muted mb-1">Mật khẩu</label>
              <div className="relative"><input type={showPw ? "text" : "password"} className={input} placeholder="Nhập mật khẩu" value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-adm-muted">{showPw ? "🙈" : "👁"}</button></div>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-[#1a6fdb]" /> Ghi nhớ đăng nhập</label>
              <button type="button" onClick={() => showToast && showToast("Vui lòng liên hệ quản trị viên để đặt lại mật khẩu")} className="text-adm-primary hover:underline">Quên mật khẩu?</button>
            </div>
            <button type="submit" className="w-full py-2.5 bg-adm-primary hover:bg-[#155bb5] text-white font-semibold rounded-lg transition-colors">Đăng nhập</button>
          </form>
          <div className="flex items-center gap-3 my-5 text-[11px] text-adm-muted"><span className="flex-1 h-px bg-adm-line" />Hoặc đăng nhập với<span className="flex-1 h-px bg-adm-line" /></div>
          <div className="grid grid-cols-2 gap-3">
            {["Google", "Facebook"].map(p => <button key={p} type="button" onClick={() => showToast && showToast(`Đăng nhập ${p} chưa được hỗ trợ`)} className="border border-adm-line rounded-lg py-2 text-sm font-medium hover:bg-[#f4f6fa]">{p}</button>)}
          </div>
          <p className="text-center text-sm text-adm-muted mt-6">Chưa có tài khoản? <Link to="/register" className="text-adm-primary hover:underline font-semibold">Đăng ký ngay</Link></p>
        </div>
      </div>
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

const admTone: Record<string, string> = {
  green: "bg-[#dcf7e8] text-[#15803d]",
  amber: "bg-[#fff1d6] text-[#b26a00]",
  blue: "bg-[#e3eeff] text-[#1a6fdb]",
  red: "bg-[#fde4e4] text-[#c62828]",
  gray: "bg-[#eef1f6] text-[#6b7a99]",
  purple: "bg-[#ece6ff] text-[#6d3fd1]",
};
function AdmPill({ tone, children }: { tone: string; children: any }) {
  return <span className={`${admTone[tone]} px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap`}>{children}</span>;
}
function AdmHead({ title, sub, action }: { title: string; sub?: string; action?: any }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h1 className="text-[26px] font-bold leading-tight text-adm-ink">{title}</h1>
        {sub && <p className="text-sm text-adm-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
function AdmCard({ children, className = "" }: { children: any; className?: string }) {
  return <div className={`bg-white border border-adm-line rounded-xl ${className}`}>{children}</div>;
}
function AdmPrimaryBtn({ children, onClick }: { children: any; onClick?: () => void }) {
  return <button onClick={onClick} className="bg-adm-primary hover:bg-[#155bb5] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">{children}</button>;
}
function AdmSearch({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-adm-muted text-sm">🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-adm-line rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-adm-primary bg-white" />
    </div>
  );
}
function AdmSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="border border-adm-line rounded-lg px-3 py-2 text-sm outline-none focus:border-adm-primary bg-white">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}
function AdmPager({ page, pages, total, per, onPage, unit }: { page: number; pages: number; total: number; per: number; onPage: (p: number) => void; unit: string }) {
  const from = total ? (page - 1) * per + 1 : 0;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-adm-line text-[12px] text-adm-muted">
      <span>Hiển thị {from} - {Math.min(page * per, total)} trong {total} {unit}</span>
      <div className="flex gap-1">
        <button disabled={page === 1} onClick={() => onPage(page - 1)} className="w-7 h-7 border border-adm-line rounded disabled:opacity-40">‹</button>
        {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPage(p)} className={`w-7 h-7 rounded border ${page === p ? "bg-adm-primary text-white border-adm-primary" : "border-adm-line"}`}>{p}</button>
        ))}
        <button disabled={page === pages} onClick={() => onPage(page + 1)} className="w-7 h-7 border border-adm-line rounded disabled:opacity-40">›</button>
      </div>
    </div>
  );
}
function AdmIconBtn({ tone, title, onClick, children }: { tone: "blue" | "red" | "gray"; title: string; onClick: () => void; children: any }) {
  const c = tone === "blue" ? "text-adm-primary hover:bg-[#e3eeff]" : tone === "red" ? "text-[#dc2626] hover:bg-[#fde4e4]" : "text-adm-muted hover:bg-[#eef1f6]";
  return <button title={title} onClick={onClick} className={`w-7 h-7 rounded-md inline-flex items-center justify-center text-sm ${c}`}>{children}</button>;
}
const admTh = "px-4 py-3 font-semibold text-left whitespace-nowrap";
const admTd = "px-4 py-3";
const admTableHead = "bg-[#f6f8fc] text-[#4b587a] text-[12px]";
function AdmDonut({ parts, center, sub }: { parts: { label: string; value: number; color: string }[]; center: string; sub: string }) {
  let acc = 0;
  const grad = parts.map(p => { const s = acc; acc += p.value; return `${p.color} ${s}% ${acc}%`; }).join(",");
  return (
    <div className="flex items-center gap-6 flex-wrap justify-center">
      <div className="relative w-36 h-36 rounded-full shrink-0" style={{ background: `conic-gradient(${grad})` }}>
        <div className="absolute inset-[22px] bg-white rounded-full flex flex-col items-center justify-center">
          <div className="text-2xl font-bold leading-none">{center}</div>
          <div className="text-[11px] text-adm-muted mt-1">{sub}</div>
        </div>
      </div>
      <ul className="space-y-1.5 text-[12px]">
        {parts.map(p => (
          <li key={p.label} className="flex items-center gap-2 min-w-[150px]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-adm-muted flex-1">{p.label}</span>
            <span className="font-semibold">{p.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
function AdmArea({ data, labels }: { data: number[]; labels: string[] }) {
  const W = 560, H = 190, L = 44, B = 24, T = 10, max = 40;
  const x = (i: number) => L + (i * (W - L - 8)) / (data.length - 1);
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs><linearGradient id="admArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a6fdb" stopOpacity=".25" /><stop offset="1" stopColor="#1a6fdb" stopOpacity="0" /></linearGradient></defs>
      {[0, 10, 20, 30, 40].map(v => (
        <g key={v}><line x1={L} x2={W - 8} y1={y(v)} y2={y(v)} stroke="#e6eaf2" strokeDasharray="3 3" /><text x={L - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#8a96b0">{v ? v + ".000.000đ" : "0"}</text></g>
      ))}
      <path d={`${line} L${x(data.length - 1)},${H - B} L${x(0)},${H - B} Z`} fill="url(#admArea)" />
      <path d={line} fill="none" stroke="#1a6fdb" strokeWidth="2" />
      {data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="#fff" stroke="#1a6fdb" strokeWidth="2" />)}
      {labels.map((l, i) => <text key={l} x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#8a96b0">{l}</text>)}
    </svg>
  );
}

const ADM_NAV = [
  { to: "/admin", label: "Tổng quan", icon: "▦", end: true },
  { to: "/admin/products", label: "Sản phẩm", icon: "▣" },
  { to: "/admin/categories", label: "Danh mục", icon: "☰" },
  { to: "/admin/orders", label: "Đơn hàng", icon: "🛒" },
  { to: "/admin/customers", label: "Khách hàng", icon: "👥" },
  { to: "/admin/promotions", label: "Khuyến mãi", icon: "🏷" },
  { to: "/admin/reports", label: "Báo cáo", icon: "📈" },
  { to: "/admin/settings", label: "Cài đặt", icon: "⚙" },
];

function AdminLayout() {
  const [adminToast, setAdminToast] = useState<{ text: string; isError?: boolean } | null>(null);
  const [open, setOpen] = useState(false);
  const showToast = (text: string, isError = false) => {
    setAdminToast({ text, isError });
    setTimeout(() => setAdminToast(null), 3000);
  };
  return (
    <div className="h-screen bg-adm-bg flex text-adm-ink">
      {adminToast && <Toast message={adminToast.text} isError={adminToast.isError} onClose={() => setAdminToast(null)} />}
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-56 bg-adm-navy flex flex-col shrink-0 transition-transform ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="px-4 h-14 flex items-center gap-2.5 border-b border-white/10">
          <BrandLogo className="h-9" />
          <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {ADM_NAV.map(n => (
            <NavLink key={n.to} end={n.end} to={n.to} onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? "bg-adm-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              <span className="w-4 text-center text-[13px]">{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/10 rounded-lg">↩ Về cửa hàng</Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-adm-line h-14 px-4 sm:px-6 flex items-center gap-3 shrink-0">
          <button className="lg:hidden text-xl" onClick={() => setOpen(true)}>☰</button>
          <div className="ml-auto flex items-center gap-4">
            <button onClick={() => showToast("Bạn có 3 đơn hàng mới")} className="relative text-lg">🔔<span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" /></button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#dbe7fb] flex items-center justify-center text-sm">👤</div>
              <span className="text-sm font-medium hidden sm:inline">Admin</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet context={{ showToast }} />
        </div>
      </main>
    </div>
  );
}

function AdminDashboard() {
  const stats = [
    { label: "Tổng doanh thu", value: "58.320.000đ", delta: "▲ 12%", up: true, icon: "🛒", bg: "bg-[#e3eeff]", to: "/admin/reports" },
    { label: "Tổng đơn hàng", value: "156", delta: "▲ 8%", up: true, icon: "📦", bg: "bg-[#dcf7e8]", to: "/admin/orders" },
    { label: "Khách hàng mới", value: "48", delta: "▲ 15%", up: true, icon: "👥", bg: "bg-[#ece6ff]", to: "/admin/customers" },
    { label: "Đơn hủy", value: "3", delta: "▼ 25%", up: false, icon: "✖", bg: "bg-[#fde4e4]", to: "/admin/orders" },
  ];
  const top = [
    { name: "Tai nghe Bluetooth AirPods", sold: 124, icon: "🎧" },
    { name: "Ốp lưng iPhone 14", sold: 98, icon: "📱" },
    { name: "Củ sạc nhanh 20W", sold: 76, icon: "🔌" },
    { name: "Chuột không dây", sold: 54, icon: "🖱️" },
    { name: "Bàn phím cơ", sold: 32, icon: "⌨️" },
  ];
  const recent: [string, string, number, string, string][] = [
    ["DH01258", "Nguyễn Văn An", 1250000, "Chờ xử lý", "amber"],
    ["DH01257", "Trần Thị Bích", 890000, "Đang đóng gói", "blue"],
    ["DH01256", "Lê Minh Tuấn", 2340000, "Chờ xử lý", "amber"],
    ["DH01255", "Phạm Thị Mai", 670000, "Đang đóng gói", "blue"],
    ["DH01254", "Hoàng Đức Long", 1980000, "Chờ xử lý", "amber"],
  ];
  return (
    <div className="animate-in fade-in duration-300">
      <AdmHead title="Tổng quan" sub="Chào mừng bạn trở lại! Đây là tình hình hoạt động của cửa hàng hôm nay."
        action={<div className="border border-adm-line bg-white rounded-lg px-3 py-2 text-xs text-adm-muted">📅 01/10/2026 - 08/10/2026</div>} />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {stats.map(s => (
          <Link key={s.label} to={s.to} className="bg-white border border-adm-line rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className={`${s.bg} w-10 h-10 rounded-full flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className="text-[12px] text-adm-muted">{s.label}</div>
            <div className="text-[22px] font-bold leading-tight">{s.value}</div>
            <div className="text-[11px] text-[#9aa5bd]"><span className={s.up ? "text-[#16a34a]" : "text-[#dc2626]"}>{s.delta}</span> so với tuần trước</div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4 mb-4">
        <AdmCard className="p-4">
          <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-sm">Doanh thu theo ngày</h3><span className="text-[11px] text-adm-primary">● Doanh thu</span></div>
          <AdmArea data={[8, 14, 12, 22, 18, 26, 28, 34]} labels={["01/10", "02/10", "03/10", "04/10", "05/10", "06/10", "07/10", "08/10"]} />
        </AdmCard>
        <AdmCard className="p-4">
          <h3 className="font-bold text-sm mb-4">Tỷ lệ đơn hàng</h3>
          <AdmDonut center="156" sub="đơn hàng" parts={[{ label: "Đã giao", value: 68, color: "#1a6fdb" }, { label: "Đang xử lý", value: 20, color: "#22c55e" }, { label: "Chờ xác nhận", value: 7, color: "#f5a524" }, { label: "Đã hủy", value: 5, color: "#ef4444" }]} />
        </AdmCard>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AdmCard className="p-4">
          <div className="flex justify-between items-center mb-3"><h3 className="font-bold text-sm">Top sản phẩm bán chạy</h3><Link to="/admin/products" className="text-[12px] text-adm-primary">Xem tất cả</Link></div>
          <ul className="space-y-3">
            {top.map(p => (
              <li key={p.name} className="flex items-center gap-3 text-[13px]">
                <span className="w-9 h-9 rounded-lg bg-[#f1f3f8] flex items-center justify-center shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{p.name}</div>
                  <div className="h-1.5 bg-[#eef1f6] rounded-full mt-1.5"><div className="h-full bg-adm-primary rounded-full" style={{ width: `${(p.sold / 124) * 100}%` }} /></div>
                </div>
                <span className="font-semibold w-8 text-right">{p.sold}</span>
              </li>
            ))}
          </ul>
        </AdmCard>
        <AdmCard>
          <div className="flex justify-between items-center p-4 pb-2"><h3 className="font-bold text-sm">Đơn hàng gần đây</h3><Link to="/admin/orders" className="text-[12px] text-adm-primary">Xem tất cả</Link></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className={admTableHead}><tr>{["Mã đơn", "Khách hàng", "Tổng tiền", "Trạng thái"].map(h => <th key={h} className={admTh}>{h}</th>)}</tr></thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r[0]} className="border-t border-adm-line">
                    <td className={`${admTd} font-semibold`}><Link to="/admin/orders" className="hover:text-adm-primary">#{r[0]}</Link></td>
                    <td className={admTd}>{r[1]}</td>
                    <td className={`${admTd} whitespace-nowrap`}>{ordMoney(r[2])}</td>
                    <td className={admTd}><AdmPill tone={r[4]}>{r[3]}</AdmPill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdmCard>
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

type CheckoutCoupon = { code: string; label: string; min?: number; calc: (subtotal: number, shipping: number) => number };
const CHECKOUT_COUPONS: CheckoutCoupon[] = [
  { code: "KH001", label: "Giảm 10% tổng giá trị sản phẩm", calc: (t) => Math.round(t * 0.1) },
  { code: "KH002", label: "Miễn phí vận chuyển", calc: (_t, s) => s },
  { code: "KH005", label: "Giảm 100.000đ cho đơn từ 1.000.000đ", min: 1000000, calc: () => 100000 },
];

function PayOpt({ active, onClick, icon, title, sub }: { active: boolean; onClick: () => void; icon: string; title: string; sub: string }) {
  return (
    <button type="button" onClick={onClick} className={`w-full flex items-center gap-4 p-4 border-2 rounded-2xl text-left transition-all ${active ? 'border-[#1a6fdb] bg-[#f0f5fc] shadow-sm' : 'border-[#e2eaf6] hover:border-[#bcd3f3] hover:bg-[#f8fafd]'}`}>
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${active ? 'bg-white' : 'bg-[#f0f5fc]'}`}>{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-[#1a2236]">{title}</span>
        <span className="block text-xs text-[#6b7a99] mt-0.5">{sub}</span>
      </span>
      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-[#1a6fdb]' : 'border-[#c9d6ea]'}`}>{active && <span className="w-2.5 h-2.5 rounded-full bg-[#1a6fdb]" />}</span>
    </button>
  );
}

function CheckoutPage() {
  const { cartItems, clearCart, showToast } = useOutletContext<{ cartItems: (typeof smartphones[0] & { qty: number })[], clearCart: () => void, showToast: (m: string) => void }>();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = total > 0 ? 30000 : 0;
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<CheckoutCoupon | null>(null);
  const discount = coupon ? Math.min(coupon.calc(total, shipping), total + shipping) : 0;
  const finalTotal = total + shipping - discount;

  const applyCoupon = (raw?: string) => {
    const code = (raw ?? couponInput).trim().toUpperCase();
    if (!code) { showToast("Vui lòng nhập mã khuyến mãi"); return; }
    const found = CHECKOUT_COUPONS.find(x => x.code === code);
    if (!found) { showToast("Mã khuyến mãi không hợp lệ"); return; }
    if (found.min && total < found.min) { showToast(`Đơn tối thiểu ${fmt(found.min)} để dùng mã ${code}`); return; }
    setCoupon(found);
    setCouponInput("");
    showToast(`Đã áp dụng mã ${code}`);
  };
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
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-[#1a6fdb] uppercase mb-1">Bước cuối cùng</p>
        <h1 className="text-3xl font-bold text-[#1a2236]">Thanh toán đơn hàng</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1">
          <div className="bg-white p-6 md:p-7 rounded-3xl border border-[#e2eaf6] shadow-[0_8px_30px_-12px_rgba(26,111,219,0.15)] mb-6">
            <h2 className="text-lg font-bold text-[#1a2236] mb-5 flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-[#1a6fdb] text-white text-sm flex items-center justify-center">1</span>Thông tin giao hàng</h2>
            <form id="checkout-form" className="space-y-4" onSubmit={handleCheckout}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Họ và tên</label>
                  <input required type="text" className="w-full px-4 py-3 bg-[#f8fafd] border border-[#e2eaf6] rounded-xl outline-none transition focus:bg-white focus:border-[#1a6fdb] focus:ring-4 focus:ring-[#1a6fdb]/10" placeholder="VD: Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a2236] mb-1">Số điện thoại</label>
                  <input required type="tel" className="w-full px-4 py-3 bg-[#f8fafd] border border-[#e2eaf6] rounded-xl outline-none transition focus:bg-white focus:border-[#1a6fdb] focus:ring-4 focus:ring-[#1a6fdb]/10" placeholder="VD: 0912345678" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2236] mb-1">Địa chỉ nhận hàng</label>
                <input required type="text" className="w-full px-4 py-3 bg-[#f8fafd] border border-[#e2eaf6] rounded-xl outline-none transition focus:bg-white focus:border-[#1a6fdb] focus:ring-4 focus:ring-[#1a6fdb]/10" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, thành phố..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2236] mb-1">Ghi chú (Tùy chọn)</label>
                <textarea className="w-full px-4 py-3 bg-[#f8fafd] border border-[#e2eaf6] rounded-xl outline-none transition focus:bg-white focus:border-[#1a6fdb] focus:ring-4 focus:ring-[#1a6fdb]/10 resize-none h-24" placeholder="Ghi chú về giao hàng..."></textarea>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 md:p-7 rounded-3xl border border-[#e2eaf6] shadow-[0_8px_30px_-12px_rgba(26,111,219,0.15)]">
            <h2 className="text-lg font-bold text-[#1a2236] mb-5 flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-[#1a6fdb] text-white text-sm flex items-center justify-center">2</span>Phương thức thanh toán</h2>
            <div className="space-y-3">
              <PayOpt active={paymentMethod === 'cod'} onClick={() => setPaymentMethod('cod')} icon="💵" title="Thanh toán khi nhận hàng (COD)" sub="Trả tiền mặt khi shipper giao hàng" />
              
              <PayOpt active={paymentMethod === 'qr'} onClick={() => setPaymentMethod('qr')} icon="📲" title="Chuyển khoản ngân hàng" sub="Quét mã VietQR, xác nhận tự động qua SePay" />
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
                  <p className="text-xs text-[#6b7a99] text-center px-4 mb-3">Sử dụng ứng dụng ngân hàng để quét mã.<br/>Vui lòng kiểm tra kỹ thông báo chuyển khoản.</p>
                  <button type="button" onClick={verifySePayTransaction} disabled={isVerifying} className="px-6 py-2.5 bg-[#f0f5fc] text-[#1a6fdb] font-semibold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                    {isVerifying ? (
                      <><span className="w-4 h-4 border-2 border-[#1a6fdb] border-t-transparent rounded-full animate-spin"></span> Đang kiểm tra...</>
                    ) : "Tôi đã chuyển khoản"}
                  </button>
                  {paymentError && <p className="text-xs text-red-500 text-center mt-3 bg-red-50 p-2 rounded-lg">{paymentError}</p>}
                </div>
              )}

              <PayOpt active={paymentMethod === 'deposit'} onClick={() => setPaymentMethod('deposit')} icon="🏦" title="Đặt cọc qua chuyển khoản" sub="Cọc 50% cho đơn hàng giá trị cao" />
              {paymentMethod === 'deposit' && (
                <div className="p-4 border border-[#e2eaf6] rounded-xl bg-white flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
                  <p className="text-sm font-semibold text-[#1a2236] mb-3">Chuyển khoản Đặt cọc (50% giá trị đơn hàng)</p>
                  <div className="w-64 h-64 bg-white border-2 border-[#1a6fdb] rounded-xl overflow-hidden mb-3 shadow-sm">
                    <img src={`https://qr.sepay.vn/img?bank=${sepayBank}&acc=${sepayAcc}&amount=${finalTotal / 2}&des=${orderId}&template=${sepayTemplate}`} alt="Deposit QR Code" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-[#f0f5fc] p-4 rounded-xl w-full text-sm space-y-2 mb-3 border border-[#e2eaf6]">
                    <div className="flex justify-between border-b border-[#e2eaf6] pb-2"><span className="text-[#6b7a99]">Số tiền đặt cọc:</span><span className="font-bold text-[#1a6fdb]">{fmt(finalTotal / 2)}</span></div>
                    <div className="flex justify-between"><span className="text-[#6b7a99]">Nội dung CK:</span><span className="font-bold text-emerald-600">{orderId}</span></div>
                  </div>
                  <button type="button" onClick={verifySePayTransaction} disabled={isVerifying} className="px-6 py-2.5 bg-[#f0f5fc] text-[#1a6fdb] font-semibold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                    {isVerifying ? (
                      <><span className="w-4 h-4 border-2 border-[#1a6fdb] border-t-transparent rounded-full animate-spin"></span> Đang kiểm tra...</>
                    ) : "Tôi đã đặt cọc"}
                  </button>
                </div>
              )}

              <PayOpt active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} icon="💳" title="Thẻ tín dụng / ghi nợ" sub="Visa, Mastercard, JCB" />
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
          <div className="bg-white p-6 md:p-7 rounded-3xl border border-[#e2eaf6] shadow-[0_8px_30px_-12px_rgba(26,111,219,0.15)] sticky top-24">
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

            <div className="border-t border-[#e2eaf6] pt-5 mb-5">
              <p className="text-sm font-bold text-[#1a2236] mb-3 flex items-center gap-2"><span>🎟️</span>Mã khuyến mãi</p>
              {coupon ? (
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-dashed border-emerald-400 bg-emerald-50">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-emerald-700">{coupon.code}</p>
                    <p className="text-xs text-emerald-700/80 truncate">{coupon.label}</p>
                  </div>
                  <button type="button" onClick={() => setCoupon(null)} className="text-xs font-semibold text-red-500 hover:underline shrink-0">Gỡ bỏ</button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input value={couponInput} onChange={e => setCouponInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }} placeholder="Nhập mã giảm giá" className="flex-1 min-w-0 px-4 py-2.5 text-sm uppercase bg-[#f8fafd] border border-[#e2eaf6] rounded-xl outline-none focus:bg-white focus:border-[#1a6fdb] focus:ring-4 focus:ring-[#1a6fdb]/10" />
                    <button type="button" onClick={() => applyCoupon()} className="px-4 py-2.5 bg-[#0a1a3c] text-white text-sm font-semibold rounded-xl hover:bg-[#11264f] transition-colors">Áp dụng</button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {CHECKOUT_COUPONS.map(x => (
                      <button key={x.code} type="button" onClick={() => applyCoupon(x.code)} className="w-full flex items-center gap-3 text-left p-2.5 rounded-xl border border-[#e2eaf6] hover:border-[#1a6fdb] hover:bg-[#f0f5fc] transition-colors">
                        <span className="px-2 py-1 rounded-md bg-[#1a6fdb]/10 text-[#1a6fdb] text-xs font-bold">{x.code}</span>
                        <span className="text-xs text-[#6b7a99] flex-1">{x.label}</span>
                        <span className="text-xs font-semibold text-[#1a6fdb]">Dùng</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
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
                <span>Giảm giá{coupon ? ` (${coupon.code})` : ''}</span>
                <span className="font-medium text-emerald-600">- {fmt(discount)}</span>
              </div>
              <div className="flex justify-between items-end border-t border-[#e2eaf6] pt-4">
                <span className="font-bold text-[#1a2236] text-base">Tổng cộng</span>
                <span className="font-bold text-[#1a6fdb] text-2xl">{fmt(finalTotal)}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" disabled={isVerifying && paymentMethod === 'qr'} className="w-full mt-6 py-3.5 bg-[#1a6fdb] text-white font-bold rounded-xl hover:bg-[#1558b0] transition-colors shadow-md shadow-blue-500/20 disabled:opacity-70">
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


const MOCK_ORDERS = [
  { id: "BBM-001", date: "26/09/2026 14:30", user: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "0901234567", total: 32999000, paymentStatus: "Đã thanh toán", fulfillmentStatus: "Đã giao", paymentMethod: "Chuyển khoản ngân hàng", color: "emerald", note: "", items: [{ name: "iPhone 16 Pro Max 256GB", img: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-desertTitanium?wid=5120&hei=2880&fmt=p-jpg", qty: 1, price: 32999000 }] },
  { id: "BBM-002", date: "25/09/2026 09:15", user: "Trần Thị B", email: "tranthib@email.com", phone: "0912345678", total: 2500000, paymentStatus: "Chưa thanh toán", fulfillmentStatus: "Đang xử lý", paymentMethod: "Đặt cọc (Chuyển khoản)", color: "blue", note: "Giao hàng buổi sáng", items: [{ name: "Tai nghe Sony WH-1000XM5", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200", qty: 1, price: 2500000 }] },
  { id: "BBM-003", date: "24/09/2026 16:45", user: "Lê Văn C", email: "levanc@email.com", phone: "0923456789", total: 45000000, paymentStatus: "Chờ thanh toán", fulfillmentStatus: "Chờ xử lý", paymentMethod: "Thẻ tín dụng", color: "amber", note: "", items: [{ name: "MacBook Pro M4 14 inch", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200", qty: 1, price: 45000000 }] },
  { id: "BBM-004", date: "23/09/2026 10:00", user: "Phạm Thị D", email: "phamthid@email.com", phone: "0934567890", total: 12500000, paymentStatus: "Hoàn tiền", fulfillmentStatus: "Đã hủy", paymentMethod: "COD", color: "red", note: "Khách đổi ý", items: [{ name: "Samsung Galaxy S25 Ultra", img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200", qty: 1, price: 12500000 }] },
  { id: "BBM-005", date: "22/09/2026 20:20", user: "Hoàng Văn E", email: "hoangvane@email.com", phone: "0945678901", total: 8900000, paymentStatus: "Đã thanh toán", fulfillmentStatus: "Đã giao", paymentMethod: "Chuyển khoản ngân hàng", color: "emerald", note: "", items: [{ name: "iPad Pro M4 11 inch", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200", qty: 1, price: 8900000 }] },
];

type OrdStatus = "Chờ xử lý" | "Đang đóng gói" | "Đang vận chuyển" | "Đã giao" | "Đã hủy";
const ORD_FLOW: OrdStatus[] = ["Chờ xử lý", "Đang đóng gói", "Đang vận chuyển", "Đã giao"];
const ORD_CATALOG = [
  { name: "Tai nghe Bluetooth AirPods", variant: "Màu trắng / Sạc Default", price: 1200000, icon: "🎧" },
  { name: "Ốp lưng iPhone 14", variant: "Màu đen", price: 150000, icon: "📱" },
  { name: "Củ sạc nhanh 20W", variant: "Trắng", price: 250000, icon: "🔌" },
  { name: "Cáp sạc USB-C 1m", variant: "Đen", price: 120000, icon: "🔗" },
  { name: "Chuột không dây Logitech", variant: "Xám", price: 520000, icon: "🖱️" },
  { name: "Bàn phím cơ Keychron K2", variant: "Switch đỏ", price: 1890000, icon: "⌨️" },
  { name: "Loa Bluetooth JBL Go 3", variant: "Xanh", price: 890000, icon: "🔊" },
];
const ORD_NAMES = ["Nguyễn Văn An", "Trần Thị Bích", "Lê Minh Tuấn", "Phạm Thị Mai", "Hoàng Đức Long", "Đặng Thị Hương", "Vũ Hoàng Nam", "Ngô Thị Lan", "Bùi Văn Hùng", "Trần Quốc Bảo"];
const ORD_PHONES = ["0987 604 321", "0912 345 678", "0367 890 123", "0933 456 789", "0981 234 567", "0378 654 321", "0909 876 543", "0945 321 987", "0911 223 344", "0822 556 677"];
const ORD_TIMES = ["14:32", "13:20", "11:05", "16:45", "15:12", "10:30", "17:20", "14:10", "09:45", "18:30"];
const ORD_PENDING_STATUS: OrdStatus[] = ["Chờ xử lý", "Đang đóng gói", "Chờ xử lý", "Đang đóng gói", "Chờ xử lý", "Đang vận chuyển", "Chờ xử lý", "Đang đóng gói", "Chờ xử lý", "Đang vận chuyển"];

function buildOrders() {
  const out: any[] = [];
  const make = (n: number, i: number, status: OrdStatus) => {
    const items = i === 1 && n === 1257
      ? [ORD_CATALOG[0], ORD_CATALOG[1], ORD_CATALOG[2]].map(p => ({ ...p, qty: 1 }))
      : Array.from({ length: 1 + (i % 3) }, (_, k) => ({ ...ORD_CATALOG[(i + k * 2) % ORD_CATALOG.length], qty: 1 + ((i + k) % 2) }));
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = 30000;
    const discount = n === 1257 ? 740000 : i % 3 === 0 ? 0 : Math.round(subtotal * 0.1 / 1000) * 1000;
    const day = 8 - Math.floor(i / 2);
    const d = new Date(2025, 9, Math.max(1, day));
    return {
      id: "DH" + String(n).padStart(5, "0"),
      customer: ORD_NAMES[i % 10], phone: ORD_PHONES[i % 10], time: ORD_TIMES[i % 10],
      date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }),
      status, items, subtotal, shipping, discount, total: subtotal + shipping - discount,
      email: ORD_NAMES[i % 10].split(" ").pop()!.toLowerCase() + "@example.com",
      address: `${123 + i} Nguyễn Văn Cừ, P. An Khánh, TP. HCM`,
      tracking: "GHN" + (123456789 - i * 37),
      note: i % 2 === 0 ? "Khách hàng ghi chú: Giao giờ hành chính, vui lòng gọi trước khi giao." : "Khách hàng ghi chú: Kiểm tra hàng trước khi thanh toán.",
    };
  };
  for (let i = 0; i < 48; i++) out.push(make(1258 - i, i, ORD_PENDING_STATUS[i % 10]));
  for (let i = 0; i < 108; i++) out.push(make(1210 - i, i + 3, "Đã giao"));
  for (let i = 0; i < 3; i++) out.push(make(1100 - i, i + 5, "Đã hủy"));
  return out;
}

const ordMoney = (n: number) => n.toLocaleString("vi-VN") + "đ";
const ordBadge: Record<OrdStatus, string> = {
  "Chờ xử lý": "bg-[#fff1d6] text-[#b26a00]",
  "Đang đóng gói": "bg-[#e3eeff] text-[#1a6fdb]",
  "Đang vận chuyển": "bg-[#dcf7e8] text-[#15803d]",
  "Đã giao": "bg-[#dcf7e8] text-[#15803d]",
  "Đã hủy": "bg-[#fde4e4] text-[#c62828]",
};

function AdminOrders() {
  const ctx = useOutletContext<any>();
  const showToast = ctx?.showToast ?? (() => {});
  const [orders, setOrders] = useState(buildOrders);
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("DH01257");
  const PER = 10;

  const pendingCount = orders.filter(o => o.status !== "Đã giao" && o.status !== "Đã hủy").length;
  const doneCount = orders.filter(o => o.status === "Đã giao").length;
  const cancelCount = orders.filter(o => o.status === "Đã hủy").length;

  const list = orders.filter(o => {
    const inTab = tab === "pending" ? o.status !== "Đã giao" && o.status !== "Đã hủy" : o.status === "Đã giao";
    const q = search.trim().toLowerCase();
    const matchQ = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""));
    return inTab && matchQ && (statusFilter === "all" || o.status === statusFilter);
  });
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const cur = Math.min(page, pages);
  const rows = list.slice((cur - 1) * PER, cur * PER);
  const selected = orders.find(o => o.id === selectedId) ?? rows[0] ?? orders[0];

  const update = (id: string, status: OrdStatus) => setOrders(os => os.map(o => (o.id === id ? { ...o, status } : o)));
  const advance = () => {
    const idx = ORD_FLOW.indexOf(selected.status);
    if (idx < 0 || idx === ORD_FLOW.length - 1) return showToast("Đơn hàng không thể cập nhật thêm.");
    update(selected.id, ORD_FLOW[idx + 1]);
    showToast(`Đã cập nhật: ${ORD_FLOW[idx + 1]}`);
  };
  const cancel = () => {
    if (selected.status === "Đã giao" || selected.status === "Đã hủy") return showToast("Không thể hủy đơn này.");
    update(selected.id, "Đã hủy");
    showToast(`Đã hủy đơn ${selected.id}`);
  };
  const exportCsv = () => {
    const csv = ["Mã đơn,Khách hàng,Ngày đặt,Tổng tiền,Trạng thái", ...list.map(o => `${o.id},${o.customer},${o.date} ${o.time},${o.total},${o.status}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = "don-hang.csv";
    a.click();
    showToast("Đã xuất file Excel");
  };

  const stats = [
    { label: "Tổng đơn hàng", value: pendingCount + doneCount, delta: "", icon: "🛒", bg: "bg-[#e3eeff]" },
    { label: "Đơn chưa giao", value: pendingCount, delta: "▲ 8%", icon: "📦", bg: "bg-[#dcf7e8]" },
    { label: "Đơn đã giao", value: doneCount, delta: "▲ 15%", icon: "✉️", bg: "bg-[#ece6ff]" },
    { label: "Đơn hủy", value: cancelCount, delta: "▼ 25%", icon: "✖", bg: "bg-[#fde4e4]" },
  ];

  return (
    <div className="animate-in fade-in duration-300 text-[#1a2236]">
      <h1 className="text-[26px] font-bold leading-tight">Quản lý đơn hàng</h1>
      <p className="text-sm text-[#6b7a99] mb-4">Theo dõi và xử lý các đơn hàng từ khách hàng</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-[#e6eaf2] rounded-lg p-3 flex items-center gap-3">
            <div className={`${s.bg} w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0`}>{s.icon}</div>
            <div className="min-w-0">
              <div className="text-[13px] text-[#6b7a99]">{s.label}</div>
              <div className="text-[26px] font-bold leading-none my-0.5">{s.value}</div>
              <div className="text-[11px] text-[#9aa5bd] whitespace-nowrap">
                {s.delta && <span className={s.delta.startsWith("▲") ? "text-[#16a34a] mr-1" : "text-[#dc2626] mr-1"}>{s.delta}</span>}so với tuần trước
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e6eaf2] rounded-lg p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex gap-5 mr-auto border-b border-transparent">
            {([["pending", "Đơn chưa giao", pendingCount], ["done", "Đơn đã giao", doneCount]] as const).map(([k, label, n]) => (
              <button key={k} onClick={() => { setTab(k); setPage(1); }}
                className={`pb-2 text-sm font-semibold flex items-center gap-1.5 border-b-2 -mb-px ${tab === k ? "text-[#1a6fdb] border-[#1a6fdb]" : "text-[#6b7a99] border-transparent"}`}>
                {label}
                <span className={`text-[11px] px-1.5 rounded-full ${tab === k ? "bg-[#1a6fdb] text-white" : "bg-[#eef1f6] text-[#6b7a99]"}`}>{n}</span>
              </button>
            ))}
          </div>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm mã đơn, tên khách hàng, SĐT..."
            className="border border-[#d9dfeb] rounded-md px-3 py-1.5 text-sm outline-none focus:border-[#1a6fdb] w-full sm:w-64" />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-[#d9dfeb] rounded-md px-2 py-1.5 text-sm outline-none focus:border-[#1a6fdb] bg-white">
            <option value="all">Tất cả trạng thái</option>
            {ORD_FLOW.map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={exportCsv} className="border border-[#d9dfeb] rounded-md px-3 py-1.5 text-sm hover:bg-[#f4f6fa]">⬇ Xuất Excel</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* List */}
          <div className="border border-[#e6eaf2] rounded-lg overflow-hidden flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-[12px] text-left">
                <thead className="bg-[#f4f6fa] text-[#4b587a]">
                  <tr>{["Mã đơn", "Khách hàng", "Ngày đặt", "Tổng tiền", "Trạng thái", "Thao tác"].map(h => <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[#6b7a99]">Không có đơn hàng phù hợp.</td></tr>}
                  {rows.map(o => (
                    <tr key={o.id} onClick={() => setSelectedId(o.id)}
                      className={`border-t border-[#eef1f6] cursor-pointer ${selected.id === o.id ? "bg-[#eef4ff]" : "hover:bg-[#f8f9fc]"}`}>
                      <td className="px-3 py-2.5 font-semibold whitespace-nowrap">#{o.id}</td>
                      <td className="px-3 py-2.5"><div className="font-medium">{o.customer}</div><div className="text-[#8a96b0]">{o.phone}</div></td>
                      <td className="px-3 py-2.5 whitespace-nowrap"><div>{o.date}</div><div className="text-[#8a96b0]">{o.time}</div></td>
                      <td className="px-3 py-2.5 font-semibold whitespace-nowrap">{ordMoney(o.total)}</td>
                      <td className="px-3 py-2.5"><span className={`${ordBadge[o.status as OrdStatus]} px-2 py-0.5 rounded text-[11px] whitespace-nowrap`}>{o.status}</span></td>
                      <td className="px-3 py-2.5"><button onClick={e => { e.stopPropagation(); setSelectedId(o.id); }} className="border border-[#d9dfeb] rounded px-4 py-1 hover:bg-white">Xem</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 border-t border-[#eef1f6] text-[12px] text-[#6b7a99]">
              <span>Hiển thị {list.length ? (cur - 1) * PER + 1 : 0} - {Math.min(cur * PER, list.length)} trong {list.length} đơn</span>
              <div className="flex gap-1">
                <button disabled={cur === 1} onClick={() => setPage(cur - 1)} className="w-6 h-6 border border-[#d9dfeb] rounded disabled:opacity-40">‹</button>
                {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-6 h-6 rounded border ${cur === p ? "bg-[#1a6fdb] text-white border-[#1a6fdb]" : "border-[#d9dfeb]"}`}>{p}</button>
                ))}
                <button disabled={cur === pages} onClick={() => setPage(cur + 1)} className="w-6 h-6 border border-[#d9dfeb] rounded disabled:opacity-40">›</button>
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="border border-[#e6eaf2] rounded-lg p-4 text-[12px]">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[16px] font-bold">Chi tiết đơn hàng #{selected.id}</h3>
              <span className={`${ordBadge[selected.status as OrdStatus]} px-2 py-0.5 rounded text-[11px] whitespace-nowrap`}>{selected.status}</span>
            </div>
            <div className="flex items-center justify-between mt-1 mb-3 text-[#6b7a99]">
              <span>Đặt hàng: {selected.date} {selected.time.length === 5 ? selected.time : ""}</span>
              <button onClick={() => showToast("Đang chuẩn bị in đơn hàng...")} className="border border-[#d9dfeb] rounded px-2 py-1 text-[#1a2236] hover:bg-[#f4f6fa]">🖨 In đơn hàng</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#eef1f6] pt-3">
              <div>
                <div className="font-bold mb-1.5">👤 Thông tin khách hàng</div>
                <div className="space-y-0.5 text-[#4b587a]">
                  <div className="font-semibold text-[#1a2236]">{selected.customer}</div>
                  <div>SĐT: {selected.phone}</div>
                  <div>Email: {selected.email}</div>
                  <div>Địa chỉ: {selected.address}</div>
                </div>
              </div>
              <div>
                <div className="font-bold mb-1.5">🚚 Thông tin giao hàng</div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[#4b587a]">
                  <dt>Phương thức:</dt><dd className="text-[#1a2236]">Giao hàng nhanh</dd>
                  <dt>Dự kiến giao:</dt><dd className="text-[#1a2236]">10/10/2025</dd>
                  <dt>Đơn vị vận chuyển:</dt><dd className="text-[#1a2236]">Giao Hàng Nhanh</dd>
                  <dt>Mã vận đơn:</dt><dd className="text-[#1a2236]">{selected.tracking}</dd>
                </dl>
              </div>
            </div>

            <div className="font-bold mt-4 mb-2">Sản phẩm trong đơn</div>
            <div className="border border-[#e6eaf2] rounded overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-[#f4f6fa] text-[#4b587a]">
                  <tr><th className="px-2 py-2 text-left">STT</th><th className="px-2 py-2 text-left">Sản phẩm</th><th className="px-2 py-2 text-center">Số lượng</th><th className="px-2 py-2 text-right">Đơn giá</th><th className="px-2 py-2 text-right">Thành tiền</th></tr>
                </thead>
                <tbody>
                  {selected.items.map((it: any, i: number) => (
                    <tr key={i} className="border-t border-[#eef1f6]">
                      <td className="px-2 py-2">{i + 1}</td>
                      <td className="px-2 py-2"><div className="flex items-center gap-2"><span className="w-8 h-8 rounded bg-[#f1f3f8] flex items-center justify-center text-base shrink-0">{it.icon}</span><div><div className="font-medium">{it.name}</div><div className="text-[#8a96b0]">{it.variant}</div></div></div></td>
                      <td className="px-2 py-2 text-center">{it.qty}</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap">{ordMoney(it.price)}</td>
                      <td className="px-2 py-2 text-right font-bold whitespace-nowrap">{ordMoney(it.price * it.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ml-auto mt-3 w-full sm:w-64 space-y-1 text-[#4b587a]">
              <div className="flex justify-between"><span>Tạm tính</span><span className="font-semibold text-[#1a2236]">{ordMoney(selected.subtotal)}</span></div>
              <div className="flex justify-between"><span>Phí vận chuyển</span><span className="font-semibold text-[#1a2236]">{ordMoney(selected.shipping)}</span></div>
              <div className="flex justify-between"><span>Giảm giá</span><span className="font-semibold text-[#16a34a]">- {ordMoney(selected.discount)}</span></div>
              <div className="flex justify-between items-center bg-[#e3eeff] rounded px-2 py-1.5 text-[#1a2236]"><span className="font-bold">Tổng thanh toán</span><span className="font-bold text-[15px] text-[#1a6fdb]">{ordMoney(selected.total)}</span></div>
            </div>

            <div className="mt-3 text-[#4b587a]"><div className="font-bold text-[#1a2236] mb-0.5">📝 Ghi chú</div>{selected.note}</div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
              <button onClick={cancel} className="border border-[#d9dfeb] rounded-md py-2 font-medium text-[#c62828] hover:bg-[#fff5f5]">✖ Hủy đơn</button>
              <button onClick={advance} className="bg-[#1a6fdb] hover:bg-[#155bb5] text-white rounded-md py-2 font-medium">⟳ Cập nhật trạng thái</button>
              <button onClick={() => showToast("Đang in phiếu giao hàng...")} className="border border-[#d9dfeb] rounded-md py-2 font-medium hover:bg-[#f4f6fa]">🖨 In phiếu giao hàng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOrderDetail() {
  const { id } = useParams();
  const order = MOCK_ORDERS.find(o => o.id === id);
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus ?? "");
  const [fulfillmentStatus, setFulfillmentStatus] = useState(order?.fulfillmentStatus ?? "");
  const [showPayMenu, setShowPayMenu] = useState(false);
  const [showFulMenu, setShowFulMenu] = useState(false);
  const ctx = useOutletContext<any>();
  const showToast = ctx?.showToast ?? (() => {});

  if (!order) return <div className="p-8 text-center text-[#6b7a99]">Không tìm thấy đơn hàng.</div>;

  const payOptions = ["Chưa thanh toán", "Đã thanh toán", "Chờ thanh toán", "Hoàn tiền"];
  const fulOptions = ["Chờ xử lý", "Đang xử lý", "Sẵn sàng giao", "Đang giao hàng", "Đã giao", "Đã hủy"];

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-[#1a2236] pb-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[28px] font-extrabold tracking-tight mb-3">Đơn hàng #{order.id}</h2>
        <div className="flex gap-6 text-[13px] font-medium text-[#1a6fdb]">
          <button onClick={() => showToast("Đang chuẩn bị in đơn hàng...")} className="hover:underline">In đơn hàng</button>
          <button onClick={() => showToast("Cập nhật...")} className="hover:underline flex items-center gap-1">Cập nhật <span>▾</span></button>
          <button onClick={() => showToast("Quản lý hóa đơn thuế...")} className="hover:underline flex items-center gap-1">Quản lý hóa đơn thuế <span>▾</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Card (Status) */}
          <div className="bg-[#e9ecef] rounded-lg p-5">
            <div className="flex justify-between items-center mb-8">
              <div className="text-[17px] font-bold">
                {fmt(order.total)} — {order.date}
              </div>
              <button 
                onClick={() => { setFulfillmentStatus("Sẵn sàng giao"); showToast("Đã cập nhật: Sẵn sàng giao"); }}
                className="px-4 py-1.5 border border-[#c1c7d0] text-[13px] font-semibold rounded hover:bg-[#dfe3e8] transition-colors bg-transparent"
              >
                Đánh dấu sẵn sàng giao
              </button>
            </div>
            
            <div className="flex gap-16">
              <div className="relative">
                <p className="text-[13px] text-[#5c6ac4] mb-1 font-medium">Trạng thái thanh toán</p>
                <button 
                  onClick={() => setShowPayMenu(!showPayMenu)} 
                  className={`flex items-center gap-1 text-[14px] font-semibold hover:opacity-80 ${paymentStatus === 'Đã thanh toán' ? 'text-[#007f5f]' : 'text-[#1a2236]'}`}
                >
                  {paymentStatus} <span>▾</span>
                </button>
                {showPayMenu && (
                  <div className="absolute top-8 left-0 z-20 bg-white border border-[#c1c7d0] rounded shadow-lg py-1 min-w-[150px]">
                    {payOptions.map(opt => (
                      <button key={opt} onClick={() => { setPaymentStatus(opt); setShowPayMenu(false); showToast(`Cập nhật: ${opt}`); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f4f6f8]">
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <p className="text-[13px] text-[#5c6ac4] mb-1 font-medium">Trạng thái giao hàng</p>
                <button 
                  onClick={() => setShowFulMenu(!showFulMenu)} 
                  className="flex items-center gap-1 text-[14px] font-semibold text-[#1a6fdb] hover:opacity-80"
                >
                  {fulfillmentStatus} <span>▾</span>
                </button>
                {showFulMenu && (
                  <div className="absolute top-8 left-0 z-20 bg-white border border-[#c1c7d0] rounded shadow-lg py-1 min-w-[150px]">
                    {fulOptions.map(opt => (
                      <button key={opt} onClick={() => { setFulfillmentStatus(opt); setShowFulMenu(false); showToast(`Cập nhật: ${opt}`); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f4f6f8]">
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Card (Notes) */}
          <div className="bg-[#e9ecef] rounded-lg p-5">
            <div className="bg-white p-4 mb-4 text-[13px]">
              <p className="font-semibold mb-2">Bạn biết đến cửa hàng từ đâu?</p>
              <p className="text-[#454f5b]">Bạn bè giới thiệu</p>
            </div>
            <button onClick={() => showToast("Thêm ghi chú")} className="text-[#1a6fdb] text-[14px] font-medium hover:underline flex items-center gap-1">
              + Thêm ghi chú
            </button>
          </div>

          {/* Bottom Card (Items) */}
          <div className="bg-[#e9ecef] rounded-lg p-5">
            <h3 className="text-[14px] font-semibold mb-5">Sản phẩm đặt hàng: {order.items.length}</h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <img src={item.img} alt={item.name} className="w-16 h-16 object-cover bg-white p-1" />
                  <div className="flex-1">
                    <p className="text-[14px] font-bold mb-1">{item.name}</p>
                    <p className="text-[13px] text-[#454f5b] mb-1">Số lượng: {item.qty}</p>
                    <button className="text-[13px] text-[#454f5b] hover:text-[#1a2236]">Thêm thiệp với nội dung: —</button>
                  </div>
                  <p className="text-[14px] font-bold">{fmt(item.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tax invoices */}
          <div className="bg-[#e9ecef] rounded-lg p-5 relative">
            <h3 className="text-[13px] text-[#5c6ac4] font-medium mb-3">Hóa đơn thuế</h3>
            <button className="absolute top-5 right-4 text-gray-500 hover:text-black">•••</button>
            <div className="mb-4">
              <p className="text-[13px] font-bold mb-1">Hóa đơn thuế thông thường #{order.id}-N</p>
              <p className="text-[12px] text-[#454f5b] mb-2">{order.date.split(' ')[0]}</p>
              <div className="flex gap-4 text-[13px] text-[#1a6fdb]">
                <button className="hover:underline">Tải PDF</button>
                <button className="hover:underline">In</button>
              </div>
            </div>
            <button className="text-[13px] text-[#1a6fdb] hover:underline">Tạo hóa đơn khác</button>
          </div>

          {/* Customer */}
          <div className="bg-[#e9ecef] rounded-lg p-5">
            <h3 className="text-[13px] text-[#5c6ac4] font-medium mb-3">Khách hàng</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#20c997] rounded-full flex items-center justify-center text-white font-bold text-[15px]">
                {order.user.charAt(0)}
              </div>
              <div>
                <p className="text-[14px] font-bold">{order.user}</p>
              </div>
            </div>
            <div className="mt-3 w-16 h-2 bg-gray-300"></div>
          </div>

          {/* Pickup method */}
          <div className="bg-[#e9ecef] rounded-lg p-5 relative">
            <h3 className="text-[13px] text-[#5c6ac4] font-medium mb-3">Phương thức nhận hàng</h3>
            <div className="absolute top-5 right-5 text-[#1a6fdb] text-xl">🛍️</div>
            <p className="text-[13px] mb-2">Lựa chọn của khách hàng: <span className="font-semibold">Nhận tại cửa hàng</span></p>
            <p className="text-[13px]">Khối lượng: 0.5 kg</p>
          </div>

          {/* Payment details */}
          <div className="bg-[#e9ecef] rounded-lg p-5 relative">
            <h3 className="text-[13px] text-[#5c6ac4] font-medium mb-3">Chi tiết thanh toán</h3>
            <div className="absolute top-5 right-5 text-[#1a6fdb] text-xl">💳</div>
            <p className="text-[13px]">Thanh toán bằng {order.paymentMethod || "hóa đơn"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminProducts() {
  // Dữ liệu khởi tạo (Mock data)
  const initialProducts = smartphones.slice(0, 4).concat(laptops.slice(0, 4)).map((p, index) => ({
    ...p, 
    id: index.toString(),
    stock: [25, 50, 35, 40, 20, 15, 8, 28][index % 8], 
    category: p.price > 20000000 ? "Laptop" : "Điện thoại"
  }));

  const [products, setProducts] = useState(initialProducts);
  const [pq, setPq] = useState("");
  const [pCat, setPCat] = useState("Tất cả danh mục");
  const [pStatus, setPStatus] = useState("Tất cả trạng thái");
  const [pPage, setPPage] = useState(1);
  const PP = 8;
  const stockStatus = (n: number): [string, string] => (n > 10 ? ["Còn hàng", "green"] : n > 0 ? ["Sắp hết", "amber"] : ["Hết hàng", "red"]);
  const pFiltered = products.filter(p => p.name.toLowerCase().includes(pq.toLowerCase()) && (pCat === "Tất cả danh mục" || p.category === pCat) && (pStatus === "Tất cả trạng thái" || stockStatus(p.stock)[0] === pStatus));
  const pPages = Math.max(1, Math.ceil(pFiltered.length / PP));
  const pCur = Math.min(pPage, pPages);
  const pRows = pFiltered.slice((pCur - 1) * PP, pCur * PP);
  const ctx = useOutletContext<any>();
  const showToast = ctx?.showToast ?? (() => {});
  type PForm = { name: string; brand: string; category: string; price: number; original: number; stock: number; img: string; album: string[]; attrs: { k: string; v: string }[]; short: string; content: string; show: boolean; sku: string };
  const blankForm = (): PForm => ({ name: "", brand: "BigBangMart", category: "Điện thoại", price: 0, original: 0, stock: 0, img: "", album: [], attrs: [{ k: "Bảo hành", v: "12 tháng" }], short: "", content: "", show: true, sku: "BBM" + Math.floor(1000 + Math.random() * 9000) });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"info" | "album" | "attrs">("info");
  const [formData, setFormData] = useState<PForm>(blankForm);
  const upd = (patch: Partial<PForm>) => setFormData(f => ({ ...f, ...patch }));

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      setProducts(products.filter(p => p.id !== id));
      showToast("Đã xóa sản phẩm");
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({ ...blankForm(), name: p.name, brand: p.brand ?? "BigBangMart", category: p.category, price: Number(p.price), original: Number(p.original || p.price), stock: p.stock, img: p.img, album: p.album ?? [], attrs: p.attrs ?? [], short: p.short ?? "", content: p.content ?? "", show: p.show ?? true, sku: p.sku ?? "BBM" + (7000 + Number(p.id)) });
    setTab("info");
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(blankForm());
    setTab("info");
    setIsModalOpen(true);
  };

  const readFile = (file: File | undefined, cb: (url: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return showToast("Vui lòng chọn file ảnh", true);
    const r = new FileReader();
    r.onload = () => cb(String(r.result));
    r.readAsDataURL(file);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.name.trim()) { setTab("info"); return showToast("Vui lòng nhập tên sản phẩm", true); }
    if (formData.price <= 0) { setTab("info"); return showToast("Giá bán phải lớn hơn 0", true); }
    const original = formData.original > 0 ? formData.original : formData.price;
    const off = original > formData.price ? Math.round((1 - formData.price / original) * 100) : 0;
    const data = { ...formData, name: formData.name.trim(), original, attrs: formData.attrs.filter(a => a.k.trim()) };
    if (editingId) {
      setProducts(products.map(p => (p.id === editingId ? { ...p, ...data, off } : p)));
    } else {
      setProducts([{ ...data, id: Math.random().toString(), off } as any, ...products]);
    }
    showToast(editingId ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm mới");
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-300 font-[sans-serif]">
      {/* Header */}
      <AdmHead title="Sản phẩm" sub="Quản lý sản phẩm trên cửa hàng" action={<AdmPrimaryBtn onClick={handleAdd}>+ Thêm sản phẩm</AdmPrimaryBtn>} />

      <AdmCard>
        <div className="p-4 flex flex-wrap gap-3">
          <AdmSearch value={pq} onChange={v => { setPq(v); setPPage(1); }} placeholder="Tìm tên sản phẩm, mã SP..." className="flex-1 min-w-[220px]" />
          <AdmSelect value={pCat} onChange={v => { setPCat(v); setPPage(1); }} options={["Tất cả danh mục", "Điện thoại", "Laptop", "Máy tính bảng", "Âm thanh", "Phụ kiện"]} />
          <AdmSelect value={pStatus} onChange={v => { setPStatus(v); setPPage(1); }} options={["Tất cả trạng thái", "Còn hàng", "Sắp hết", "Hết hàng"]} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className={admTableHead}>
              <tr><th className={admTh}>Ảnh</th><th className={admTh}>Tên sản phẩm</th><th className={admTh}>Danh mục</th><th className={admTh}>Giá bán</th><th className={admTh}>Tồn kho</th><th className={admTh}>Trạng thái</th><th className={`${admTh} text-right`}>Thao tác</th></tr>
            </thead>
            <tbody>
              {pRows.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-adm-muted">Không tìm thấy sản phẩm.</td></tr>}
              {pRows.map((p, i) => {
                const st = stockStatus(p.stock);
                return (
                  <tr key={p.id} className="border-t border-adm-line hover:bg-[#f8f9fc]">
                    <td className={admTd}><div className="w-11 h-11 rounded-lg bg-[#f1f3f8] overflow-hidden flex items-center justify-center">{p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-contain" /> : "📦"}</div></td>
                    <td className={admTd}><div className="font-medium max-w-[260px] truncate">{p.name}</div><div className="text-[11px] text-adm-muted">{(p as any).sku ?? "SP" + String(((pPage - 1) * PP) + i + 1).padStart(3, "0")}</div></td>
                    <td className={`${admTd} text-adm-muted`}>{p.category}</td>
                    <td className={`${admTd} whitespace-nowrap`}>{ordMoney(Number(p.price))}</td>
                    <td className={admTd}>{p.stock}</td>
                    <td className={admTd}><AdmPill tone={st[1]}>{st[0]}</AdmPill></td>
                    <td className={`${admTd} text-right whitespace-nowrap`}>
                      <AdmIconBtn tone="blue" title="Sửa" onClick={() => handleEdit(p)}>✎</AdmIconBtn>
                      <AdmIconBtn tone="red" title="Xóa" onClick={() => handleDelete(p.id)}>🗑</AdmIconBtn>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <AdmPager page={pCur} pages={pPages} total={pFiltered.length} per={PP} onPage={setPPage} unit="sản phẩm" />
      </AdmCard>

      {/* Modal Thêm/Sửa Sản phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1a3c]/50 backdrop-blur-[2px] p-3 sm:p-6" onMouseDown={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 pt-5 pb-0 border-b border-adm-line shrink-0">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-[18px] font-bold leading-tight">{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
                  <p className="text-[12px] text-adm-muted">{editingId ? formData.sku : "Điền thông tin để đăng bán sản phẩm trên cửa hàng"}</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-[#eef1f6] text-adm-muted">✕</button>
              </div>
              <div className="flex gap-6">
                {([["info", "Thông tin"], ["album", `Album hình (${formData.album.length})`], ["attrs", `Thuộc tính (${formData.attrs.length})`]] as const).map(([k, l]) => (
                  <button key={k} type="button" onClick={() => setTab(k)} className={`pb-3 text-sm font-semibold border-b-2 -mb-px ${tab === k ? "text-adm-primary border-adm-primary" : "text-adm-muted border-transparent hover:text-adm-ink"}`}>{l}</button>
                ))}
              </div>
            </div>

            <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-[#f8f9fc] p-4 sm:p-6">
              {tab === "info" && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
                  <div className="bg-white border border-adm-line rounded-xl p-5 space-y-4">
                    <AdmField label="Tên sản phẩm" required><input autoFocus value={formData.name} onChange={e => upd({ name: e.target.value })} className={admInput} placeholder="Nhập tên sản phẩm..." /></AdmField>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AdmField label="Đường dẫn"><div className="flex items-center border border-adm-line rounded-lg bg-[#f6f8fc] overflow-hidden"><span className="px-3 text-adm-muted text-sm">/</span><input readOnly value={toSlug(formData.name)} placeholder="tu-dong-tao" className="flex-1 py-2 pr-3 text-sm bg-transparent outline-none text-adm-muted" /></div></AdmField>
                      <AdmField label="Thương hiệu"><input value={formData.brand} onChange={e => upd({ brand: e.target.value })} className={admInput} /></AdmField>
                    </div>
                    <AdmField label="Mô tả ngắn">
                      <textarea rows={3} maxLength={200} value={formData.short} onChange={e => upd({ short: e.target.value })} className={`${admInput} resize-none`} placeholder="Nhập dòng mô tả ngắn về sản phẩm..." />
                      <div className="text-right text-[11px] text-adm-muted mt-0.5">{formData.short.length}/200</div>
                    </AdmField>
                    <AdmField label="Nội dung chi tiết"><textarea rows={8} value={formData.content} onChange={e => upd({ content: e.target.value })} className={`${admInput} resize-y`} placeholder="Nhập nội dung thông tin sản phẩm chi tiết..." /></AdmField>
                  </div>

                  <div className="space-y-5">
                    <div className="bg-white border border-adm-line rounded-xl p-4">
                      <div className="text-[12px] text-adm-muted mb-2">Hình ảnh chính</div>
                      <div className="aspect-[4/3] rounded-lg border border-dashed border-[#c9d3e6] bg-[#f6f8fc] flex items-center justify-center overflow-hidden relative">
                        {formData.img ? <img src={formData.img} alt="Xem trước" className="w-full h-full object-contain" /> : <div className="text-center text-adm-muted text-sm"><div className="text-3xl mb-1">🖼️</div>Chưa có ảnh</div>}
                        {formData.img && <button type="button" onClick={() => upd({ img: "" })} className="absolute top-2 right-2 w-7 h-7 rounded-md bg-white/90 shadow text-red-500">🗑</button>}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <label className="bg-adm-primary hover:bg-[#155bb5] text-white text-sm font-medium rounded-lg py-2 text-center cursor-pointer">⬆ Tải ảnh lên<input type="file" accept="image/*" hidden onChange={e => { readFile(e.target.files?.[0], url => upd({ img: url })); e.target.value = ""; }} /></label>
                        <button type="button" onClick={() => { const u = prompt("Nhập URL hình ảnh:"); if (u) upd({ img: u }); }} className="border border-adm-line rounded-lg py-2 text-sm hover:bg-[#f4f6fa]">🔗 Dùng URL</button>
                      </div>
                    </div>

                    <div className="bg-white border border-adm-line rounded-xl p-4 space-y-3">
                      <AdmField label="Danh mục"><AdmSelect value={formData.category} onChange={v => upd({ category: v })} options={["Điện thoại", "Laptop", "Máy tính bảng", "Âm thanh", "Phụ kiện"]} /></AdmField>
                      <div className="grid grid-cols-2 gap-3">
                        <AdmField label="Mã sản phẩm"><input readOnly value={formData.sku} className={`${admInput} bg-[#f6f8fc] text-adm-muted`} /></AdmField>
                        <AdmField label="Tồn kho"><input type="number" min={0} value={formData.stock} onChange={e => upd({ stock: Math.max(0, Number(e.target.value)) })} className={admInput} /></AdmField>
                      </div>
                      <div className="text-[12px] text-adm-muted flex items-center gap-2">Tình trạng: <AdmPill tone={stockStatus(formData.stock)[1]}>{stockStatus(formData.stock)[0]}</AdmPill></div>
                      <AdmField label="Giá bán" required><div className="flex items-center border border-adm-line rounded-lg overflow-hidden focus-within:border-adm-primary"><input type="number" min={0} value={formData.price} onChange={e => upd({ price: Number(e.target.value) })} className="flex-1 px-3 py-2 text-sm outline-none min-w-0" /><span className="px-3 py-2 text-xs text-adm-muted bg-[#f6f8fc] border-l border-adm-line">VNĐ</span></div></AdmField>
                      <AdmField label="Giá gốc (trước khuyến mãi)"><div className="flex items-center border border-adm-line rounded-lg overflow-hidden focus-within:border-adm-primary"><input type="number" min={0} value={formData.original} onChange={e => upd({ original: Number(e.target.value) })} className="flex-1 px-3 py-2 text-sm outline-none min-w-0" /><span className="px-3 py-2 text-xs text-adm-muted bg-[#f6f8fc] border-l border-adm-line">VNĐ</span></div></AdmField>
                      {formData.original > formData.price && formData.price > 0 && <div className="text-[12px] text-[#16a34a]">Giảm {Math.round((1 - formData.price / formData.original) * 100)}% · {ordMoney(formData.price)}</div>}
                      <label className="flex items-center justify-between text-sm font-medium cursor-pointer pt-1">Hiển thị trên cửa hàng
                        <input type="checkbox" checked={formData.show} onChange={e => upd({ show: e.target.checked })} className="w-4 h-4 accent-[#1a6fdb]" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {tab === "album" && (
                <div className="bg-white border border-adm-line rounded-xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <p className="text-sm text-adm-muted">Thêm các ảnh phụ để khách xem sản phẩm từ nhiều góc.</p>
                    <div className="flex gap-2">
                      <label className="bg-adm-primary hover:bg-[#155bb5] text-white text-sm font-medium rounded-lg px-4 py-2 cursor-pointer">⬆ Tải ảnh lên<input type="file" accept="image/*" multiple hidden onChange={e => { Array.from(e.target.files ?? []).forEach(f => readFile(f, url => setFormData(fd => ({ ...fd, album: [...fd.album, url] })))); e.target.value = ""; }} /></label>
                      <button type="button" onClick={() => { const u = prompt("Nhập URL hình ảnh:"); if (u) upd({ album: [...formData.album, u] }); }} className="border border-adm-line rounded-lg px-4 py-2 text-sm hover:bg-[#f4f6fa]">🔗 Thêm URL</button>
                    </div>
                  </div>
                  {formData.album.length === 0 ? (
                    <div className="border border-dashed border-[#c9d3e6] rounded-lg py-14 text-center text-adm-muted text-sm bg-[#f6f8fc]">Chưa có ảnh nào trong album</div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.album.map((u, i) => (
                        <div key={i} className="relative aspect-square rounded-lg border border-adm-line bg-[#f6f8fc] overflow-hidden group">
                          <img src={u} alt="" className="w-full h-full object-contain" />
                          <div className="absolute inset-x-0 bottom-0 flex justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50">
                            <button type="button" onClick={() => upd({ img: u })} className="text-[11px] bg-white rounded px-2 py-0.5">Đặt làm ảnh chính</button>
                            <button type="button" onClick={() => upd({ album: formData.album.filter((_, j) => j !== i) })} className="text-[11px] bg-red-500 text-white rounded px-2 py-0.5">Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "attrs" && (
                <div className="bg-white border border-adm-line rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-adm-muted">Thông số kỹ thuật hiển thị ở trang chi tiết sản phẩm.</p>
                    <button type="button" onClick={() => upd({ attrs: [...formData.attrs, { k: "", v: "" }] })} className="border border-adm-line rounded-lg px-4 py-2 text-sm hover:bg-[#f4f6fa]">+ Thêm thuộc tính</button>
                  </div>
                  <div className="space-y-2">
                    {formData.attrs.length === 0 && <div className="border border-dashed border-[#c9d3e6] rounded-lg py-12 text-center text-adm-muted text-sm bg-[#f6f8fc]">Chưa có thuộc tính nào</div>}
                    {formData.attrs.map((a, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1.5fr_auto] gap-2">
                        <input value={a.k} placeholder="Tên (VD: RAM)" onChange={e => upd({ attrs: formData.attrs.map((x, j) => (j === i ? { ...x, k: e.target.value } : x)) })} className={admInput} />
                        <input value={a.v} placeholder="Giá trị (VD: 8GB)" onChange={e => upd({ attrs: formData.attrs.map((x, j) => (j === i ? { ...x, v: e.target.value } : x)) })} className={admInput} />
                        <button type="button" onClick={() => upd({ attrs: formData.attrs.filter((_, j) => j !== i) })} className="w-10 rounded-lg text-red-500 hover:bg-[#fde4e4]">🗑</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>

            <div className="bg-white border-t border-adm-line px-6 py-4 flex justify-between items-center shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-adm-line bg-white text-sm font-medium rounded-lg hover:bg-[#f4f6fa]">← Quay lại</button>
              <button type="submit" form="product-form" className="px-6 py-2 bg-adm-primary hover:bg-[#155bb5] text-white text-sm font-semibold rounded-lg">{editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdmModal({ title, onClose, onSubmit, submitLabel, children }: { title: string; onClose: () => void; onSubmit: () => void; submitLabel: string; children: any }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-adm-line flex items-center justify-between">
          <h3 className="font-bold text-[16px]">{title}</h3>
          <button type="button" onClick={onClose} className="text-adm-muted hover:text-adm-ink text-lg leading-none">✕</button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">{children}</div>
        <div className="px-5 py-3 border-t border-adm-line flex justify-end gap-2 bg-[#f8f9fc] rounded-b-xl">
          <button type="button" onClick={onClose} className="border border-adm-line bg-white rounded-lg px-4 py-2 text-sm hover:bg-[#f4f6fa]">Hủy</button>
          <button type="submit" className="bg-adm-primary hover:bg-[#155bb5] text-white rounded-lg px-5 py-2 text-sm font-medium">{submitLabel}</button>
        </div>
      </form>
    </div>
  );
}
function AdmField({ label, required, children }: { label: string; required?: boolean; children: any }) {
  return <div><label className="block text-[12px] text-adm-muted mb-1">{label}{required && <span className="text-red-500"> *</span>}</label>{children}</div>;
}
const admInput = "w-full border border-adm-line rounded-lg px-3 py-2 text-sm outline-none focus:border-adm-primary bg-white";
const fmtDate = (iso: string) => iso.split("-").reverse().join("/");
const ADM_TODAY = "2026-10-08";

function AdminCategories() {
  const ctx = useOutletContext<any>();
  const showToast = ctx?.showToast ?? (() => {});
  type Cat = { id: number; icon: string; name: string; desc: string; count: number; show: boolean };
  const [rows, setRows] = useState<Cat[]>([
    { id: 1, icon: "🎧", name: "Tai nghe", desc: "Tai nghe không dây, có dây", count: 12, show: true },
    { id: 2, icon: "📱", name: "Điện thoại", desc: "Điện thoại di động, smartphone", count: 18, show: true },
    { id: 3, icon: "🔌", name: "Phụ kiện điện thoại", desc: "Ốp lưng, cáp sạc, củ sạc...", count: 24, show: true },
    { id: 4, icon: "💻", name: "Laptop", desc: "Laptop, MacBook, phụ kiện", count: 8, show: true },
    { id: 5, icon: "📲", name: "Máy tính bảng", desc: "Tablet, iPad, phụ kiện", count: 6, show: true },
    { id: 6, icon: "⌚", name: "Đồng hồ", desc: "Đồng hồ thông minh, vòng tay", count: 5, show: true },
    { id: 7, icon: "🔊", name: "Loa", desc: "Loa Bluetooth, loa vi tính", count: 7, show: false },
    { id: 8, icon: "⌨️", name: "Phụ kiện máy tính", desc: "Bàn phím, chuột, tai nghe...", count: 11, show: true },
  ]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<Cat | null>(null);
  const [isNew, setIsNew] = useState(false);
  const PER = 8;
  const ICONS = ["🎧", "📱", "🔌", "💻", "📲", "⌚", "🔊", "⌨️", "📷", "🖥️", "🎮", "📦"];
  const list = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const cur = Math.min(page, pages);

  const openNew = () => { setIsNew(true); setModal({ id: 0, icon: "📦", name: "", desc: "", count: 0, show: true }); };
  const openEdit = (r: Cat) => { setIsNew(false); setModal({ ...r }); };
  const save = () => {
    if (!modal) return;
    const name = modal.name.trim();
    if (!name) return showToast("Vui lòng nhập tên danh mục", true);
    if (rows.some(r => r.id !== modal.id && r.name.toLowerCase() === name.toLowerCase())) return showToast("Tên danh mục đã tồn tại", true);
    if (isNew) setRows([{ ...modal, id: Date.now(), name }, ...rows]);
    else setRows(rows.map(r => (r.id === modal.id ? { ...modal, name } : r)));
    showToast(isNew ? "Đã thêm danh mục mới" : "Đã cập nhật danh mục");
    setModal(null);
  };
  return (
    <div className="animate-in fade-in duration-300">
      <AdmHead title="Danh mục sản phẩm" action={<AdmPrimaryBtn onClick={openNew}>+ Thêm danh mục</AdmPrimaryBtn>} />
      <AdmCard>
        <div className="p-4"><AdmSearch value={q} onChange={v => { setQ(v); setPage(1); }} placeholder="Tìm danh mục..." className="max-w-md" /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className={admTableHead}><tr><th className={admTh}>Ảnh</th><th className={admTh}>Tên danh mục</th><th className={admTh}>Mô tả</th><th className={admTh}>Số sản phẩm</th><th className={admTh}>Trạng thái</th><th className={`${admTh} text-right`}>Thao tác</th></tr></thead>
            <tbody>
              {list.slice((cur - 1) * PER, cur * PER).map(r => (
                <tr key={r.id} className="border-t border-adm-line hover:bg-[#f8f9fc]">
                  <td className={admTd}><span className="w-10 h-10 rounded-lg bg-[#f1f3f8] flex items-center justify-center text-lg">{r.icon}</span></td>
                  <td className={`${admTd} font-medium`}>{r.name}</td>
                  <td className={`${admTd} text-adm-muted`}>{r.desc}</td>
                  <td className={admTd}>{r.count}</td>
                  <td className={admTd}><button title="Bấm để đổi trạng thái" onClick={() => setRows(rows.map(x => x.id === r.id ? { ...x, show: !x.show } : x))}><AdmPill tone={r.show ? "green" : "gray"}>{r.show ? "Hiển thị" : "Ẩn"}</AdmPill></button></td>
                  <td className={`${admTd} text-right whitespace-nowrap`}>
                    <AdmIconBtn tone="blue" title="Sửa" onClick={() => openEdit(r)}>✎</AdmIconBtn>
                    <AdmIconBtn tone="red" title="Xóa" onClick={() => { if (window.confirm(`Xóa danh mục "${r.name}"?`)) { setRows(rows.filter(x => x.id !== r.id)); showToast(`Đã xóa ${r.name}`); } }}>🗑</AdmIconBtn>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-adm-muted">Không có danh mục.</td></tr>}
            </tbody>
          </table>
        </div>
        <AdmPager page={cur} pages={pages} total={list.length} per={PER} onPage={setPage} unit="danh mục" />
      </AdmCard>
      {modal && (
        <AdmModal title={isNew ? "Thêm danh mục" : "Sửa danh mục"} submitLabel={isNew ? "Thêm danh mục" : "Lưu thay đổi"} onClose={() => setModal(null)} onSubmit={save}>
          <AdmField label="Biểu tượng">
            <div className="flex flex-wrap gap-2">{ICONS.map(i => <button type="button" key={i} onClick={() => setModal({ ...modal, icon: i })} className={`w-10 h-10 rounded-lg text-lg border ${modal.icon === i ? "border-adm-primary bg-[#e3eeff]" : "border-adm-line hover:bg-[#f4f6fa]"}`}>{i}</button>)}</div>
          </AdmField>
          <AdmField label="Tên danh mục" required><input autoFocus className={admInput} value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} placeholder="VD: Tai nghe" /></AdmField>
          <AdmField label="Mô tả"><textarea rows={3} className={admInput} value={modal.desc} onChange={e => setModal({ ...modal, desc: e.target.value })} placeholder="Mô tả ngắn về danh mục" /></AdmField>
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" className="accent-[#1a6fdb]" checked={modal.show} onChange={e => setModal({ ...modal, show: e.target.checked })} /> Hiển thị trên cửa hàng</label>
        </AdmModal>
      )}
    </div>
  );
}

function AdminCustomers() {
  const ctx = useOutletContext<any>();
  const showToast = ctx?.showToast ?? (() => {});
  type Cus = { id: number; name: string; phone: string; email: string; orders: number; spent: number; active: boolean };
  const [rows, setRows] = useState<Cus[]>(ORD_NAMES.concat(["Đỗ Thu Hà", "Mai Quang Huy"]).map((name, i) => ({
    id: i, name, phone: ORD_PHONES[i % 10], email: `${name.split(" ").pop()!.toLowerCase()}${i}@example.com`,
    orders: [5, 3, 2, 6, 4, 2, 7, 3, 5, 4, 1, 2][i], spent: [12500000, 6400000, 3200000, 18900000, 9800000, 2100000, 22400000, 5600000, 11200000, 8700000, 900000, 1800000][i],
    active: i !== 5 && i !== 10,
  })));
  const [q, setQ] = useState("");
  const [f, setF] = useState("Tất cả trạng thái");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<Cus | null>(null);
  const [isNew, setIsNew] = useState(false);
  const PER = 8;
  const list = rows.filter(r => (r.name + r.phone + r.email).toLowerCase().includes(q.toLowerCase()) && (f === "Tất cả trạng thái" || (f === "Hoạt động") === r.active));
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const cur = Math.min(page, pages);

  const openNew = () => { setIsNew(true); setModal({ id: 0, name: "", phone: "", email: "", orders: 0, spent: 0, active: true }); };
  const openEdit = (r: Cus) => { setIsNew(false); setModal({ ...r }); };
  const save = () => {
    if (!modal) return;
    const name = modal.name.trim(), phone = modal.phone.trim(), email = modal.email.trim();
    if (!name) return showToast("Vui lòng nhập họ tên", true);
    if (!/^[0-9 ]{9,12}$/.test(phone)) return showToast("Số điện thoại không hợp lệ", true);
    if (!/^\S+@\S+\.\S+$/.test(email)) return showToast("Email không hợp lệ", true);
    if (rows.some(r => r.id !== modal.id && (r.email.toLowerCase() === email.toLowerCase() || r.phone.replace(/\s/g, "") === phone.replace(/\s/g, "")))) return showToast("SĐT hoặc email đã tồn tại", true);
    const next = { ...modal, name, phone, email };
    if (isNew) setRows([{ ...next, id: Date.now() }, ...rows]);
    else setRows(rows.map(r => (r.id === modal.id ? next : r)));
    showToast(isNew ? "Đã thêm khách hàng" : "Đã cập nhật khách hàng");
    setModal(null);
  };
  return (
    <div className="animate-in fade-in duration-300">
      <AdmHead title="Khách hàng" sub="Quản lý thông tin khách hàng" action={<AdmPrimaryBtn onClick={openNew}>+ Thêm khách hàng</AdmPrimaryBtn>} />
      <AdmCard>
        <div className="p-4 flex flex-wrap gap-3">
          <AdmSearch value={q} onChange={v => { setQ(v); setPage(1); }} placeholder="Tìm tên, SĐT, email..." className="flex-1 min-w-[220px]" />
          <AdmSelect value={f} onChange={v => { setF(v); setPage(1); }} options={["Tất cả trạng thái", "Hoạt động", "Đã khóa"]} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className={admTableHead}><tr><th className={admTh}>Khách hàng</th><th className={admTh}>SĐT</th><th className={admTh}>Email</th><th className={admTh}>Tổng đơn</th><th className={admTh}>Tổng chi tiêu</th><th className={admTh}>Trạng thái</th><th className={`${admTh} text-right`}>Thao tác</th></tr></thead>
            <tbody>
              {list.slice((cur - 1) * PER, cur * PER).map(r => (
                <tr key={r.id} className="border-t border-adm-line hover:bg-[#f8f9fc]">
                  <td className={admTd}><div className="flex items-center gap-2.5"><span className="w-8 h-8 rounded-full bg-[#dbe7fb] text-adm-primary font-semibold flex items-center justify-center text-xs">{r.name.split(" ").pop()!.charAt(0)}</span><span className="font-medium whitespace-nowrap">{r.name}</span></div></td>
                  <td className={`${admTd} whitespace-nowrap`}>{r.phone}</td>
                  <td className={`${admTd} text-adm-muted`}>{r.email}</td>
                  <td className={admTd}>{r.orders}</td>
                  <td className={`${admTd} whitespace-nowrap`}>{ordMoney(r.spent)}</td>
                  <td className={admTd}><AdmPill tone={r.active ? "green" : "red"}>{r.active ? "Hoạt động" : "Đã khóa"}</AdmPill></td>
                  <td className={`${admTd} text-right whitespace-nowrap`}>
                    <AdmIconBtn tone="blue" title="Sửa" onClick={() => openEdit(r)}>✎</AdmIconBtn>
                    <AdmIconBtn tone="gray" title={r.active ? "Khóa" : "Mở khóa"} onClick={() => { setRows(rows.map(x => x.id === r.id ? { ...x, active: !x.active } : x)); showToast(r.active ? `Đã khóa ${r.name}` : `Đã mở khóa ${r.name}`); }}>{r.active ? "🔒" : "🔓"}</AdmIconBtn>
                    <AdmIconBtn tone="red" title="Xóa" onClick={() => { if (window.confirm(`Xóa khách hàng "${r.name}"?`)) { setRows(rows.filter(x => x.id !== r.id)); showToast(`Đã xóa ${r.name}`); } }}>🗑</AdmIconBtn>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-adm-muted">Không tìm thấy khách hàng.</td></tr>}
            </tbody>
          </table>
        </div>
        <AdmPager page={cur} pages={pages} total={list.length} per={PER} onPage={setPage} unit="khách hàng" />
      </AdmCard>
      {modal && (
        <AdmModal title={isNew ? "Thêm khách hàng" : "Sửa khách hàng"} submitLabel={isNew ? "Thêm khách hàng" : "Lưu thay đổi"} onClose={() => setModal(null)} onSubmit={save}>
          <AdmField label="Họ và tên" required><input autoFocus className={admInput} value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} placeholder="Nguyễn Văn A" /></AdmField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdmField label="Số điện thoại" required><input className={admInput} value={modal.phone} onChange={e => setModal({ ...modal, phone: e.target.value })} placeholder="0901 234 567" /></AdmField>
            <AdmField label="Email" required><input className={admInput} value={modal.email} onChange={e => setModal({ ...modal, email: e.target.value })} placeholder="email@example.com" /></AdmField>
          </div>
          <AdmField label="Trạng thái"><AdmSelect value={modal.active ? "Hoạt động" : "Đã khóa"} onChange={v => setModal({ ...modal, active: v === "Hoạt động" })} options={["Hoạt động", "Đã khóa"]} /></AdmField>
        </AdmModal>
      )}
    </div>
  );
}

function AdminPromotions() {
  const ctx = useOutletContext<any>();
  const showToast = ctx?.showToast ?? (() => {});
  type Promo = { code: string; name: string; type: string; value: string; start: string; end: string };
  const [rows, setRows] = useState<Promo[]>([
    { code: "KH001", name: "Giảm giá khai trương", type: "Giảm giá", value: "10%", start: "2026-10-01", end: "2026-10-10" },
    { code: "KH002", name: "Freeship toàn quốc", type: "Miễn phí vận chuyển", value: "-", start: "2026-10-05", end: "2026-10-15" },
    { code: "KH003", name: "Mua 2 tặng 1", type: "Giảm giá combo", value: "1 sản phẩm", start: "2026-10-10", end: "2026-10-20" },
    { code: "KH004", name: "Giảm giá cuối tuần", type: "Giảm giá", value: "15%", start: "2026-09-01", end: "2026-09-30" },
    { code: "KH005", name: "Voucher 100k", type: "Giảm giá", value: "100.000đ", start: "2026-11-01", end: "2026-11-30" },
  ]);
  const statusOf = (r: Promo) => (ADM_TODAY < r.start ? "Sắp diễn ra" : ADM_TODAY > r.end ? "Đã kết thúc" : "Đang diễn ra");
  const tone: Record<string, string> = { "Đang diễn ra": "green", "Sắp diễn ra": "amber", "Đã kết thúc": "gray" };
  const TYPES = ["Giảm giá", "Miễn phí vận chuyển", "Giảm giá combo"];
  const [q, setQ] = useState("");
  const [f, setF] = useState("Tất cả trạng thái");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<Promo | null>(null);
  const [isNew, setIsNew] = useState(false);
  const PER = 8;
  const list = rows.filter(r => (r.name + r.code).toLowerCase().includes(q.toLowerCase()) && (f === "Tất cả trạng thái" || statusOf(r) === f));
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const cur = Math.min(page, pages);

  const openNew = () => { setIsNew(true); setModal({ code: "KH" + String(rows.length + 1).padStart(3, "0"), name: "", type: "Giảm giá", value: "", start: ADM_TODAY, end: ADM_TODAY }); };
  const openEdit = (r: Promo) => { setIsNew(false); setModal({ ...r }); };
  const save = () => {
    if (!modal) return;
    const code = modal.code.trim().toUpperCase(), name = modal.name.trim();
    if (!code || !name) return showToast("Vui lòng nhập mã và tên chương trình", true);
    if (isNew && rows.some(r => r.code === code)) return showToast("Mã khuyến mãi đã tồn tại", true);
    if (modal.end < modal.start) return showToast("Ngày kết thúc phải sau ngày bắt đầu", true);
    if (modal.type !== "Miễn phí vận chuyển" && !modal.value.trim()) return showToast("Vui lòng nhập giá trị khuyến mãi", true);
    const next = { ...modal, code, name, value: modal.type === "Miễn phí vận chuyển" ? "-" : modal.value.trim() };
    if (isNew) setRows([next, ...rows]);
    else setRows(rows.map(r => (r.code === modal.code ? next : r)));
    showToast(isNew ? "Đã tạo khuyến mãi mới" : "Đã cập nhật khuyến mãi");
    setModal(null);
  };
  return (
    <div className="animate-in fade-in duration-300">
      <AdmHead title="Khuyến mãi" sub="Quản lý các chương trình khuyến mãi" action={<AdmPrimaryBtn onClick={openNew}>+ Tạo khuyến mãi</AdmPrimaryBtn>} />
      <AdmCard>
        <div className="p-4 flex flex-wrap gap-3">
          <AdmSearch value={q} onChange={v => { setQ(v); setPage(1); }} placeholder="Tìm tên chương trình, mã KM..." className="flex-1 min-w-[220px]" />
          <AdmSelect value={f} onChange={v => { setF(v); setPage(1); }} options={["Tất cả trạng thái", "Đang diễn ra", "Sắp diễn ra", "Đã kết thúc"]} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className={admTableHead}><tr><th className={admTh}>Mã KM</th><th className={admTh}>Tên chương trình</th><th className={admTh}>Loại</th><th className={admTh}>Giá trị</th><th className={admTh}>Thời gian áp dụng</th><th className={admTh}>Trạng thái</th><th className={`${admTh} text-right`}>Thao tác</th></tr></thead>
            <tbody>
              {list.slice((cur - 1) * PER, cur * PER).map(r => (
                <tr key={r.code} className="border-t border-adm-line hover:bg-[#f8f9fc]">
                  <td className={`${admTd} font-semibold`}>{r.code}</td>
                  <td className={admTd}>{r.name}</td>
                  <td className={`${admTd} text-adm-muted`}>{r.type}</td>
                  <td className={admTd}>{r.value}</td>
                  <td className={`${admTd} whitespace-nowrap`}>{fmtDate(r.start)} - {fmtDate(r.end)}</td>
                  <td className={admTd}><AdmPill tone={tone[statusOf(r)]}>{statusOf(r)}</AdmPill></td>
                  <td className={`${admTd} text-right whitespace-nowrap`}>
                    <AdmIconBtn tone="blue" title="Sửa" onClick={() => openEdit(r)}>✎</AdmIconBtn>
                    <AdmIconBtn tone="red" title="Xóa" onClick={() => { if (window.confirm(`Xóa khuyến mãi ${r.code}?`)) { setRows(rows.filter(x => x.code !== r.code)); showToast(`Đã xóa ${r.code}`); } }}>🗑</AdmIconBtn>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-adm-muted">Không có khuyến mãi.</td></tr>}
            </tbody>
          </table>
        </div>
        <AdmPager page={cur} pages={pages} total={list.length} per={PER} onPage={setPage} unit="khuyến mãi" />
      </AdmCard>
      {modal && (
        <AdmModal title={isNew ? "Tạo khuyến mãi" : `Sửa khuyến mãi ${modal.code}`} submitLabel={isNew ? "Tạo khuyến mãi" : "Lưu thay đổi"} onClose={() => setModal(null)} onSubmit={save}>
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
            <AdmField label="Mã KM" required><input disabled={!isNew} className={`${admInput} disabled:bg-[#f4f6fa] uppercase`} value={modal.code} onChange={e => setModal({ ...modal, code: e.target.value })} /></AdmField>
            <AdmField label="Tên chương trình" required><input autoFocus className={admInput} value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} placeholder="VD: Giảm giá Black Friday" /></AdmField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdmField label="Loại khuyến mãi"><AdmSelect value={modal.type} onChange={v => setModal({ ...modal, type: v })} options={TYPES} /></AdmField>
            <AdmField label="Giá trị" required={modal.type !== "Miễn phí vận chuyển"}><input disabled={modal.type === "Miễn phí vận chuyển"} className={`${admInput} disabled:bg-[#f4f6fa]`} value={modal.type === "Miễn phí vận chuyển" ? "" : modal.value} onChange={e => setModal({ ...modal, value: e.target.value })} placeholder="10% hoặc 100.000đ" /></AdmField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdmField label="Ngày bắt đầu" required><input type="date" className={admInput} value={modal.start} onChange={e => setModal({ ...modal, start: e.target.value })} /></AdmField>
            <AdmField label="Ngày kết thúc" required><input type="date" className={admInput} value={modal.end} min={modal.start} onChange={e => setModal({ ...modal, end: e.target.value })} /></AdmField>
          </div>
        </AdmModal>
      )}
    </div>
  );
}

function AdminReports() {
  const [tab, setTab] = useState("Doanh thu");
  const bars = [14, 18, 12, 24, 20, 30, 26, 36];
  const days = ["01/10", "02/10", "03/10", "04/10", "05/10", "06/10", "07/10", "08/10"];
  const cats = [["Điện thoại", "21.450.000đ", "37%", "📱"], ["Phụ kiện", "15.230.000đ", "26%", "🔌"], ["Laptop", "12.600.000đ", "22%", "💻"], ["Khác", "8.400.000đ", "15%", "📦"]];
  const topProd = [["Tai nghe Bluetooth AirPods", 124], ["Ốp lưng iPhone 14", 98], ["Củ sạc nhanh 20W", 76], ["Chuột không dây", 54]] as const;
  return (
    <div className="animate-in fade-in duration-300">
      <AdmHead title="Báo cáo" sub="Thống kê chi tiết dữ liệu của cửa hàng" action={<div className="border border-adm-line bg-white rounded-lg px-3 py-2 text-xs text-adm-muted">📅 01/10/2026 - 08/10/2026</div>} />
      <AdmCard className="p-4">
        <div className="flex gap-6 border-b border-adm-line mb-4 overflow-x-auto">
          {["Doanh thu", "Đơn hàng", "Sản phẩm bán chạy", "Khách hàng"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pb-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px ${tab === t ? "text-adm-primary border-adm-primary" : "text-adm-muted border-transparent"}`}>{t}</button>
          ))}
        </div>
        {tab === "Sản phẩm bán chạy" ? (
          <ul className="space-y-3 max-w-xl">{topProd.map(([n, v]) => <li key={n} className="text-[13px]"><div className="flex justify-between mb-1"><span>{n}</span><b>{v}</b></div><div className="h-2 bg-[#eef1f6] rounded-full"><div className="h-full bg-adm-primary rounded-full" style={{ width: `${(v / 124) * 100}%` }} /></div></li>)}</ul>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
            <div>
              <h3 className="font-bold text-sm mb-3">{tab === "Đơn hàng" ? "Số đơn theo ngày" : tab === "Khách hàng" ? "Khách hàng mới theo ngày" : "Doanh thu theo ngày"}</h3>
              <div className="flex items-end gap-3 h-48 border-b border-adm-line px-2">
                {bars.map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1" title={`${days[i]}: ${b * (tab === "Doanh thu" ? 1 : tab === "Đơn hàng" ? 1 : 1)}`}>
                    <div className="w-full max-w-[28px] bg-adm-primary rounded-t hover:bg-[#155bb5]" style={{ height: `${(b / 36) * 100}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 px-2 mt-1">{days.map(d => <span key={d} className="flex-1 text-center text-[10px] text-adm-muted">{d}</span>)}</div>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-3">Tỷ lệ thanh toán</h3>
              <AdmDonut center="156" sub="đơn hàng" parts={[{ label: "Chuyển khoản", value: 45, color: "#1a6fdb" }, { label: "Đặt cọc 50%", value: 25, color: "#22c55e" }, { label: "Thẻ", value: 30, color: "#f5a524" }]} />
            </div>
          </div>
        )}
        <h3 className="font-bold text-sm mt-6 mb-3">Doanh thu theo danh mục</h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {cats.map(c => (
            <div key={c[0]} className="border border-adm-line rounded-lg p-3 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-[#e3eeff] flex items-center justify-center">{c[3]}</span>
              <div><div className="text-[12px] text-adm-muted">{c[0]}</div><div className="font-bold text-sm">{c[1]}</div></div>
              <span className="ml-auto text-[11px] text-adm-muted">{c[2]}</span>
            </div>
          ))}
        </div>
      </AdmCard>
    </div>
  );
}

function AdminSettings() {
  const ctx = useOutletContext<any>();
  const showToast = ctx?.showToast ?? (() => {});
  const [tab, setTab] = useState("Thông tin cửa hàng");
  const [form, setForm] = useState({ name: "BigBangMart", email: "support@bigbangmart.com", phone: "0987 654 321", address: "123 Nguyễn Văn Cừ, P. An Khánh, TP. HCM", desc: "Cung cấp các sản phẩm công nghệ chính hãng, chất lượng cao, giá ưu đãi." });
  const [pay, setPay] = useState({ bank: true, deposit: true, card: true });
  const field = "w-full border border-adm-line rounded-lg px-3 py-2 text-sm outline-none focus:border-adm-primary";
  const Label = ({ children }: any) => <label className="block text-[12px] text-adm-muted mb-1">{children}</label>;
  return (
    <div className="animate-in fade-in duration-300">
      <AdmHead title="Cài đặt" sub="Cấu hình hệ thống và thông tin cửa hàng" />
      <AdmCard className="p-4 sm:p-5">
        <div className="flex gap-6 border-b border-adm-line mb-5 overflow-x-auto">
          {["Thông tin cửa hàng", "Thanh toán", "Vận chuyển", "Tài khoản"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pb-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px ${tab === t ? "text-adm-primary border-adm-primary" : "text-adm-muted border-transparent"}`}>{t}</button>
          ))}
        </div>
        {tab === "Thông tin cửa hàng" && (
          <form onSubmit={e => { e.preventDefault(); showToast("Đã lưu thay đổi"); }} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div><Label>Tên cửa hàng</Label><input className={field} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Email liên hệ</Label><input className={field} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Số điện thoại</Label><input className={field} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Địa chỉ</Label><input className={field} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            </div>
            <div className="space-y-3">
              <div><Label>Mô tả cửa hàng</Label><textarea rows={6} className={field} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} /></div>
              <div><Label>Logo cửa hàng</Label><div className="flex items-center gap-3"><BrandLogo className="h-12" /><button type="button" onClick={() => showToast("Chọn ảnh logo")} className="border border-adm-line rounded-lg px-3 py-2 text-sm hover:bg-[#f4f6fa]">Chọn ảnh</button></div></div>
            </div>
            <div className="lg:col-span-2 flex justify-end"><button type="submit" className="bg-adm-primary hover:bg-[#155bb5] text-white rounded-lg px-5 py-2 text-sm font-medium">Lưu thay đổi</button></div>
          </form>
        )}
        {tab === "Thanh toán" && (
          <div className="space-y-3 max-w-xl">
            {([["bank", "Chuyển khoản ngân hàng (SePay QR)"], ["deposit", "Đặt cọc 50%"], ["card", "Thanh toán bằng thẻ"]] as const).map(([k, l]) => (
              <label key={k} className="flex items-center justify-between border border-adm-line rounded-lg px-4 py-3 text-sm cursor-pointer">
                {l}
                <input type="checkbox" checked={pay[k]} onChange={() => { setPay({ ...pay, [k]: !pay[k] }); showToast("Đã cập nhật phương thức thanh toán"); }} className="w-4 h-4 accent-[#1a6fdb]" />
              </label>
            ))}
          </div>
        )}
        {tab === "Vận chuyển" && (
          <div className="space-y-3 max-w-xl">
            {[["Giao hàng nhanh", "30.000đ · 1-2 ngày"], ["Giao hàng tiêu chuẩn", "20.000đ · 3-5 ngày"], ["Nhận tại cửa hàng", "Miễn phí"]].map(([n, d]) => (
              <div key={n} className="flex items-center justify-between border border-adm-line rounded-lg px-4 py-3 text-sm"><span className="font-medium">{n}</span><span className="text-adm-muted">{d}</span></div>
            ))}
          </div>
        )}
        {tab === "Tài khoản" && (
          <form onSubmit={e => { e.preventDefault(); showToast("Đã đổi mật khẩu"); }} className="space-y-3 max-w-md">
            <div><Label>Mật khẩu hiện tại</Label><input type="password" className={field} /></div>
            <div><Label>Mật khẩu mới</Label><input type="password" className={field} /></div>
            <div><Label>Xác nhận mật khẩu mới</Label><input type="password" className={field} /></div>
            <button type="submit" className="bg-adm-primary hover:bg-[#155bb5] text-white rounded-lg px-5 py-2 text-sm font-medium">Đổi mật khẩu</button>
          </form>
        )}
      </AdmCard>
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
      { path: "orders/:id", Component: AdminOrderDetail },
      { path: "products", Component: AdminProducts },
      { path: "categories", Component: AdminCategories },
      { path: "customers", Component: AdminCustomers },
      { path: "promotions", Component: AdminPromotions },
      { path: "reports", Component: AdminReports },
      { path: "settings", Component: AdminSettings },
    ],
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
