const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const router = express.Router();

router.get('/', getReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
