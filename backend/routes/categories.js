const express = require('express');
const { parseEmbeddedId, updateEmbeddedEntry, deleteEmbeddedEntry } = require('./embedded-catalog');
const { Category } = require('../models');

const router = express.Router();

// Lấy danh sách danh mục
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh mục', error });
  }
});

// Thêm danh mục mới
router.post('/categories', async (req, res) => {
  try {
    const newCat = new Category(req.body);
    await newCat.save();
    res.status(201).json(newCat);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi thêm danh mục', error });
  }
});

// Cập nhật danh mục
router.put('/categories/:id', async (req, res) => {
  try {
    const embedded = parseEmbeddedId(req.params.id);
    if (embedded) {
      if (embedded.field !== 'categories') return res.status(400).json({ message: 'ID danh mục không hợp lệ.' });
      const updated = await updateEmbeddedEntry(Category.collection, embedded.parentId, embedded.field, embedded.index, req.body, req.params.id);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
      return res.json(updated);
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật danh mục', error });
  }
});

// Xóa danh mục
router.delete('/categories/:id', async (req, res) => {
  try {
    const embedded = parseEmbeddedId(req.params.id);
    if (embedded) {
      if (embedded.field !== 'categories') return res.status(400).json({ message: 'ID danh mục không hợp lệ.' });
      const deleted = await deleteEmbeddedEntry(Category.collection, embedded.parentId, embedded.field, embedded.index);
      if (!deleted) return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
      return res.json({ message: 'Đã xóa danh mục' });
    }

    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
    res.json({ message: 'Đã xóa danh mục' });
  } catch (error) {
    res.status(400).json({ message: 'Lỗi xóa danh mục', error });
  }
});

module.exports = router;
