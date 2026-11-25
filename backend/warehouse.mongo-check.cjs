// Run explicitly: node warehouse.mongo-check.cjs
// Uses and removes only a newly generated, isolated test database.
const assert = require('node:assert/strict');
const express = require('express');
const request = require('supertest');
const Mongoose = require('mongoose').Mongoose;
const crypto = require('node:crypto');
async function main() {
  const dbName = `warehouse_check_${crypto.randomBytes(10).toString('hex')}`;
  const mongoose = new Mongoose();
  await mongoose.connect('mongodb://127.0.0.1:27017', { dbName, serverSelectionTimeoutMS: 3000 });
  try {
    const Product = mongoose.model('Product', new mongoose.Schema({ name: String, stock: Number }, { timestamps: true }), 'products');
    const app = express(); app.use(express.json());
    const { Receipt } = require('./warehouse')(app, mongoose, Product);
    await Receipt.init();
    const p = await Product.create({ name: 'Test laptop', stock: 5 });
    const productId = String(p._id);
    let response = await request(app).post('/api/suppliers').send({ name: 'Test supplier', phone: '0900000000' });
    assert.equal(response.status, 201);
    const supplierId = response.body._id;
    response = await request(app).put(`/api/suppliers/${supplierId}`).send({ name: 'Updated supplier', phone: '0911111111' });
    assert.equal(response.body.name, 'Updated supplier');
    response = await request(app).post('/api/stock-imports').send({ supplierId, items: [{ productId, quantity: 3, unitCost: 100 }] });
    assert.equal(response.status, 201);
    assert.equal(response.body.totalCost, 300);
    const receiptId = response.body._id;
    const approvals = await Promise.all([1, 2].map(() => request(app).post(`/api/stock-imports/${receiptId}/approve`).send({})));
    assert.ok(approvals.every(r => r.status === 200));
    assert.equal((await Product.findById(productId).lean()).stock, 8);
    const movement = { productId, quantity: 2, type: 'export', reason: 'Test dispatch', requestId: crypto.randomUUID() };
    for (let retry = 0; retry < 2; retry++) {
      response = await request(app).post('/api/stock-movements').send(movement);
      assert.equal(response.status, 200);
    }
    assert.equal((await Product.findById(productId).lean()).stock, 6);
    response = await request(app).delete(`/api/stock-imports/${receiptId}`).send({});
    assert.equal(response.status, 200);
    response = await request(app).get('/api/stock-imports');
    assert.ok(!response.body.some(r => r._id === receiptId));
    assert.ok((await Receipt.findById(receiptId).lean()).deletedAt);
    assert.equal((await Product.findById(productId).lean()).stock, 6);
    assert.equal((await request(app).post(`/api/stock-imports/${receiptId}/approve`).send({})).status, 409);
    response = await request(app).get('/api/stock-report');
    assert.equal(response.body.movements.length, 2);
    response = await request(app).post('/api/stock-movements').send({ ...movement, quantity: 99, requestId: crypto.randomUUID() });
    assert.equal(response.status, 400);
    response = await request(app).get('/api/stock-report');
    assert.equal(response.status, 200);
    assert.deepEqual(response.body.rows[0], { productId, name: 'Test laptop', opening: 5, incoming: 3, outgoing: 2, closing: 6, current: 6 });
    assert.equal(response.body.movements.length, 2);
    response = await request(app).post('/api/stock-imports').send({ supplierId, items: [{ productId, quantity: 1, unitCost: 200 }] });
    const cancelledId = response.body._id;
    assert.equal((await request(app).post(`/api/stock-imports/${cancelledId}/cancel`).send({})).status, 200);
    assert.equal((await request(app).post(`/api/stock-imports/${cancelledId}/approve`).send({})).status, 409);
    assert.equal((await Product.findById(productId).lean()).stock, 6);
    console.log('MongoDB warehouse checks passed: supplier, receipt, concurrent approval, retry, export, stock limits, report, cancellation.');
  } finally {
    if (!/^warehouse_check_[a-f0-9]{20}$/.test(dbName) || mongoose.connection.name !== dbName) throw new Error('Unexpected test database; cleanup refused.');
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
