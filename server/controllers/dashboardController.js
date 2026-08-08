const db = require('../config/db');

const getAdminStats = async (req, res) => {
  const [users] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
  const [bookings] = await db.query('SELECT COUNT(*) AS totalBookings FROM bookings');
  const [cars] = await db.query('SELECT COUNT(*) AS totalCars FROM cars');
  res.json({ status: 'success', data: { users: users.totalUsers, bookings: bookings.totalBookings, cars: cars.totalCars } });
};

const getUserStats = async (req, res) => {
  const bookings = await db.query('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json({ status: 'success', data: { totalBookings: bookings.length, bookings } });
};

module.exports = { getAdminStats, getUserStats };
