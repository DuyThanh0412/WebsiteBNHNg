const express = require('express');
const crypto = require('node:crypto');
const { parseEmbeddedId, updateEmbeddedEntry, deleteEmbeddedEntry } = require('./embedded-catalog');
const { Product } = require('../models');

module.exports = function createProductRouter(warehouse) {
  const router = express.Router();

  // Lấy danh sách sản phẩm
  router.get('/products', async (req, res) => {
    try {
      const { category, q } = req.query;
      let query = {};

      if (category) {
        query.category = { $regex: new RegExp(category.replace(/-/g, " "), "i") };
      }
      if (q) {
        query.name = { $regex: new RegExp(q, "i") };
      }

      const products = await Product.find(query).sort({ createdAt: -1 });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi lấy danh sách sản phẩm', error });
    }
  });

  // Lấy chi tiết 1 sản phẩm
  router.get('/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: 'ID không hợp lệ' });
    }
  });

  // Thêm sản phẩm mới (Admin)
  router.post('/products', async (req, res) => {
    try {
      const { price, original } = req.body;
      let off = 0;
      if (original && original > price) {
        off = Math.round((1 - price / original) * 100);
      }
      const newProduct = new Product({ ...req.body, off });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi thêm sản phẩm', error });
    }
  });

  // Cập nhật sản phẩm (Admin)
  router.put('/products/:id', async (req, res) => {
    try {
      if (Object.prototype.hasOwnProperty.call(req.body, 'stock')) {
        const target = Number(req.body.stock);
        if (!Number.isSafeInteger(target) || target < 0) return res.status(400).json({ message: 'Tồn kho phải là số nguyên không âm.' });
        await warehouse.move(req.params.id, 0, `EDIT-${crypto.randomUUID()}`, 'Điều chỉnh từ trang sản phẩm', 'adjustment', target);
        delete req.body.stock;
      }
      delete req.body.inventoryMovements;
      const { price, original } = req.body;
      let off = 0;
      if (original && original > price) {
        off = Math.round((1 - price / original) * 100);
      }
      const embedded = parseEmbeddedId(req.params.id);
      if (embedded) {
        if (embedded.field !== 'products') return res.status(400).json({ message: 'ID sản phẩm không hợp lệ.' });
        const updated = await updateEmbeddedEntry(
          Product.collection,
          embedded.parentId,
          embedded.field,
          embedded.index,
          { ...req.body, off },
          req.params.id
        );
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        return res.json(updated);
      }

      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.body, off },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi cập nhật sản phẩm', error });
    }
  });

  // Xóa sản phẩm (Admin)
  router.delete('/products/:id', async (req, res) => {
    try {
      const referenced = await warehouse.Receipt.exists({ 'items.productId': req.params.id });
      const warehouseProducts = await Product.collection.find({}).toArray();
      const hasHistory = warehouseProducts.some(p => String(p._id) === req.params.id
        ? p.inventoryMovements?.length
        : (p.products || []).some((item, index) => (String(item._id) === req.params.id || `embedded:${p._id}:products:${index}` === req.params.id) && item.inventoryMovements?.length));
      if (referenced || hasHistory) return res.status(409).json({ message: 'Sản phẩm đã có phiếu nhập hoặc lịch sử kho. Hãy ẩn sản phẩm thay vì xóa.' });
      const embedded = parseEmbeddedId(req.params.id);
      if (embedded) {
        if (embedded.field !== 'products') return res.status(400).json({ message: 'ID sản phẩm không hợp lệ.' });
        const hasWarehouseData = await warehouse.Receipt.exists({});
        const parent = warehouseProducts.find(p => String(p._id) === embedded.parentId);
        if (hasWarehouseData || (parent?.products || []).some(p => p.inventoryMovements?.length)) return res.status(409).json({ message: 'Không thể xóa sản phẩm lồng khi đã dùng kho vì sẽ đổi mã tham chiếu. Hãy ẩn sản phẩm.' });
        const deleted = await deleteEmbeddedEntry(Product.collection, embedded.parentId, embedded.field, embedded.index);
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        return res.json({ message: 'Đã xóa sản phẩm' });
      }

      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      res.json({ message: 'Đã xóa sản phẩm' });
    } catch (error) {
      res.status(400).json({ message: 'Lỗi xóa sản phẩm', error });
    }
  });

  return router;
};
