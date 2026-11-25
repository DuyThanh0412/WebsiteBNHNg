const { test } = require('node:test');
const assert = require('node:assert/strict');
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const request = require('supertest');
const crypto = require('node:crypto');
const { hashPassword, verifyPassword, tokenHash } = require('./passwords');

test('password lifecycle with isolated database and mocked email', async () => {
  const database = `bigbangmart_password_test_${process.pid}`;
  const originalUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bigbangmart';
  const separator = originalUri.indexOf('?');
  const base = separator < 0 ? originalUri : originalUri.slice(0, separator);
  const query = separator < 0 ? '' : originalUri.slice(separator);
  process.env.MONGO_URI = `${base.slice(0, base.lastIndexOf('/') + 1)}${database}${query}`;
  process.env.SMTP_HOST = 'smtp.example.test';
  process.env.SMTP_USER = 'sender@example.test';
  process.env.SMTP_PASS = 'fake-password';
  process.env.APP_URL = 'http://localhost:8443';
  let mail;
  let failMail = false;
  const nodemailer = require('nodemailer');
  const originalTransport = nodemailer.createTransport;
  nodemailer.createTransport = () => ({ sendMail: async value => {
    if (failMail) throw new Error('mock SMTP failure');
    mail = value;
  } });
  const app = require('./server');
  try {
    await mongoose.connection.asPromise();
    assert.equal(mongoose.connection.name, database);
    const users = mongoose.connection.db.collection('users');
    const email = 'customer@example.test';
    let response = await request(app).post('/api/register').send({ name: 'Test', email, password: 'old-pass' });
    assert.equal(response.status, 201);
    let stored = await users.findOne({ email });
    assert.ok(stored.password.startsWith('scrypt:'));
    assert.equal(await verifyPassword('old-pass', stored.password), true);
    response = await request(app).post('/api/change-password').send({ email, currentPassword: 'wrong-pass', newPassword: 'new-pass' });
    assert.equal(response.status, 400);
    response = await request(app).post('/api/change-password').send({ email, currentPassword: 'old-pass', newPassword: 'new-pass' });
    assert.equal(response.status, 200);
    assert.equal((await request(app).post('/api/login').send({ email, password: 'old-pass' })).status, 400);
    assert.equal((await request(app).post('/api/login').send({ email, password: 'new-pass' })).status, 200);
    response = await request(app).post('/api/forgot-password').send({ email });
    assert.equal(response.status, 200);
    assert.ok(mail.text.includes('http://localhost:8443/reset-password#token='));
    const token = new URL(mail.text.match(/http:\/\/\S+/)[0]).hash.slice('#token='.length);
    stored = await users.findOne({ email });
    assert.equal(stored.resetTokenHash, tokenHash(token));
    assert.ok(!JSON.stringify(response.body).includes(token));
    const missing = await request(app).post('/api/forgot-password').send({ email: 'missing@example.test' });
    assert.deepEqual(missing.body, response.body);
    assert.equal((await request(app).post('/api/reset-password').send({ token, newPassword: 'short' })).status, 400);
    assert.equal((await request(app).post('/api/reset-password').send({ token, newPassword: 'reset-pass' })).status, 200);
    assert.equal((await request(app).post('/api/reset-password').send({ token, newPassword: 'again-pass' })).status, 400);
    assert.equal((await request(app).post('/api/login').send({ email, password: 'reset-pass' })).status, 200);
    const expired = crypto.randomBytes(32).toString('hex');
    await users.updateOne({ email }, { $set: { resetTokenHash: tokenHash(expired), resetTokenExpires: new Date(Date.now() - 1000) } });
    assert.equal((await request(app).post('/api/reset-password').send({ token: expired, newPassword: 'expired-pass' })).status, 400);
    // Existing plaintext accounts continue working and migrate on successful login.
    await users.insertOne({ name: 'Legacy', email: 'legacy@example.test', password: 'legacy-pass' });
    assert.equal((await request(app).post('/api/login').send({ email: 'legacy@example.test', password: 'legacy-pass' })).status, 200);
    assert.ok((await users.findOne({ email: 'legacy@example.test' })).password.startsWith('scrypt:'));
    await users.updateOne({ email }, { $unset: { resetRequestedAt: 1 } });
    failMail = true;
    assert.equal((await request(app).post('/api/forgot-password').send({ email })).status, 503);
    assert.equal((await users.findOne({ email })).resetTokenHash, undefined);
    delete process.env.SMTP_PASS;
    assert.equal((await request(app).post('/api/forgot-password').send({ email })).status, 503);
    for (let i = 0; i < 10; i++) await request(app).post('/api/change-password').send({});
    assert.equal((await request(app).post('/api/change-password').send({})).status, 429);
    assert.equal(await verifyPassword('wrong', await hashPassword('right')), false);
  } finally {
    nodemailer.createTransport = originalTransport;
    if (mongoose.connection.name === database && database.startsWith('bigbangmart_password_test_')) await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  }
});
