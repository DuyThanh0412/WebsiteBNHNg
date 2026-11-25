const path = require('node:path');
const mongoose = require('mongoose');
const catalogPhotos = require('./catalog-photos.json');

require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

// Giá và tồn kho minh họa cho cửa hàng demo.
const catalog = {
  'Điện thoại': [
    ['Apple', 'iPhone 14', 11990000],
    ['Samsung', 'Samsung Galaxy A26 5G', 5990000],
    ['Xiaomi', 'Xiaomi Redmi Note 14 Pro 5G', 7990000],
    ['Oppo', 'Oppo A5 Pro 5G', 6490000],
    ['Vivo', 'Vivo V40 5G', 9990000],
    ['Honor', 'Honor 200 5G', 10990000],
  ],
  Laptop: [
    ['Apple', 'MacBook Air 15 M4', 31990000],
    ['ASUS', 'ASUS Vivobook S 14 OLED', 22990000],
    ['Lenovo', 'Lenovo IdeaPad Slim 5', 16490000],
    ['Acer', 'Acer Swift Go 14', 18990000],
    ['HP', 'HP Pavilion Plus 14', 20490000],
    ['MSI', 'MSI Katana 15', 24990000],
  ],
  'Máy tính bảng': [
    ['Apple', 'iPad Air 11 M3', 16990000],
    ['Apple', 'iPad Pro 11 M4', 24990000],
    ['Samsung', 'Samsung Galaxy Tab S9 FE', 8990000],
    ['Xiaomi', 'Xiaomi Redmi Pad Pro', 6490000],
    ['Lenovo', 'Lenovo Tab M11', 4490000],
    ['Honor', 'Honor Pad 9', 6990000],
  ],
  'Âm thanh': [
    ['Sony', 'Sony WH-CH720N', 2290000],
    ['JBL', 'JBL Go 4', 990000],
    ['JBL', 'JBL Tune 770NC', 2490000],
    ['Bose', 'Bose QuietComfort Ultra Headphones', 8990000],
    ['Soundcore', 'Soundcore Liberty 4 NC', 1890000],
    ['Marshall', 'Marshall Emberton II', 3990000],
  ],
  'Đồng hồ thông minh': [
    ['Apple', 'Apple Watch SE 2', 5990000],
    ['Apple', 'Apple Watch Ultra 2', 19990000],
    ['Samsung', 'Samsung Galaxy Watch FE', 3990000],
    ['Garmin', 'Garmin Forerunner 265', 10490000],
    ['Huawei', 'Huawei Watch GT 5', 5490000],
    ['Amazfit', 'Amazfit Bip 5', 1690000],
  ],
  'Phụ kiện': [
    ['Anker', 'Sạc Anker 735 GaNPrime', 1490000],
    ['Anker', 'Pin dự phòng Anker Nano 10.000 mAh', 1090000],
    ['Logitech', 'Chuột Logitech Pebble 2 M350s', 590000],
    ['Keychron', 'Bàn phím Keychron K2 Pro', 2190000],
    ['SanDisk', 'SSD SanDisk Extreme Portable 1TB', 2590000],
    ['UGREEN', 'Hub USB-C UGREEN Revodok 6 trong 1', 790000],
  ],
  Camera: [
    ['Canon', 'Canon EOS R100', 11990000],
    ['Sony', 'Sony Alpha 7 IV', 44990000],
    ['Fujifilm', 'Fujifilm X-T50', 35990000],
    ['Nikon', 'Nikon Z30', 16990000],
    ['DJI', 'DJI Osmo Pocket 3', 12990000],
    ['GoPro', 'GoPro HERO13 Black', 10990000],
  ],
  'Màn hình': [
    ['Dell', 'Dell S2722QC', 7490000],
    ['LG', 'LG 27UP850-W', 8590000],
    ['Samsung', 'Samsung Smart Monitor M7 32 inch', 8490000],
    ['ASUS', 'ASUS TUF Gaming VG249Q3A', 3990000],
    ['AOC', 'AOC 24G4', 3590000],
    ['BenQ', 'BenQ MOBIUZ EX240', 4490000],
  ],
};

