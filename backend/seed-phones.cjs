const path = require('node:path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

// Giá và tồn kho minh họa cho danh mục điện thoại.
const phones = [
  ['Apple', 'iPhone 5s', 1490000, 'iphone-5s'],
  ['Apple', 'iPhone 6', 1990000, 'iphone-6'],
  ['Apple', 'iPhone 15', 15990000],
  ['Apple', 'iPhone 16 Pro Max', 29990000],
  ['Samsung', 'Samsung Galaxy S8', 2490000, 'samsung-galaxy-s8'],
  ['Samsung', 'Samsung Galaxy A16 5G', 4490000],
  ['Samsung', 'Samsung Galaxy A36 5G', 7490000],
  ['Samsung', 'Samsung Galaxy S24 FE', 12490000],
  ['Oppo', 'Oppo K1', 2990000, 'oppo-k1'],
  ['Oppo', 'Oppo Reno13 5G', 11990000],
  ['Realme', 'Realme X', 3190000, 'realme-x'],
  ['Realme', 'Realme X2', 3490000],
  ['Google', 'Google Pixel 9a', 10990000],
  ['Xiaomi', 'Xiaomi Redmi Note 14', 4690000],
  ['Xiaomi', 'Xiaomi 15', 18990000],
  ['Vivo', 'Vivo V50 5G', 12990000],
  ['Honor', 'Honor X9c 5G', 7990000],
  ['Motorola', 'Motorola Moto G85 5G', 6190000],
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bigbangmart', {
    serverSelectionTimeoutMS: 5000,
  });
  const products = mongoose.connection.collection('products');
  const now = new Date();
  const category = 'Điện thoại';
  const result = await products.bulkWrite(phones.map(([brand, name, price, image]) => ({
    updateOne: {
      filter: { category, name },
      update: {
        $setOnInsert: {
          category,
          name,
          brand,
          price,
          original: price,
          off: 0,
          stock: 12,
          img: image ? `https://cdn.dummyjson.com/product-images/smartphones/${image}/thumbnail.webp` : '',
          description: `${name}. Giá và tồn kho dùng để minh họa danh mục.`,
          show: true,
          createdAt: now,
          updatedAt: now,
        },
      },
      upsert: true,
    },
  })));
  console.log(`${mongoose.connection.name}: thêm ${result.upsertedCount} điện thoại, đã có ${result.matchedCount}.`);
}

main()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
