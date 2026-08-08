const db = require('../config/db');

const createContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ status: 'fail', message: 'Missing required contact fields.' });
  }
  await db.query(
    'INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
    [name.trim(), email.toLowerCase(), phone || '', subject.trim(), message.trim(), 'new']
  );
  res.status(201).json({ status: 'success', message: 'Message submitted successfully.' });
};

const getContacts = async (req, res) => {
  const contacts = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
  res.json({ status: 'success', data: { contacts } });
};

module.exports = { createContact, getContacts };
