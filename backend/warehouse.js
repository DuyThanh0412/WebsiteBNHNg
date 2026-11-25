const crypto = require('node:crypto');

// Each product's stock and ledger are written together with optimistic locking.
// Receipt references make approval retries safe on standalone MongoDB too.
module.exports = function installWarehouse(app, mongoose, Product) {
  const Supplier = mongoose.model('Supplier', new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    contactName: String, phone: String, email: String, address: String,
    active: { type: Boolean, default: true }
  }, { timestamps: true }), 'suppliers');
  const Receipt = mongoose.model('StockReceipt', new mongoose.Schema({
    code: { type: String, unique: true }, supplierId: String, supplierName: String,
    items: [{ productId: String, name: String, quantity: Number, unitCost: Number }],
    totalCost: Number, note: String, warehouse: String, createdBy: String, approvedBy: String,
    deletedAt: { type: Date, default: null },
    status: { type: String, enum: ['pending', 'approving', 'approved', 'cancelled'], default: 'pending' },
    approvedAt: Date
  }, { timestamps: true }), 'stock_receipts');
  const fail = (message, status = 400) => Object.assign(new Error(message), { status });
  const route = fn => async (req, res) => {
    try { await fn(req, res); }
    catch (error) { res.status(error.status || 400).json({ message: error.message }); }
  };
  const text = value => typeof value === 'string' ? value.trim() : '';
  function flatten(records) {
    return records.flatMap(record => Array.isArray(record.products)
      ? record.products.map((p, i) => ({ ...p, _id: String(p._id || `embedded:${record._id}:products:${i}`), parentId: record._id, index: i }))
      : [{ ...record, _id: String(record._id) }]);
  }
  async function locate(id) {
    const products = flatten(await Product.collection.find({}).toArray());
    const product = products.find(p => p._id === id);
    if (!product) throw fail('Không tìm thấy sản phẩm.', 404);
    return product;
  }
  async function move(productId, quantityDelta, reference, reason, type, target) {
    for (let attempt = 0; attempt < 8; attempt++) {
      const p = await locate(productId);
      if ((p.inventoryMovements || []).some(m => m.reference === reference)) return;
      const before = Number(p.stock) || 0;
      const delta = target === undefined ? quantityDelta : target - before;
      if (!Number.isSafeInteger(delta) || !Number.isSafeInteger(before + delta) || before + delta < 0) throw fail('Số lượng không hợp lệ hoặc không đủ tồn kho.');
      if (!delta) return;
      const prefix = p.parentId ? `products.${p.index}.` : '';
      const stockPath = `${prefix}stock`;
      const filter = { _id: p.parentId || new mongoose.Types.ObjectId(p._id) };
      filter[stockPath] = p.stock === undefined ? { $exists: false } : p.stock;
      filter[`${prefix}inventoryMovements.reference`] = { $ne: reference };
      const entry = { id: crypto.randomUUID(), productId, productName: p.name, quantityDelta: delta,
        stockBefore: before, stockAfter: before + delta, reference, reason, type, createdAt: new Date() };
      const result = await Product.collection.updateOne(filter, {
        $set: { [stockPath]: before + delta, updatedAt: new Date() },
        $push: { [`${prefix}inventoryMovements`]: entry }
      });
      if (result.modifiedCount) return;
    }
    throw fail('Tồn kho vừa thay đổi. Vui lòng thử lại.', 409);
  }
  app.get('/api/suppliers', route(async (req, res) => res.json(await Supplier.find().sort({ createdAt: -1 }).lean())));
  async function saveSupplier(req, res) {
    const fields = Object.fromEntries(['name', 'contactName', 'phone', 'email', 'address'].map(k => [k, text(req.body[k])]));
    if (!fields.name) throw fail('Vui lòng nhập tên nhà cung cấp.');
    if (req.params.id) {
      const result = await Supplier.findByIdAndUpdate(req.params.id, { $set: fields }, { returnDocument: 'after', runValidators: true });
      if (!result) throw fail('Không tìm thấy nhà cung cấp.', 404);
      res.json(result);
    } else res.status(201).json(await Supplier.create(fields));
  }
  app.post('/api/suppliers', route(saveSupplier));
  app.put('/api/suppliers/:id', route(saveSupplier));
  app.get('/api/stock-imports', route(async (req, res) => res.json(await Receipt.find({ deletedAt: null }).sort({ createdAt: -1 }).lean())));
  app.delete('/api/stock-imports/:id', route(async (req, res) => {
    const receipt = await Receipt.findOneAndUpdate({ _id: req.params.id, status: { $ne: 'approving' }, deletedAt: null }, { $set: { deletedAt: new Date() } }, { returnDocument: 'after' });
    if (!receipt) throw fail('Không thể xóa phiếu đang duyệt hoặc phiếu không còn tồn tại.', 409);
    res.json({ message: 'Đã xóa phiếu khỏi danh sách; lịch sử tồn kho được giữ nguyên.' });
  }));
  app.post('/api/stock-imports', route(async (req, res) => {
    const supplier = await Supplier.findById(req.body.supplierId);
    if (!supplier || !supplier.active) throw fail('Vui lòng chọn nhà cung cấp hợp lệ.');
    if (!Array.isArray(req.body.items) || !req.body.items.length || req.body.items.length > 100) throw fail('Phiếu nhập cần từ 1 đến 100 sản phẩm.');
    const seen = new Set();
    const items = [];
    for (const item of req.body.items) {
      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0 || typeof item.unitCost !== 'number' || !Number.isFinite(item.unitCost) || item.unitCost < 0) throw fail('Số lượng phải là số nguyên dương, giá nhập không được âm.');
      if (seen.has(item.productId)) throw fail('Sản phẩm bị trùng trong phiếu nhập.');
      seen.add(item.productId);
      const p = await locate(item.productId);
      items.push({ productId: p._id, name: p.name, quantity: item.quantity, unitCost: item.unitCost });
    }
    const totalCost = items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
    if (!Number.isFinite(totalCost) || totalCost > Number.MAX_SAFE_INTEGER) throw fail('Tổng giá trị phiếu nhập quá lớn.');
    res.status(201).json(await Receipt.create({ code: `PN-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      supplierId: String(supplier._id), supplierName: supplier.name, items, totalCost, note: text(req.body.note),
      warehouse: text(req.body.warehouse), createdBy: text(req.body.createdBy) }));
  }));
  app.post('/api/stock-imports/:id/approve', route(async (req, res) => {
    let receipt = await Receipt.findOneAndUpdate({ _id: req.params.id, status: 'pending', deletedAt: null }, { $set: { status: 'approving' } }, { returnDocument: 'after' });
    if (!receipt) receipt = await Receipt.findById(req.params.id);
    if (!receipt) throw fail('Không tìm thấy phiếu nhập.', 404);
    if (receipt.deletedAt) throw fail('Phiếu nhập đã bị xóa.', 409);
    if (receipt.status === 'approved') return res.json(receipt);
    if (receipt.status !== 'approving') throw fail('Phiếu đã hủy không thể duyệt.', 409);
    // A failed multi-product approval stays resumable. Completed lines never apply twice.
    for (const item of receipt.items) await move(item.productId, item.quantity, receipt.code, receipt.note || 'Nhập hàng nhà cung cấp', 'import');
    const result = await Receipt.findByIdAndUpdate(receipt._id, { $set: { status: 'approved', approvedAt: new Date(), approvedBy: text(req.body.approvedBy) } }, { returnDocument: 'after' });
    res.json(result);
  }));
  app.post('/api/stock-imports/:id/cancel', route(async (req, res) => {
    const receipt = await Receipt.findOneAndUpdate({ _id: req.params.id, status: 'pending', deletedAt: null }, { $set: { status: 'cancelled' } }, { returnDocument: 'after' });
    if (!receipt) throw fail('Chỉ được hủy phiếu đang chờ duyệt.', 409);
    res.json(receipt);
  }));
  app.post('/api/stock-movements', route(async (req, res) => {
    const { productId, quantity, type, requestId } = req.body;
    if (!['export', 'adjust_in', 'adjust_out'].includes(type) || !Number.isSafeInteger(quantity) || quantity <= 0 || !text(req.body.reason)) throw fail('Kiểm tra loại giao dịch, số lượng và lý do.');
    if (typeof requestId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(requestId)) throw fail('Mã yêu cầu không hợp lệ.');
    await move(productId, type === 'adjust_in' ? quantity : -quantity, `GD-${requestId}`, text(req.body.reason), type);
    res.json({ message: 'Đã ghi nhận giao dịch kho.' });
  }));
  app.get('/api/stock-report', route(async (req, res) => {
    const start = req.query.from ? new Date(`${req.query.from}T00:00:00+07:00`) : new Date(0);
    const end = req.query.to ? new Date(`${req.query.to}T00:00:00+07:00`) : new Date();
    if (req.query.to) end.setTime(end.getTime() + 86400000);
    if (!Number.isFinite(+start) || !Number.isFinite(+end) || start >= end) throw fail('Khoảng ngày không hợp lệ.');
    const products = flatten(await Product.collection.find({}).toArray());
    const rows = products.map(p => {
      const history = p.inventoryMovements || [];
      const inRange = history.filter(m => new Date(m.createdAt) >= start && new Date(m.createdAt) < end);
      const closing = (Number(p.stock) || 0) - history.filter(m => new Date(m.createdAt) >= end).reduce((s, m) => s + m.quantityDelta, 0);
      const incoming = inRange.filter(m => m.quantityDelta > 0).reduce((s, m) => s + m.quantityDelta, 0);
      const outgoing = -inRange.filter(m => m.quantityDelta < 0).reduce((s, m) => s + m.quantityDelta, 0);
      return { productId: p._id, name: p.name, opening: closing - incoming + outgoing, incoming, outgoing, closing, current: Number(p.stock) || 0 };
    });
    const movements = products.flatMap(p => p.inventoryMovements || [])
      .filter(m => new Date(m.createdAt) >= start && new Date(m.createdAt) < end).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ rows, movements });
  }));
  return { move, Receipt };
};
