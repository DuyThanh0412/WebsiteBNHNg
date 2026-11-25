const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const installWarehouse = require('./warehouse');

const productId = '507f1f77bcf86cd799439011';
let records;
const get = (object, path) => path.split('.').reduce((v, key) => v?.[key], object);
const set = (object, path, value) => {
  const parts = path.split('.');
  const key = parts.pop();
  const parent = parts.reduce((v, part) => v[part], object);
  parent[key] = value;
};
const Product = { collection: {
  find: () => ({ toArray: async () => structuredClone(records) }),
  updateOne: async (filter, update) => {
    const p = records.find(p => String(p._id) === String(filter._id));
    const stockPath = Object.keys(filter).find(k => k.endsWith('stock'));
    const refPath = Object.keys(filter).find(k => k.endsWith('.reference'));
    const history = get(p, refPath.replace('.reference', '')) || [];
    if (get(p, stockPath) !== filter[stockPath] || history.some(m => m.reference === filter[refPath].$ne)) return { modifiedCount: 0 };
    for (const [key, value] of Object.entries(update.$set)) set(p, key, value);
    for (const [key, value] of Object.entries(update.$push)) set(p, key, [...(get(p, key) || []), value]);
    return { modifiedCount: 1 };
  }
} };
const app = express();
app.use(express.json());
const { move, Receipt } = installWarehouse(app, mongoose, Product);
beforeEach(() => { records = [{ _id: productId, name: 'Laptop', stock: 5 }]; });
afterEach(() => jest.restoreAllMocks());

test('approval references apply stock once even for concurrent retries', async () => {
  await Promise.all([move(productId, 3, 'PN-1', '', 'import'), move(productId, 3, 'PN-1', '', 'import')]);
  expect(records[0].stock).toBe(8);
  expect(records[0].inventoryMovements).toHaveLength(1);
  expect(records[0].inventoryMovements[0]).toMatchObject({ stockBefore: 5, stockAfter: 8 });
});
test('rejects export exceeding stock and preserves stock and ledger', async () => {
  const res = await request(app).post('/api/stock-movements').send({ productId, quantity: 6, type: 'export', reason: 'Xuất đơn', requestId: 'test-export-00001' });
  expect(res.status).toBe(400);
  expect(records[0].stock).toBe(5);
  expect(records[0].inventoryMovements).toBeUndefined();
});
test('rejects fractional quantity before changing stock', async () => {
  const res = await request(app).post('/api/stock-movements').send({ productId, quantity: 1.5, type: 'export', reason: 'Test', requestId: 'test-export-00002' });
  expect(res.status).toBe(400);
  expect(records[0].stock).toBe(5);
});
test('embedded legacy products update their own stock and history', async () => {
  records = [{ _id: productId, products: [{ name: 'Legacy', stock: 2 }, { name: 'Other', stock: 8 }] }];
  await move(`embedded:${productId}:products:0`, 4, 'PN-2', '', 'import');
  expect(records[0].products[0].stock).toBe(6);
  expect(records[0].products[1].stock).toBe(8);
});
test('partially applied approval resumes without duplicating completed lines', async () => {
  const receipt = { _id: productId, status: 'approving', code: 'PN-3', items: [{ productId, quantity: 2 }], note: '' };
  await move(productId, 2, 'PN-3', '', 'import');
  jest.spyOn(Receipt, 'findOneAndUpdate').mockResolvedValue(null);
  jest.spyOn(Receipt, 'findById').mockResolvedValue(receipt);
  jest.spyOn(Receipt, 'findByIdAndUpdate').mockResolvedValue({ ...receipt, status: 'approved' });
  const res = await request(app).post(`/api/stock-imports/${productId}/approve`).send({});
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('approved');
  expect(records[0].stock).toBe(7);
  expect(records[0].inventoryMovements).toHaveLength(1);
});
test('cancel refuses approval already in progress', async () => {
  jest.spyOn(Receipt, 'findOneAndUpdate').mockResolvedValue(null);
  const res = await request(app).post(`/api/stock-imports/${productId}/cancel`).send({});
  expect(res.status).toBe(409);
});
test('report uses Vietnam day boundaries and reconstructs opening and closing balances', async () => {
  records[0].stock = 10;
  records[0].inventoryMovements = [
    { id: '1', quantityDelta: 3, createdAt: new Date('2026-11-15T17:00:00Z') },
    { id: '2', quantityDelta: -2, createdAt: new Date('2026-11-16T10:00:00Z') },
    { id: '3', quantityDelta: 4, createdAt: new Date('2026-11-16T17:00:00Z') },
  ];
  const res = await request(app).get('/api/stock-report?from=2026-11-16&to=2026-11-16');
  expect(res.status).toBe(200);
  expect(res.body.rows[0]).toMatchObject({ opening: 5, incoming: 3, outgoing: 2, closing: 6, current: 10 });
  expect(res.body.movements.map(m => m.id)).toEqual(['2', '1']);
});
test('report rejects reversed dates', async () => {
  const res = await request(app).get('/api/stock-report?from=2026-11-17&to=2026-11-15');
  expect(res.status).toBe(400);
});
