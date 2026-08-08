const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');

const signToken = (user) => jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const register = async (req, res, next) => {
  const { firstName, lastName, email, phone, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Missing required fields.' });
  }

  const existing = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
  if (existing && existing.length) {
    return res.status(400).json({ status: 'fail', message: 'User already exists.' });
  }

  const hashed = await bcrypt.hash(password, 12);
  const result = await db.query(
    'INSERT INTO users (first_name, last_name, email, phone, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
    [firstName.trim(), lastName.trim(), email.toLowerCase(), phone || '', hashed, 'user']
  );

  const user = { id: result.insertId, role: 'user' };
  const token = signToken(user);
  res.status(201).json({ status: 'success', data: { token, user: { id: user.id, email, firstName, lastName, role: 'user' } } });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Email and password are required.' });
  }

  const users = await db.query('SELECT id, password, role, first_name AS firstName, last_name AS lastName, email FROM users WHERE email = ?', [email.toLowerCase()]);
  const user = users[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ status: 'fail', message: 'Incorrect email or password.' });
  }

  const token = signToken(user);
  res.json({ status: 'success', data: { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } } });
};

const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ status: 'fail', message: 'Token is required.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const refreshToken = signToken({ id: decoded.id, role: decoded.role });
    res.json({ status: 'success', data: { token: refreshToken } });
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Invalid refresh token.' });
  }
};

const logout = async (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully.' });
};

const getMe = async (req, res) => {
  const users = await db.query('SELECT id, first_name AS firstName, last_name AS lastName, email, phone, role, created_at AS createdAt FROM users WHERE id = ?', [req.user.id]);
  const user = users[0];
  if (!user) return res.status(404).json({ status: 'fail', message: 'User not found.' });
  res.json({ status: 'success', data: { user } });
};

module.exports = { register, login, refreshToken, logout, getMe };
