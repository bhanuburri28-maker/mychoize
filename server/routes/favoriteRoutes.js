const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getFavorites, createFavorite, deleteFavorite } = require('../controllers/favoriteController');
const router = express.Router();

router.use(protect);
router.get('/', getFavorites);
router.post('/', createFavorite);
router.delete('/:id', deleteFavorite);

module.exports = router;
