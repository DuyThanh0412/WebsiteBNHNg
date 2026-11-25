const request = require('supertest');
const app = require('./server'); // Đảm bảo đường dẫn tới file chứa express app của bạn là đúng

describe('POST /api/orders', () => {
  it('nên trả về lỗi 400 nếu mã giảm giá không hợp lệ hoặc đã hết hạn', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        product_id: '123',
        name: 'Sản phẩm test',
        price: 100000,
        couponCode: 'MA_HET_HAN' // Gửi thử một mã lỗi
      });

    // Kiểm tra xem server có trả về đúng status 400 như logic bạn viết hay không
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
  });
});