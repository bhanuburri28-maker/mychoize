const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { getCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const router = express.Router();

router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', protect, restrictTo('admin'), createCar);
router.put('/:id', protect, restrictTo('admin'), updateCar);
router.delete('/:id', protect, restrictTo('admin'), deleteCar);

module.exports = router;
