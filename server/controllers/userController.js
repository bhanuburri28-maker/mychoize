const db = require('../config/db');

const getUsers = async (req, res) => {
  const users = await db.query('SELECT id, first_name AS firstName, last_name AS lastName, email, phone, role, created_at AS createdAt FROM users');
  res.json({ status: 'success', data: { users } });
};

const getUserById = async (req, res) => {
  const users = await db.query('SELECT id, first_name AS firstName, last_name AS lastName, email, phone, role, created_at AS createdAt FROM users WHERE id = ?', [req.params.id]);
  const user = users[0];
  if (!user) return res.status(404).json({ status: 'fail', message: 'User not found.' });
  res.json({ status: 'success', data: { user } });
};

const updateUser = async (req, res) => {
  const { firstName, lastName, email, phone, role } = req.body;
  await db.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ? WHERE id = ?', [firstName, lastName, email, phone, role, req.params.id]);
  res.json({ status: 'success', message: 'User updated.' });
};

const deleteUser = async (req, res) => {
  await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ status: 'success', message: 'User deleted.' });
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
