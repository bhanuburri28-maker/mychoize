const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getNotifications, markRead, createNotification } = require('../controllers/notificationController');
const router = express.Router();

router.use(protect);
router.get('/', getNotifications);
router.post('/', createNotification);
router.patch('/:id/read', markRead);

module.exports = router;
