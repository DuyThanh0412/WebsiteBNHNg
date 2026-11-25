const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: require('node:path').join(__dirname, '.env') });

const { Product } = require('./models');
const installWarehouse = require('./warehouse');
const paymentsRouter = require('./routes/payments');
const customersRouter = require('./routes/customers');
const promotionsRouter = require('./routes/promotions');
const categoriesRouter = require('./routes/categories');
const createProductRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bigbangmart';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB thành công tới CSDL: bigbangmart'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

const warehouse = installWarehouse(app, mongoose, Product);
app.use('/api', paymentsRouter);
app.use('/api', customersRouter);
app.use('/api', promotionsRouter);
app.use('/api', categoriesRouter);
app.use('/api', createProductRouter(warehouse));
app.use('/api', ordersRouter);
app.use('/api', authRouter);

// Khởi chạy Server
if (require.main === module) {
  const server = app.listen(PORT);
  server.on('listening', () => {
    console.log(`🚀 Backend đang hoạt động tại: http://localhost:${PORT}`);
    console.log(`PID: ${process.pid} | File: ${__filename}`);
  });
  server.on('error', async (error) => {
    console.error(error.code === 'EADDRINUSE'
      ? `❌ Cổng ${PORT} đang bị tiến trình khác sử dụng. Backend mới chưa chạy. Hãy dừng backend cũ trước khi chạy lại.`
      : `❌ Không thể khởi động backend: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  });
}
module.exports = app;
