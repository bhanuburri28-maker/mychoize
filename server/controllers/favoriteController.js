const db = require('../config/db');

const getFavorites = async (req, res) => {
  const favorites = await db.query('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json({ status: 'success', data: { favorites } });
};

const createFavorite = async (req, res) => {
  const { carId } = req.body;
  if (!carId) {
    return res.status(400).json({ status: 'fail', message: 'Car ID is required.' });
  }
  const result = await db.query('INSERT INTO favorites (user_id, car_id, created_at) VALUES (?, ?, NOW())', [req.user.id, carId]);
  res.status(201).json({ status: 'success', data: { id: result.insertId } });
};

const deleteFavorite = async (req, res) => {
  await db.query('DELETE FROM favorites WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ status: 'success', message: 'Favorite removed.' });
};

module.exports = { getFavorites, createFavorite, deleteFavorite };
