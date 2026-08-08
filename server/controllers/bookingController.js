const db = require('../config/db');

const createBooking = async (req, res) => {
  const { carId, pickup, dropoff, pickupDate, pickupTime, returnDate, returnTime, price, notes } = req.body;
  if (!pickup || !dropoff || !pickupDate || !returnDate || !pickupTime || !returnTime) {
    return res.status(400).json({ status: 'fail', message: 'Missing required booking fields.' });
  }

  const [defaultStatus] = await db.query("SELECT id FROM booking_status WHERE code = 'pending' LIMIT 1");
  if (!defaultStatus) {
    return res.status(500).json({ status: 'error', message: 'Booking status configuration is missing. Please seed booking_status values.' });
  }

  const pickupDateTime = `${pickupDate} ${pickupTime}`;
  const returnDateTime = `${returnDate} ${returnTime}`;

  const safeCarId = carId && Number.isInteger(Number(carId)) ? Number(carId) : null;
  if (safeCarId) {
    const [existingCar] = await db.query('SELECT id FROM cars WHERE id = ? LIMIT 1', [safeCarId]);
    if (!existingCar) {
      return res.status(400).json({ status: 'fail', message: 'The selected car does not exist.' });
    }
  }

  const result = await db.query(
    'INSERT INTO bookings (user_id, car_id, booking_status_id, pickup_location, dropoff_location, pickup_datetime, return_datetime, price_total, currency, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
    [req.user.id, safeCarId, defaultStatus.id, pickup, dropoff, pickupDateTime, returnDateTime, price || 0.0, 'USD', notes || null, 'pending']
  );

  res.status(201).json({ status: 'success', data: { bookingId: result.insertId } });
};

const getMyBookings = async (req, res) => {
  const bookings = await db.query(`
    SELECT id, user_id AS userId, car_id AS carId, booking_status_id AS bookingStatusId, pickup_location AS pickupLocation,
           dropoff_location AS dropoffLocation, pickup_datetime AS pickupDateTime, return_datetime AS returnDateTime,
           price_total AS priceTotal, currency, notes, status, created_at AS createdAt
    FROM bookings WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id]);
  res.json({ status: 'success', data: { bookings } });
};

const getBookings = async (req, res) => {
  const bookings = await db.query(`
    SELECT id, user_id AS userId, car_id AS carId, booking_status_id AS bookingStatusId, pickup_location AS pickupLocation,
           dropoff_location AS dropoffLocation, pickup_datetime AS pickupDateTime, return_datetime AS returnDateTime,
           price_total AS priceTotal, currency, notes, status, created_at AS createdAt
    FROM bookings ORDER BY created_at DESC`);
  res.json({ status: 'success', data: { bookings } });
};

const getBookingById = async (req, res) => {
  const bookings = await db.query(`
    SELECT id, user_id AS userId, car_id AS carId, booking_status_id AS bookingStatusId, pickup_location AS pickupLocation,
           dropoff_location AS dropoffLocation, pickup_datetime AS pickupDateTime, return_datetime AS returnDateTime,
           price_total AS priceTotal, currency, notes, status, created_at AS createdAt
    FROM bookings WHERE id = ?`, [req.params.id]);
  const booking = bookings[0];
  if (!booking) return res.status(404).json({ status: 'fail', message: 'Booking not found.' });
  res.json({ status: 'success', data: { booking } });
};

const cancelBooking = async (req, res) => {
  await db.query('UPDATE bookings SET status = ?, booking_status_id = (SELECT id FROM booking_status WHERE code = ? LIMIT 1), cancelled_at = NOW() WHERE id = ? AND user_id = ?', ['cancelled', 'cancelled', req.params.id, req.user.id]);
  res.json({ status: 'success', message: 'Booking cancelled.' });
};

module.exports = { createBooking, getMyBookings, getBookings, getBookingById, cancelBooking };
