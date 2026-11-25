// Adds only clearly marked warehouse samples. Safe to rerun: fixed IDs and references.
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const mongoose = require('mongoose');
const express = require('express');
const request = require('supertest');
const crypto = require('node:crypto');
const id = key => new mongoose.Types.ObjectId(crypto.createHash('sha256').update(`bbm-warehouse-sample-v1:${key}`).digest('hex').slice(0, 24));
async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bigbangmart', { serverSelectionTimeoutMS: 5000 });
  try {
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');
    const app = express(); app.use(express.json());
    const { Receipt } = require('./warehouse')(app, mongoose, Product);
    const Supplier = mongoose.model('Supplier');
    await Receipt.init();
    const now = new Date();
    const suppliers = [
      ['Thiết bị số Minh An', 'Nguyễn Minh An', '0900000001', 'minhan@example.com', 'Địa chỉ mẫu 01, TP. Hồ Chí Minh'],
      ['Laptop Hoàng Gia', 'Trần Thu Hà', '0900000002', 'hoanggia@example.com', 'Địa chỉ mẫu 02, Hà Nội'],
      ['Âm thanh Sao Việt', 'Lê Hải Nam', '0900000003', 'saoviet@example.com', 'Địa chỉ mẫu 03, Đà Nẵng'],
      ['Phụ kiện Công nghệ Xanh', 'Phạm Ngọc Linh', '0900000004', 'congnghexanh@example.com', 'Địa chỉ mẫu 04, TP. Hồ Chí Minh'],
    ];
    for (let i = 0; i < suppliers.length; i++) {
      const [name, contactName, phone, email, address] = suppliers[i];
      await Supplier.collection.updateOne({ _id: id(`supplier-${i}`) }, { $setOnInsert: {
        name: `[Mẫu] ${name}`, contactName, phone, email, address, active: true, createdAt: now, updatedAt: now,
      } }, { upsert: true });
    }
    const products = [
      ['Điện thoại Nova 128GB', 'Điện thoại', 5900000, 10, 8],
      ['Điện thoại Nova Pro 256GB', 'Điện thoại', 8900000, 1, 8],
      ['Laptop Air 14 inch', 'Laptop & Tablet', 15900000, 7, 5],
      ['Tai nghe không dây Air Sound', 'Âm thanh', 1290000, 8, 6],
      ['Loa Bluetooth Mini', 'Âm thanh', 690000, 4, 5],
      ['Sạc nhanh USB-C 30W', 'Phụ kiện & Sạc', 290000, 2, 10],
    ];
    for (let i = 0; i < products.length; i++) {
      const [name, category, price, stock, minStock] = products[i];
      await Product.collection.updateOne({ _id: id(`product-${i}`) }, { $setOnInsert: {
        name: `[Mẫu] ${name}`, sku: `MAU-SKU-00${i + 1}`, category, price, stock, minStock,
        brand: 'Dữ liệu mẫu', description: 'Sản phẩm mẫu để thử chức năng kho.', show: false,
        inventoryMovements: [], createdAt: now, updatedAt: now,
      } }, { upsert: true });
    }
    const batches = [
      { supplier: 0, items: [[0, 12, 4000000], [1, 4, 6500000]], approve: true },
      { supplier: 1, items: [[2, 5, 12000000]], approve: false },
      { supplier: 2, items: [[3, 15, 850000], [4, 10, 420000]], approve: true },
      { supplier: 3, items: [[5, 20, 160000]], approve: true },
    ];
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const supplier = await Supplier.findById(id(`supplier-${batch.supplier}`)).lean();
      const items = batch.items.map(([index, quantity, unitCost]) => ({
        productId: String(id(`product-${index}`)), name: `[Mẫu] ${products[index][0]}`, quantity, unitCost,
      }));
      await Receipt.collection.updateOne({ _id: id(`receipt-${i}`) }, { $setOnInsert: {
        code: `PN-MAU-00${i + 1}`, supplierId: String(supplier._id), supplierName: supplier.name,
        items, totalCost: items.reduce((s, item) => s + item.quantity * item.unitCost, 0),
        note: 'Phiếu nhập mẫu để thử giao diện và báo cáo.', warehouse: i === 2 ? 'Kho mẫu Hà Nội' : 'Kho mẫu TP. Hồ Chí Minh',
        createdBy: 'Quản trị mẫu', status: 'pending', deletedAt: null, createdAt: now, updatedAt: now,
      } }, { upsert: true });
      if (batch.approve) {
        const res = await request(app).post(`/api/stock-imports/${id(`receipt-${i}`)}/approve`).send({ approvedBy: 'Quản trị mẫu' });
        if (res.status !== 200) throw new Error(res.body.message || 'Không duyệt được phiếu mẫu.');
      }
    }
    for (const [index, quantity, type] of [[0, 3, 'export'], [1, 2, 'export'], [3, 8, 'export'], [4, 4, 'export'], [5, 6, 'export'], [5, 1, 'adjust_out']]) {
      const res = await request(app).post('/api/stock-movements').send({
        productId: String(id(`product-${index}`)), quantity, type, requestId: `warehouse-sample-v1-${index}-${type.replace(/_/g, '-')}`,
        reason: type === 'export' ? 'Xuất kho mẫu để xem báo cáo' : 'Kiểm kê mẫu: điều chỉnh giảm 1 sản phẩm',
      });
      if (res.status !== 200) throw new Error(res.body.message || 'Không ghi được giao dịch mẫu.');
    }
    const report = await request(app).get('/api/stock-report');
    if (report.status !== 200) throw new Error(report.body.message);
    const sampleRows = report.body.rows.filter(r => products.some((_, i) => r.productId === String(id(`product-${i}`))));
    const receipts = await Receipt.find({ code: /^PN-MAU-/ }).lean();
    console.log(JSON.stringify({ suppliers: await Supplier.countDocuments({ _id: { $in: suppliers.map((_, i) => id(`supplier-${i}`)) } }),
      sampleProducts: sampleRows.length, receipts: receipts.length,
      approved: receipts.filter(r => r.status === 'approved').length,
      pending: receipts.filter(r => r.status === 'pending').length,
      sampleStock: sampleRows.reduce((s, r) => s + r.current, 0),
      sampleMovements: report.body.movements.filter(m => products.some((_, i) => m.productId === String(id(`product-${i}`)))).length,
    }));
  } finally { await mongoose.disconnect(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
