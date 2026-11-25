const express = require('express');
const { Promotion } = require('../models');

const router = express.Router();

router.get('/promotions', async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 }).lean();
    res.json(promotions);
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách khuyến mãi:', error);
    res.status(500).json({ message: 'Không thể tải danh sách khuyến mãi.' });
  }
});

router.post('/promotions', async (req, res) => {
  try {
    const promotion = await Promotion.create({ ...req.body, code: String(req.body.code || '').trim().toUpperCase() });
    res.status(201).json(promotion);
  } catch (error) {
    console.error('❌ Lỗi tạo khuyến mãi:', error);
    res.status(400).json({ message: 'Không thể tạo khuyến mãi. Kiểm tra mã và thông tin nhập vào.' });
  }
});

router.put('/promotions/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { ...req.body, code: String(req.body.code || '').trim().toUpperCase() },
      { new: true, runValidators: true }
    );
    if (!promotion) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi.' });
    res.json(promotion);
  } catch (error) {
    console.error('❌ Lỗi cập nhật khuyến mãi:', error);
    res.status(400).json({ message: 'Không thể cập nhật khuyến mãi. Kiểm tra mã và thông tin nhập vào.' });
  }
});

router.delete('/promotions/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi.' });
    res.json({ message: 'Đã xóa khuyến mãi.' });
  } catch (error) {
    console.error('❌ Lỗi xóa khuyến mãi:', error);
    res.status(400).json({ message: 'Không thể xóa khuyến mãi.' });
  }
});

module.exports = router;
