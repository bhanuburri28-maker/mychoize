const db = require('../config/db');

const getReviews = async (req, res) => {
  const reviews = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
  res.json({ status: 'success', data: { reviews } });
};

const createReview = async (req, res) => {
  const { carId, rating, comment } = req.body;
  if (!carId || !rating) {
    return res.status(400).json({ status: 'fail', message: 'Car ID and rating are required.' });
  }
  const result = await db.query('INSERT INTO reviews (user_id, car_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())', [req.user.id, carId, rating, comment || '']);
  res.status(201).json({ status: 'success', data: { id: result.insertId } });
};

const updateReview = async (req, res) => {
  const { rating, comment } = req.body;
  await db.query('UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?', [rating, comment || '', req.params.id, req.user.id]);
  res.json({ status: 'success', message: 'Review updated.' });
};

const deleteReview = async (req, res) => {
  await db.query('DELETE FROM reviews WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ status: 'success', message: 'Review deleted.' });
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
