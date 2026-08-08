const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { getAdminStats, getUserStats } = require('../controllers/dashboardController');
const router = express.Router();

router.use(protect);
router.get('/admin', restrictTo('admin'), getAdminStats);
router.get('/user', getUserStats);

module.exports = router;
