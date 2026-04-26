const express = require('express');
const router = express.Router();

const { getAnalytics } = require('../controllers/adminAnalyticsController');
const { adminProtect } = require('../middlewares/adminAuth');

// All analytics routes require a valid admin JWT
router.get('/', adminProtect, getAnalytics);

module.exports = router;
