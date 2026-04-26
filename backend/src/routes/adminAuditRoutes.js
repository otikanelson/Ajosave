const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middlewares/adminAuth');
const { getAuditLogs } = require('../controllers/adminAuditController');

// All routes require admin authentication
router.use(adminProtect);

// List audit logs
router.get('/', getAuditLogs);

module.exports = router;
