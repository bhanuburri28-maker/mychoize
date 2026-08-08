const db = require('../config/db');

const processPayment = async (req, res) => {
  const { bookingId, amount, method } = req.body;
  if (!bookingId || !amount || !method) {
    return res.status(400).json({ status: 'fail', message: 'Payment information is incomplete.' });
  }

  const result = await db.query(
    'INSERT INTO payments (booking_id, user_id, payment_method_id, method, amount, currency, status, payment_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [bookingId, req.user.id, null, method, amount, 'USD', 'completed']
  );
  res.status(201).json({ status: 'success', data: { paymentId: result.insertId } });
};

const getPayments = async (req, res) => {
  const payments = await db.query(`
    SELECT id, booking_id AS bookingId, user_id AS userId, payment_method_id AS paymentMethodId, method, amount, currency, status, payment_date AS paymentDate, created_at AS createdAt
    FROM payments WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id]);
  res.json({ status: 'success', data: { payments } });
};

const getPaymentById = async (req, res) => {
  const payments = await db.query(`
    SELECT id, booking_id AS bookingId, user_id AS userId, payment_method_id AS paymentMethodId, method, amount, currency, status, payment_date AS paymentDate, created_at AS createdAt
    FROM payments WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
  const payment = payments[0];
  if (!payment) return res.status(404).json({ status: 'fail', message: 'Payment not found.' });
  res.json({ status: 'success', data: { payment } });
};

module.exports = { processPayment, getPayments, getPaymentById };
