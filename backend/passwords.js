const crypto = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${key.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string') return false;
  if (!stored.startsWith('scrypt:')) {
    const a = Buffer.from(password);
    const b = Buffer.from(stored);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  const [, salt, hex] = stored.split(':');
  if (!salt || !/^[a-f0-9]{128}$/.test(hex || '')) return false;
  const key = await scrypt(password, salt, 64);
  return crypto.timingSafeEqual(key, Buffer.from(hex, 'hex'));
}

const validPassword = value => typeof value === 'string' && value.length >= 6 && value.length <= 128;
const tokenHash = token => crypto.createHash('sha256').update(token).digest('hex');
module.exports = { hashPassword, verifyPassword, validPassword, tokenHash };