// Tên mẫu gốc, phiên bản hoặc gói bán, giá bán và tồn kho minh họa.
const variants = [
  ['iPhone 14', '256 GB', 13990000, 12],
  ['Samsung Galaxy A26 5G', '8 GB / 256 GB', 6790000, 18],
  ['MacBook Air 15 M4', '16 GB / SSD 512 GB', 36990000, 8],
  ['ASUS Vivobook S 14 OLED', 'Kèm túi chống sốc 14 inch', 23490000, 11],
  ['iPad Air 11 M3', 'Wi-Fi 256 GB', 19990000, 10],
  ['iPad Pro 11 M4', 'Wi-Fi 512 GB', 30990000, 7],
  ['Sony WH-CH720N', 'Kèm hộp đựng tai nghe', 2590000, 14],
  ['JBL Go 4', 'Kèm bao bảo vệ loa', 1090000, 20],
  ['Apple Watch SE 2', 'Kèm dây thể thao dự phòng', 6390000, 13],
  ['Garmin Forerunner 265', 'Kèm dây silicone dự phòng', 10990000, 9],
  ['Sạc Anker 735 GaNPrime', 'Kèm cáp USB-C 100 W', 1690000, 22],
  ['Pin dự phòng Anker Nano 10.000 mAh', 'Kèm túi đựng', 1190000, 25],
  ['Canon EOS R100', 'Kèm ống kính RF-S 18–45 mm', 13990000, 6],
  ['Sony Alpha 7 IV', 'Kèm ống kính FE 28–70 mm', 49990000, 5],
  ['Dell S2722QC', 'Kèm tay đỡ màn hình', 8490000, 10],
  ['AOC 24G4', 'Kèm cáp DisplayPort 2 m', 3790000, 16],
];

const replacementPhotos = [
  ['Realme X2', 'https://thumbs.ielectro.es/product/med/21845.webp'],
  ['Oppo Reno13 5G', 'https://www.bigw.com.au/medias/sys_master/images/images/h8d/h8b/81037649575966.jpg'],
  ['Samsung Galaxy A16 5G', 'https://media.ldlc.com/r1600/ld/products/00/06/20/23/LD0006202335.jpg'],
  ['Samsung Galaxy S24 FE', 'https://store.gorecell.ca/cdn/shop/files/b0a619ec95a545a196881141dd3a36fe_1.jpg?v=1734112590&width=1500'],
  ['iPhone 16 Pro Max', 'https://mezon.com.au/cdn/shop/collections/Apple_iPhone_16_Pro_Max.jpg?v=1725970584'],
  ['iPhone 15', 'https://www.dateks.lv/images/pic/2400/2400/039/2251.jpg'],
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bigbangmart', {
    serverSelectionTimeoutMS: 5000,
  });
  const products = mongoose.connection.collection('products');
  const now = new Date();
  console.log('Database:', mongoose.connection.name);

  for (const [category, entries] of Object.entries(catalog)) {
    const result = await products.bulkWrite(entries.map(([brand, name, price]) => ({
      updateOne: {
        filter: { category, name },
        update: {
          $setOnInsert: {
            category, name, brand, price, original: price, off: 0, stock: 12,
            img: '', show: true, createdAt: now, updatedAt: now,
            description: `${name}. Giá và tồn kho dùng để minh họa danh mục.`,
          },
        },
        upsert: true,
      },
    })));
    console.log(`${category}: thêm ${result.upsertedCount}, đã có ${result.matchedCount}.`);
  }

  const photosByName = new Map(catalogPhotos.map(photo => [photo.name, photo]));
  const brandsByName = new Map(Object.values(catalog).flat().map(([brand, name]) => [name, brand]));
  const variantInsert = await products.bulkWrite(variants.map(([model, option, price, stock]) => {
    const { category, img } = photosByName.get(model);
    const name = `${model} — ${option}`;
    return {
      updateOne: {
        filter: { category, name },
        update: {
          $setOnInsert: {
            category, name, brand: brandsByName.get(model), price, original: price, off: 0,
            stock, img, show: true, createdAt: now, updatedAt: now,
            description: `${model} · ${option}. Ảnh hiển thị mẫu sản phẩm chính.`,
          },
        },
        upsert: true,
      },
    };
  }));
  console.log(`Phiên bản và bộ sản phẩm: thêm ${variantInsert.upsertedCount}, đã có ${variantInsert.matchedCount}.`);

  const localPhotos = await products.bulkWrite(catalogPhotos.map(({ category, name, img }) => ({
    updateOne: {
      filter: { category, name, img: { $in: [null, '', img] }, show: { $ne: false } },
      update: { $set: { img } },
    },
  })));
  console.log(`Ảnh đúng model: ${localPhotos.modifiedCount} ảnh mới, ${localPhotos.matchedCount} sản phẩm khớp.`);

  const photos = await products.bulkWrite(replacementPhotos.map(([name, img]) => ({
    updateOne: {
      filter: {
        category: 'Điện thoại',
        name,
        $or: [
          { img: { $in: [null, ''] } },
          { name: 'Realme X2', img: 'https://cdn.dummyjson.com/product-images/smartphones/realme-x2/thumbnail.webp' },
        ],
      },
      update: { $set: { img, updatedAt: now } },
    },
  })));
  console.log(`Cập nhật ${photos.modifiedCount} ảnh điện thoại.`);
}

main()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
