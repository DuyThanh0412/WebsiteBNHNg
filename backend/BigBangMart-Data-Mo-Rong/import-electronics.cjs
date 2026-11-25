const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
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

const SePayTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  transferAmount: { type: Number, required: true },
  referenceCode: { type: String, default: '' },
  content: { type: String, default: '' },
  transactionDate: { type: String, default: '' }
}, { timestamps: true });
const SePayTransaction = mongoose.model('SePayTransaction', SePayTransactionSchema, 'sepay_transactions');


function decode(v) {
 if (Array.isArray(v)) return v.map(decode);
 if (v && typeof v === 'object') {
  if (Object.keys(v).length === 1 && v.$oid) return new mongoose.Types.ObjectId(v.$oid);
  if (Object.keys(v).length === 1 && v.$date) return new Date(v.$date);
  return Object.fromEntries(Object.entries(v).map(([k,x]) => [k,decode(x)]));
 }
 return v;
}
function read(name) { return decode(JSON.parse(fs.readFileSync(path.join(__dirname,name),'utf8'))); }
async function main() {
 const batches = [[Category,read('categories.json')],[Product,read('products.json')],[Promotion,read('promotions.json')],[Order,read('orders.json')]];
 for (const [Model,rows] of batches) for (const row of rows) await new Model(row).validate();
 if (process.argv.includes('--check')) { console.log('Tất cả bản ghi hợp lệ theo schema. Không ghi DB.');return; }
 await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bigbangmart',{serverSelectionTimeoutMS:10000});
 console.log('Database:',mongoose.connection.name);
 // Kiểm tra xung đột ID trước khi ghi bất kỳ bản ghi nào.
 for (const [Model,rows] of batches) for (const row of rows) {
  const existing = await Model.collection.findOne({_id:row._id});
  const key = row.orderNumber ? 'orderNumber' : (row.code ? 'code' : 'name');
  if (existing && existing[key] !== row[key]) throw new Error('ID bị trùng với bản ghi khác: '+row._id);
 }
 for (const [Model,rows] of batches) {
  let added=0;
  for (const row of rows) {
   const result=await Model.collection.updateOne({_id:row._id},{$setOnInsert:row},{upsert:true});
   added+=result.upsertedCount;
  }
  console.log(Model.collection.collectionName+': thêm '+added+', đã có '+(rows.length-added));
 }
 if (process.argv.includes('--hide-old-demo')) {
  const legacy=read('legacy-demo-identities.json');
  for (const name of ['categories','products']) {
   let hidden=0;
   for (const fingerprint of legacy[name]) {
    const result=await mongoose.connection.collection(name).updateOne(fingerprint,{$set:{show:false}});
    hidden+=result.modifiedCount;
   }
   console.log('Ẩn bản demo thực phẩm '+name+': '+hidden);
  }
  console.log('Lưu ý: frontend cần tôn trọng show=false; backend hiện vẫn trả về các bản ghi này.');
 }
 console.log('Hoàn tất. Không xóa dữ liệu.');
}
main().catch(e=>{console.error('Lỗi:',e.message);process.exitCode=1;}).finally(()=>mongoose.disconnect());
