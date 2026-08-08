const db = require('../config/db');

const getNotifications = async (req, res) => {
  const notifications = await db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json({ status: 'success', data: { notifications } });
};

const createNotification = async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ status: 'fail', message: 'Notification title and message are required.' });
  }
  const result = await db.query('INSERT INTO notifications (user_id, title, message, is_read, created_at) VALUES (?, ?, ?, ?, NOW())', [req.user.id, title, message, false]);
  res.status(201).json({ status: 'success', data: { id: result.insertId } });
};

const markRead = async (req, res) => {
  await db.query('UPDATE notifications SET is_read = ? WHERE id = ? AND user_id = ?', [true, req.params.id, req.user.id]);
  res.json({ status: 'success', message: 'Notification marked as read.' });
};

module.exports = { getNotifications, createNotification, markRead };
