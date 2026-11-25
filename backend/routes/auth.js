const express = require('express');
const crypto = require('node:crypto');
const { hashPassword, verifyPassword, validPassword, tokenHash } = require('../passwords');
const { User } = require('../models');

const router = express.Router();

// Đăng nhập
router.post('/login', passwordRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tài khoản Admin mặc định
    if ((email === 'admin' || email === 'admin@bigbangmart.com') && password === '123') {
      return res.json({
        user: { name: 'Admin', email, isAdmin: true }
      });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !await verifyPassword(password, user.password)) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    if (!user.password.startsWith('scrypt:')) {
      await User.updateOne({ _id: user._id, password: user.password }, { $set: { password: await hashPassword(password) } });
    }
    res.json({
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ message: 'Không thể đăng nhập lúc này.' });
  }
});

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (typeof name !== 'string' || !name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !validPassword(password)) {
      return res.status(400).json({ message: 'Vui lòng nhập tên, email hợp lệ và mật khẩu từ 6 đến 128 ký tự.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email này đã được sử dụng' });
    }

    const newUser = new User({ name: name.trim(), email, password: await hashPassword(password) });
    await newUser.save();
    res.status(201).json({
      user: { id: newUser._id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin }
    });
  } catch (error) {
    res.status(400).json({ message: error.code === 11000 ? 'Email này đã được sử dụng.' : 'Không thể tạo tài khoản. Vui lòng thử lại.' });
  }
});

// Limit password requests per client; entries expire to keep memory bounded.
const passwordAttempts = new Map();
const passwordCleanup = setInterval(() => {
  for (const [key, value] of passwordAttempts) if (value.until <= Date.now()) passwordAttempts.delete(key);
}, 60_000);
passwordCleanup.unref();
function passwordRateLimit(req, res, next) {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const entry = passwordAttempts.get(key);
  if (!entry || entry.until <= now) passwordAttempts.set(key, { count: 1, until: now + 15 * 60_000 });
  else if (++entry.count > 10) return res.status(429).json({ message: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 15 phút.' });
  next();
}

router.post('/change-password', passwordRateLimit, async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (typeof email !== 'string' || typeof currentPassword !== 'string' || !validPassword(newPassword)) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin; mật khẩu mới từ 6 đến 128 ký tự.' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !await verifyPassword(currentPassword, user.password)) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu hiện tại không chính xác.' });
    }
    if (currentPassword === newPassword) return res.status(400).json({ message: 'Mật khẩu mới phải khác mật khẩu hiện tại.' });
    const updated = await User.updateOne({ _id: user._id, password: user.password }, {
      $set: { password: await hashPassword(newPassword) },
      $unset: { resetTokenHash: 1, resetTokenExpires: 1 }
    });
    if (!updated.modifiedCount) return res.status(409).json({ message: 'Mật khẩu đã thay đổi. Vui lòng đăng nhập lại.' });
    res.json({ message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' });
  } catch {
    res.status(500).json({ message: 'Không thể đổi mật khẩu lúc này.' });
  }
});

router.post('/forgot-password', passwordRateLimit, async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Vui lòng nhập email hợp lệ.' });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.APP_URL) {
    return res.status(503).json({ message: 'Chức năng gửi email chưa sẵn sàng. Vui lòng liên hệ cửa hàng.' });
  }
  const message = 'Nếu email đã được đăng ký, bạn sẽ nhận được liên kết đặt lại mật khẩu. Vui lòng kiểm tra cả thư rác.';
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const digest = tokenHash(token);
    const user = await User.findOneAndUpdate({ email, $or: [
      { resetRequestedAt: { $exists: false } },
      { resetRequestedAt: { $lt: new Date(Date.now() - 60_000) } }
    ] }, { $set: { resetTokenHash: digest, resetTokenExpires: new Date(Date.now() + 15 * 60_000), resetRequestedAt: new Date() } });
    if (user) {
      const link = new URL('/reset-password', process.env.APP_URL);
      link.hash = new URLSearchParams({ token }).toString();
      const mailer = require('nodemailer').createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_SECURE !== 'false',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        connectionTimeout: 10_000, socketTimeout: 15_000
      });
      try {
        await mailer.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: 'BigBangMart - Đặt lại mật khẩu',
          text: `Bạn đã yêu cầu đặt lại mật khẩu BigBangMart. Mở liên kết sau trong 15 phút:\n${link.href}\n\nLiên kết chỉ dùng một lần. Nếu bạn không yêu cầu, hãy bỏ qua email này.`
        });
      } catch {
        await User.updateOne({ _id: user._id, resetTokenHash: digest }, { $unset: { resetTokenHash: 1, resetTokenExpires: 1, resetRequestedAt: 1 } });
        console.error('Không gửi được email đặt lại mật khẩu. Kiểm tra cấu hình SMTP.');
        return res.status(503).json({ message: 'Không thể gửi email lúc này. Vui lòng thử lại sau.' });
      }
    }
    res.json({ message });
  } catch {
    res.status(500).json({ message: 'Không thể xử lý yêu cầu lúc này.' });
  }
});

router.post('/reset-password', passwordRateLimit, async (req, res) => {
  const { token, newPassword } = req.body;
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token) || !validPassword(newPassword)) {
    return res.status(400).json({ message: 'Liên kết không hợp lệ hoặc mật khẩu chưa đủ 6–128 ký tự.' });
  }
  try {
    const user = await User.findOneAndUpdate({ resetTokenHash: tokenHash(token), resetTokenExpires: { $gt: new Date() } }, {
      $set: { password: await hashPassword(newPassword) },
      $unset: { resetTokenHash: 1, resetTokenExpires: 1 }
    });
    if (!user) return res.status(400).json({ message: 'Liên kết đã hết hạn hoặc đã được sử dụng. Vui lòng yêu cầu liên kết mới.' });
    res.json({ message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.' });
  } catch {
    res.status(500).json({ message: 'Không thể đặt lại mật khẩu lúc này.' });
  }
});

module.exports = router;
