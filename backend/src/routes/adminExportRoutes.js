const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middlewares/adminAuth');
const {
  exportUsers,
  exportTransactions,
  exportAuditLogs
} = require('../controllers/adminExportController');

// All routes require admin authentication
router.use(adminProtect);

// Export endpoints
router.get('/users', exportUsers);
router.get('/transactions', exportTransactions);
router.get('/audit-logs', exportAuditLogs);

module.exports = router;
