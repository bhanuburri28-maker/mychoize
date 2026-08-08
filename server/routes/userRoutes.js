const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.use(protect);
router.get('/', restrictTo('admin'), getUsers);
router.get('/:id', restrictTo('admin'), getUserById);
router.put('/:id', restrictTo('admin'), updateUser);
router.delete('/:id', restrictTo('admin'), deleteUser);

module.exports = router;
