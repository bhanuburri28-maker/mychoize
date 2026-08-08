const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createBooking, getBookings, getBookingById, cancelBooking, getMyBookings } = require('../controllers/bookingController');
const router = express.Router();

router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.get('/', protect, getBookings);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
