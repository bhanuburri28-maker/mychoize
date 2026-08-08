const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { processPayment, getPayments, getPaymentById } = require('../controllers/paymentController');
const router = express.Router();

router.use(protect);
router.post('/', processPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);

module.exports = router;
