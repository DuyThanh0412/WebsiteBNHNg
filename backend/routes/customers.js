const express = require('express');
const mongoose = require('mongoose');
const { Order, Customer } = require('../models');

const router = express.Router();

function customerIdentityKey(customer) {
  const email = String(customer?.email || '').trim().toLowerCase();
  if (email) return `email:${email}`;
  const phone = String(customer?.phone || '').replace(/\D/g, '');
  if (phone) return `phone:${phone}`;
  const name = String(customer?.name || '').trim().toLocaleLowerCase('vi');
  return `name:${name}`;
}

function customerFieldsAreValid(customer) {
  return customer &&
    typeof customer.name === 'string' && customer.name.trim() &&
    typeof (customer.email || '') === 'string' &&
    typeof (customer.phone || '') === 'string' &&
    typeof (customer.address || '') === 'string' &&
    (!customer.status || ['active', 'blocked'].includes(customer.status));
}

function customerIdQuery(id) {
  if (mongoose.isValidObjectId(id)) return { _id: id };
  if (id.startsWith('identity:')) {
    try {
      return { identityKey: decodeURIComponent(id.slice('identity:'.length)) };
    } catch {
      return null;
    }
  }
  return null;
}

router.get('/customers', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const orderCustomers = new Map();
    for (const order of orders) {
      const identityKey = customerIdentityKey(order.customer);
      if (!identityKey || identityKey === 'name:') continue;
      const current = orderCustomers.get(identityKey) || {
        identityKey,
        name: order.customer?.name || 'Khách hàng',
        email: order.customer?.email || '',
        phone: order.customer?.phone || '',
        address: order.customer?.address || '',
        orderCount: 0,
        totalSpent: 0,
        lastOrderId: order._id,
        lastOrderAt: order.createdAt || null
      };
      current.orderCount += 1;
      current.totalSpent += Number(order.total) || 0;
      orderCustomers.set(identityKey, current);
    }

    for (const orderCustomer of orderCustomers.values()) {
      let customer = await Customer.findOne({
        $or: [
          { identityKey: orderCustomer.identityKey },
          { identityAliases: orderCustomer.identityKey }
        ]
      });
      if (customer?.isDeleted) continue;
      if (!customer) {
        customer = new Customer({ ...orderCustomer, status: 'active' });
      } else {
        customer.set({
          orderCount: orderCustomer.orderCount,
          totalSpent: orderCustomer.totalSpent,
          lastOrderId: orderCustomer.lastOrderId,
          lastOrderAt: orderCustomer.lastOrderAt
        });
      }
      await customer.save();
    }

    const customers = await Customer.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean();
    res.json(customers);
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách khách hàng:', error);
    res.status(500).json({ message: 'Không thể tải danh sách khách hàng.' });
  }
});

router.post('/customers', async (req, res) => {
  try {
    const input = req.body;
    if (!customerFieldsAreValid(input)) {
      return res.status(400).json({ message: 'Vui lòng nhập tên khách hàng và kiểm tra thông tin hợp lệ.' });
    }
    const identityKey = customerIdentityKey(input);
    const existing = await Customer.findOne({
      $or: [
        { identityKey },
        { identityAliases: identityKey }
      ]
    });
    if (existing && !existing.isDeleted) {
      return res.status(409).json({ message: 'Khách hàng đã tồn tại theo email hoặc số điện thoại.' });
    }

    const values = {
      name: input.name.trim(),
      email: String(input.email || '').trim().toLowerCase(),
      phone: String(input.phone || '').trim(),
      address: String(input.address || '').trim(),
      status: input.status || 'active',
      isDeleted: false
    };
    const customer = existing
      ? await Customer.findByIdAndUpdate(existing._id, values, { new: true, runValidators: true })
      : await Customer.create({ ...values, identityKey });
    res.status(201).json(customer);
  } catch (error) {
    console.error('❌ Lỗi tạo khách hàng:', error);
    if (error?.code === 11000) return res.status(409).json({ message: 'Khách hàng đã tồn tại theo email hoặc số điện thoại.' });
    res.status(400).json({ message: 'Không thể tạo khách hàng. Vui lòng kiểm tra lại thông tin.' });
  }
});

router.put('/customers/:id', async (req, res) => {
  try {
    const query = customerIdQuery(req.params.id);
    if (!query) return res.status(400).json({ message: 'Mã khách hàng không hợp lệ.' });
    const input = req.body;
    if (!customerFieldsAreValid(input)) {
      return res.status(400).json({ message: 'Vui lòng nhập tên khách hàng và kiểm tra thông tin hợp lệ.' });
    }

    const customer = await Customer.findOne(query);
    if (!customer || customer.isDeleted) return res.status(404).json({ message: 'Không tìm thấy khách hàng.' });
    const identityKey = customerIdentityKey(input);
    const duplicate = await Customer.findOne({
      $or: [
        { identityKey },
        { identityAliases: identityKey }
      ],
      _id: { $ne: customer._id },
      isDeleted: { $ne: true }
    });
    if (duplicate) return res.status(409).json({ message: 'Email hoặc số điện thoại này đã thuộc về khách hàng khác.' });

    if (identityKey !== customer.identityKey && !customer.identityAliases.includes(customer.identityKey)) {
      customer.identityAliases.push(customer.identityKey);
    }
    customer.set({
      identityKey,
      name: input.name.trim(),
      email: String(input.email || '').trim().toLowerCase(),
      phone: String(input.phone || '').trim(),
      address: String(input.address || '').trim(),
      status: input.status || customer.status
    });
    await customer.save();
    res.json(customer);
  } catch (error) {
    console.error('❌ Lỗi cập nhật khách hàng:', error);
    if (error?.code === 11000) return res.status(409).json({ message: 'Email hoặc số điện thoại này đã thuộc về khách hàng khác.' });
    res.status(400).json({ message: 'Không thể cập nhật khách hàng. Vui lòng kiểm tra lại thông tin.' });
  }
});

router.delete('/customers/:id', async (req, res) => {
  try {
    const query = customerIdQuery(req.params.id);
    if (!query) return res.status(400).json({ message: 'Mã khách hàng không hợp lệ.' });
    const customer = await Customer.findOne(query);
    if (!customer || customer.isDeleted) return res.status(404).json({ message: 'Không tìm thấy khách hàng.' });
    customer.isDeleted = true;
    await customer.save();
    res.json({ message: 'Đã xóa khách hàng.' });
  } catch (error) {
    console.error('❌ Lỗi xóa khách hàng:', error);
    res.status(500).json({ message: 'Không thể xóa khách hàng.' });
  }
});

module.exports = router;
