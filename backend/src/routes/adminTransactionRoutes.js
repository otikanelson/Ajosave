const express = require('express');
const {
  getTransactions,
  getTransactionById,
  reverseTransaction,
  markTransactionFailed
} = require('../controllers/adminTransactionController');
const { adminProtect } = require('../middlewares/adminAuth');

const router = express.Router();

// All routes protected with adminProtect
router.use(adminProtect);

/**
 * GET /
 * Get paginated list of transactions with filtering and sorting
 */
router.get('/', getTransactions);

/**
 * GET /:id
 * Get transaction by ID or transactionId
 */
router.get('/:id', getTransactionById);

/**
 * POST /:id/reverse
 * Reverse a completed transaction
 */
router.post('/:id/reverse', reverseTransaction);

/**
 * POST /:id/fail
 * Mark a pending transaction as failed
 */
router.post('/:id/fail', markTransactionFailed);

module.exports = router;
