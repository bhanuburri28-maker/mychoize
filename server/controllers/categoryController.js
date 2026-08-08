const db = require('../config/db');

const getCategories = async (req, res) => {
  const categories = await db.query('SELECT id, name, description, is_active AS isActive FROM car_categories');
  res.json({ status: 'success', data: { categories } });
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ status: 'fail', message: 'Category name is required.' });
  const result = await db.query(
    'INSERT INTO car_categories (name, description, created_at) VALUES (?, ?, NOW())',
    [name, description || '']
  );
  res.status(201).json({ status: 'success', data: { id: result.insertId } });
};

const updateCategory = async (req, res) => {
  const { name, description, isActive } = req.body;
  await db.query(
    'UPDATE car_categories SET name = ?, description = ?, is_active = ? WHERE id = ?',
    [name, description || '', isActive === false ? 0 : 1, req.params.id]
  );
  res.json({ status: 'success', message: 'Category updated.' });
};

const deleteCategory = async (req, res) => {
  await db.query('DELETE FROM car_categories WHERE id = ?', [req.params.id]);
  res.json({ status: 'success', message: 'Category deleted.' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
