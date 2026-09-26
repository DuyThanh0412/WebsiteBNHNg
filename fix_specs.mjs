import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const specHelper = `
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

const fmt = (n: number) => \`₫\${n.toLocaleString("vi-VN")}\`;`;

content = content.replace(/const fmt = \(n: number\) => `₫\$\{n\.toLocaleString\("vi-VN"\)\}`;/, specHelper);

// Update ProductPage mapping
const oldSpecMap = `{[
                        ["Màn hình", "Super Retina XDR, OLED, HDR10, 120Hz"],
                        ["Hệ điều hành", "Phiên bản mới nhất"],
                        ["Camera sau", "Chính 48MP & Phụ 12MP, 12MP"],
                        ["Camera trước", "12MP, 3D LiDAR"],
                        ["Chip xử lý", "Vi xử lý đa nhân thế hệ mới"],
                        ["RAM", "Phiên bản 8GB / 12GB / 16GB"],
                        ["Bộ nhớ trong", "256GB / 512GB / 1TB"],
                        ["Pin & Sạc", "Hỗ trợ sạc nhanh, Sạc không dây"],
                      ].map((row, i) => (`;

const newSpecMap = `{getProductSpecs(product.name).map((row, i) => (`;

content = content.replace(oldSpecMap, newSpecMap);

fs.writeFileSync('src/App.tsx', content);
