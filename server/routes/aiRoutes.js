const express = require('express');
const { generateText } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/generate', generateText);

module.exports = router;
