const express = require('express');
const { createContact, getContacts } = require('../controllers/contactController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createContact);
router.get('/', protect, restrictTo('admin'), getContacts);

module.exports = router;
