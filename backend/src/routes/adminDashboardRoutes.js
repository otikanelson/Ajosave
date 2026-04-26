const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getRecentActivities,
  getAlerts,
  dismissAlert
} = require('../controllers/adminDashboardController');

const { adminProtect } = require('../middlewares/adminAuth');

// All dashboard routes require a valid admin JWT
router.get('/stats', adminProtect, getDashboardStats);
router.get('/activities', adminProtect, getRecentActivities);
router.get('/alerts', adminProtect, getAlerts);
router.post('/alerts/:id/dismiss', adminProtect, dismissAlert);

module.exports = router;
