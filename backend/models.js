const mongoose = require('mongoose');

// 3. Schemas & Models (chỉ định rõ tham số thứ 3 là tên collection trong MongoDB Compass)
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: '📦' },
  desc: { type: String, default: '' },
  count: { type: Number, default: 0 },
  show: { type: Boolean, default: true }
}, { timestamps: true });
// Khai báo rõ 'categories' làm tham số thứ 3
const Category = mongoose.model('Category', CategorySchema, 'categories');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  original: { type: Number, default: 0 },
  off: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  img: { type: String, default: '' },
  brand: { type: String, default: 'BigBangMart' },
  description: { type: String, default: '' },
  show: { type: Boolean, default: true }
}, { timestamps: true });
// Khai báo rõ 'products' làm tham số thứ 3
const Product = mongoose.model('Product', ProductSchema, 'products');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetTokenHash: { type: String, select: false },
  resetTokenExpires: { type: Date, select: false },
  resetRequestedAt: { type: Date, select: false },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });
// Khai báo rõ 'users' làm tham số thứ 3
const User = mongoose.model('User', UserSchema, 'users');

const PromotionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Giảm giá', 'Miễn phí vận chuyển', 'Giảm giá combo'], default: 'Giảm giá' },
  value: { type: Number, required: true, min: 0 },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  status: { type: String, enum: ['active', 'scheduled', 'ended'], default: 'scheduled' }
}, { timestamps: true });
const Promotion = mongoose.model('Promotion', PromotionSchema, 'promotions');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String, default: '' }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    img: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  depositAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  paymentReference: { type: String, default: '', index: true },
  paymentMethod: { type: String, enum: ['cod', 'bank', 'deposit', 'card'], required: true },
  paymentStatus: { type: String, default: 'unpaid' },
  paidAmount: { type: Number, default: 0 },
  paidAt: { type: Date, default: null },
  status: { type: String, default: 'pending' }
}, { timestamps: true });
const Order = mongoose.model('Order', OrderSchema, 'orders');

const CustomerSchema = new mongoose.Schema({
  identityKey: { type: String, required: true, unique: true, index: true },
  identityAliases: { type: [String], default: [] },
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true, lowercase: true },
  phone: { type: String, default: '', trim: true },
  address: { type: String, default: '', trim: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  orderCount: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  lastOrderAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
const Customer = mongoose.model('Customer', CustomerSchema, 'customers');

const SePayTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  transferAmount: { type: Number, required: true },
  referenceCode: { type: String, default: '' },
  content: { type: String, default: '' },
  transactionDate: { type: String, default: '' }
}, { timestamps: true });
const SePayTransaction = mongoose.model('SePayTransaction', SePayTransactionSchema, 'sepay_transactions');

module.exports = { Category, Product, User, Promotion, Order, Customer, SePayTransaction };
