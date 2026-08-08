const db = require('../config/db');

const normalizeCar = (car) => {
  if (!car) return car;
  const { vehicleType, ...rest } = car;
  return { ...rest, type: vehicleType || rest.type || null };
};

const getCars = async (req, res) => {
  const cars = await db.query(`
    SELECT
      id,
      make,
      model,
      vehicle_type AS vehicleType,
      price_per_day AS pricePerDay,
      seats,
      transmission,
      fuel_type AS fuel,
      image_url AS imageUrl,
      description,
      category_id AS categoryId,
      status,
      is_active AS isActive
    FROM cars
    WHERE is_active = TRUE
    ORDER BY created_at DESC
  `);
  res.json({ status: 'success', data: { cars: cars.map(normalizeCar) } });
};

const getCarById = async (req, res) => {
  const cars = await db.query(`
    SELECT
      id,
      make,
      model,
      vehicle_type AS vehicleType,
      price_per_day AS pricePerDay,
      seats,
      transmission,
      fuel_type AS fuel,
      image_url AS imageUrl,
      description,
      category_id AS categoryId,
      status,
      is_active AS isActive
    FROM cars WHERE id = ?`, [req.params.id]);
  const car = normalizeCar(cars[0]);
  if (!car) return res.status(404).json({ status: 'fail', message: 'Car not found.' });
  res.json({ status: 'success', data: { car } });
};

const createCar = async (req, res) => {
  const { make, model, type, pricePerDay, seats, transmission, fuel, imageUrl, description, categoryId, status, isActive } = req.body;
  const result = await db.query(
    'INSERT INTO cars (make, model, vehicle_type, price_per_day, seats, transmission, fuel_type, image_url, description, category_id, status, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
    [make, model, type || 'Sedan', pricePerDay, seats || null, transmission || 'automatic', fuel || 'petrol', imageUrl || '', description || '', categoryId || null, status || 'available', isActive === false ? 0 : 1]
  );
  res.status(201).json({ status: 'success', data: { id: result.insertId } });
};

const updateCar = async (req, res) => {
  const { make, model, type, pricePerDay, seats, transmission, fuel, imageUrl, description, categoryId, status, isActive } = req.body;
  await db.query(
    'UPDATE cars SET make = ?, model = ?, vehicle_type = ?, price_per_day = ?, seats = ?, transmission = ?, fuel_type = ?, image_url = ?, description = ?, category_id = ?, status = ?, is_active = ? WHERE id = ?',
    [make, model, type || 'Sedan', pricePerDay, seats || null, transmission || 'automatic', fuel || 'petrol', imageUrl || '', description || '', categoryId || null, status || 'available', isActive === false ? 0 : 1, req.params.id]
  );
  res.json({ status: 'success', message: 'Car updated.' });
};

const deleteCar = async (req, res) => {
  await db.query('DELETE FROM cars WHERE id = ?', [req.params.id]);
  res.json({ status: 'success', message: 'Car deleted.' });
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar };
