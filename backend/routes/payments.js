const express = require('express');
const crypto = require('node:crypto');
const { Order, SePayTransaction } = require('../models');

const router = express.Router();

router.get('/payment-config', (req, res) => {
  const bank = process.env.SEPAY_BANK_CODE || '';
  const accountNumber = process.env.SEPAY_ACCOUNT_NUMBER || '';
  const accountHolder = process.env.SEPAY_ACCOUNT_HOLDER || '';
  const storeName = process.env.SEPAY_STORE_NAME || '';
  res.json({
    configured: Boolean(bank && accountNumber && accountHolder),
    bank,
    accountNumber,
    accountHolder,
    storeName
  });
});

router.post('/sepay/webhook', async (req, res) => {
  const apiKey = process.env.SEPAY_WEBHOOK_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ success: false, message: 'Webhook chưa được cấu hình.' });
  }

  const authorization = req.get('authorization') || '';
  const expected = `Apikey ${apiKey}`;
  const providedBuffer = Buffer.from(authorization);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const event = req.body;
  const transactionId = event?.id;
  const amount = Number(event?.transferAmount);
  if (
    transactionId === undefined ||
    transactionId === null ||
    event?.transferType !== 'in' ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return res.status(400).json({ success: false, message: 'Dữ liệu giao dịch không hợp lệ.' });
  }
  if (
    process.env.SEPAY_ACCOUNT_NUMBER &&
    String(event.accountNumber || '') !== process.env.SEPAY_ACCOUNT_NUMBER
  ) {
    return res.status(200).json({ success: true });
  }

  try {
    const transferContent = `${event.content || ''} ${event.code || ''}`.toUpperCase();
    const pendingOrders = await Order.find({
      paymentMethod: { $in: ['bank', 'deposit'] },
      paymentStatus: { $ne: 'paid' },
      paymentReference: { $ne: '' }
    }).sort({ createdAt: -1 }).limit(500).lean();
    const matchedOrder = pendingOrders.find(candidate =>
      transferContent.includes(String(candidate.paymentReference).toUpperCase())
    );
    if (!matchedOrder) return res.status(200).json({ success: true });

    await SePayTransaction.create({
      transactionId: String(transactionId),
      orderId: matchedOrder._id,
      transferAmount: amount,
      referenceCode: String(event.referenceCode || ''),
      content: String(event.content || ''),
      transactionDate: String(event.transactionDate || '')
    });

    const transactions = await SePayTransaction.find({ orderId: matchedOrder._id }).lean();
    const paidAmount = transactions.reduce((sum, transaction) => sum + transaction.transferAmount, 0);
    const expectedAmount = matchedOrder.paymentMethod === 'deposit'
      ? Number(matchedOrder.depositAmount) || Math.ceil(matchedOrder.total / 2)
      : Number(matchedOrder.total);
    const update = { paidAmount };
    if (paidAmount >= expectedAmount) {
      update.paymentStatus = 'paid';
      update.paidAt = new Date();
      if (matchedOrder.status === 'pending') update.status = 'processing';
    } else {
      update.paymentStatus = 'partial';
    }
    await Order.updateOne({ _id: matchedOrder._id }, { $set: update });
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error?.code === 11000) return res.status(200).json({ success: true });
    console.error('❌ Lỗi xử lý SePay webhook:', error);
    return res.status(500).json({ success: false, message: 'Không thể xử lý giao dịch.' });
  }
});

module.exports = router;
