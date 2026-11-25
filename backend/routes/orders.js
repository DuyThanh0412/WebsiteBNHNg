const express = require('express');
const crypto = require('node:crypto');
const { Order, Product, Promotion } = require('../models');

const router = express.Router();

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách đơn hàng:', error);
    res.status(500).json({ message: 'Không thể tải danh sách đơn hàng.' });
  }
});

router.get('/orders/:orderNumber/payment-status', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .select('orderNumber paymentStatus paidAmount total depositAmount paymentMethod status')
      .lean();
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    res.json(order);
  } catch (error) {
    console.error('❌ Lỗi kiểm tra trạng thái thanh toán:', error);
    res.status(500).json({ message: 'Không thể kiểm tra trạng thái thanh toán.' });
  }
});

router.get('/orders/:orderNumber/tracking', async (req, res) => {
  try {
    const phone = typeof req.query.phone === 'string' ? req.query.phone.replace(/\D/g, '') : '';
    if (!phone) {
      return res.status(400).json({ message: 'Vui lòng nhập số điện thoại đặt hàng.' });
    }

    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .select('orderNumber customer.phone items.name items.quantity total paymentMethod paymentStatus status createdAt')
      .lean();
    const orderPhone = order?.customer?.phone?.replace(/\D/g, '');
    if (!order || orderPhone !== phone) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng với mã đơn và số điện thoại này.' });
    }

    res.json({
      orderNumber: order.orderNumber,
      items: order.items.map(({ name, quantity }) => ({ name, quantity })),
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      createdAt: order.createdAt
    });
  } catch (error) {
    console.error('❌ Lỗi tra cứu đơn hàng:', error);
    res.status(500).json({ message: 'Không thể tra cứu đơn hàng lúc này.' });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    if (Object.prototype.hasOwnProperty.call(req.body, 'status') &&
      !Object.prototype.hasOwnProperty.call(req.body, 'customer') &&
      !Object.prototype.hasOwnProperty.call(req.body, 'items')) {
      const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ.' });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!updatedOrder) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
      res.json(updatedOrder);
      return;
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

    if (Object.prototype.hasOwnProperty.call(req.body, 'customer')) {
      const customer = req.body.customer;
      if (!customer || typeof customer !== 'object') {
        return res.status(400).json({ message: 'Thông tin khách hàng không hợp lệ.' });
      }
      for (const field of ['name', 'phone', 'address', 'email', 'note']) {
        if (Object.prototype.hasOwnProperty.call(customer, field)) {
          if (typeof customer[field] !== 'string' || (['name', 'phone', 'address'].includes(field) && !customer[field].trim())) {
            return res.status(400).json({ message: `Thông tin ${field} không hợp lệ.` });
          }
          order.customer[field] = customer[field].trim();
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'items')) {
      if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
        return res.status(400).json({ message: 'Đơn hàng phải có ít nhất một sản phẩm.' });
      }

      const records = await Product.find().lean();
      const catalog = records.flatMap(record => Array.isArray(record.products) ? record.products : [record]);
      const slug = value => String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9 -]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      const updatedItems = [];
      for (const requestedItem of req.body.items) {
        const quantity = Number(requestedItem?.quantity);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
          return res.status(400).json({ message: 'Số lượng sản phẩm phải từ 1 đến 99.' });
        }

        const product = catalog.find(item => {
          const id = String(item?._id || item?.id || slug(item?.name));
          return id === String(requestedItem?.productId);
        });
        if (!product?.name || !Number.isFinite(Number(product.price)) || Number(product.price) < 0) {
          return res.status(400).json({ message: 'Có sản phẩm không còn tồn tại hoặc giá không hợp lệ.' });
        }
        updatedItems.push({
          productId: String(product._id || product.id || slug(product.name)),
          name: product.name,
          img: product.img || '',
          price: Number(product.price),
          quantity
        });
      }

      const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      order.items = updatedItems;
      order.subtotal = subtotal;
      order.discount = Math.min(Number(order.discount) || 0, subtotal);
      order.total = Math.max(0, subtotal - order.discount) + (Number(order.shippingFee) || 0);
      if (order.paymentMethod === 'deposit') order.depositAmount = Math.ceil(order.total / 2);

      const amountRequired = order.paymentMethod === 'deposit' ? order.depositAmount : order.total;
      if ((Number(order.paidAmount) || 0) >= amountRequired) {
        order.paymentStatus = 'paid';
        if (order.status === 'pending') order.status = 'processing';
      } else if ((Number(order.paidAmount) || 0) > 0) {
        order.paymentStatus = 'partial';
      } else {
        order.paymentStatus = 'unpaid';
      }
    }
    if (!Number.isFinite(Number(order.subtotal))) {
      order.subtotal = (order.items || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('❌ Lỗi cập nhật đơn hàng:', error);
    res.status(400).json({ message: 'Không thể cập nhật trạng thái đơn hàng.' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const { customer, items, paymentMethod, couponCode, paymentReference: requestedPaymentReference } = req.body;
    if (
      !customer?.name?.trim() ||
      !customer?.phone?.trim() ||
      !customer?.address?.trim() ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !['cod', 'bank', 'deposit', 'card'].includes(paymentMethod)
    ) {
      return res.status(400).json({ message: 'Vui lòng kiểm tra thông tin nhận hàng và đơn hàng.' });
    }
    if (
      ['bank', 'deposit'].includes(paymentMethod) &&
      requestedPaymentReference !== undefined &&
      (typeof requestedPaymentReference !== 'string' || !/^BBM[A-F0-9]{10}$/.test(requestedPaymentReference))
    ) {
      return res.status(400).json({ message: 'Mã chuyển khoản không hợp lệ. Vui lòng tải lại trang thanh toán.' });
    }

    const records = await Product.find().lean();
    const catalog = records.flatMap(record => Array.isArray(record.products) ? record.products : [record]);
    const slug = value => String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const orderItems = [];
    for (const requestedItem of items) {
      const quantity = Number(requestedItem?.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ message: 'Số lượng sản phẩm không hợp lệ.' });
      }

      const product = catalog.find(item => {
        const productId = String(item?._id || item?.id || slug(item?.name));
        return productId === String(requestedItem?.productId);
      });
      if (!product?.name || !Number.isFinite(Number(product.price)) || Number(product.price) < 0) {
        return res.status(400).json({ message: 'Sản phẩm trong đơn hàng không còn hợp lệ.' });
      }

      orderItems.push({
        productId: String(product._id || product.id || slug(product.name)),
        name: product.name,
        img: product.img || '',
        price: Number(product.price),
        quantity
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let shippingFee = 30000;
    let discount = 0;
    let appliedCouponCode = '';
    if (couponCode) {
      const normalizedCode = String(couponCode).trim().toUpperCase();
      const promotion = await Promotion.findOne({ code: normalizedCode }).lean();
      const today = new Date().toISOString().slice(0, 10);
      if (
        !promotion ||
        promotion.status !== 'active' ||
        (promotion.startDate && promotion.startDate > today) ||
        (promotion.endDate && promotion.endDate < today)
      ) {
        return res.status(400).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' });
      }
      if (promotion.type === 'Miễn phí vận chuyển') {
        shippingFee = 0;
      } else {
        discount = Math.min(subtotal, Math.floor(subtotal * Math.max(0, Number(promotion.value) || 0) / 100));
      }
      appliedCouponCode = promotion.code;
    }
    const total = Math.max(0, subtotal - discount) + shippingFee;
    const depositAmount = paymentMethod === 'deposit' ? Math.ceil(total / 2) : 0;

    const paymentReference = ['bank', 'deposit'].includes(paymentMethod)
      ? requestedPaymentReference || `BBM${crypto.randomBytes(5).toString('hex').toUpperCase()}`
      : '';
    if (paymentReference && await Order.exists({ paymentReference })) {
      return res.status(409).json({ message: 'Mã thanh toán đã được sử dụng. Vui lòng tải lại trang và thử lại.' });
    }
    const orderNumber = `BBM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const order = await Order.create({
      orderNumber,
      paymentReference,
      customer: {
        name: customer.name.trim(),
        email: typeof customer.email === 'string' ? customer.email.trim() : '',
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        note: typeof customer.note === 'string' ? customer.note.trim() : ''
      },
      items: orderItems,
      subtotal,
      discount,
      shippingFee,
      total,
      depositAmount,
      couponCode: appliedCouponCode,
      paymentMethod,
      paymentStatus: 'unpaid'
    });

    res.status(201).json({
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        paymentReference: order.paymentReference,
        total: order.total,
        depositAmount: order.depositAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status
      }
    });
  } catch (error) {
    console.error('❌ Lỗi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Không thể tạo đơn hàng lúc này.' });
  }
});

module.exports = router;
