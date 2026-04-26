const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middlewares/adminAuth');
const { bulkUserAction } = require('../controllers/adminBulkController');

// All routes require admin authentication
router.use(adminProtect);

// Bulk user actions
router.post('/users', bulkUserAction);

module.exports = router;
