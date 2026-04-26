const express = require('express');
const router = express.Router();

const {
  adminLogin,
  adminLogout,
  adminRefreshToken,
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword
} = require('../controllers/adminAuthController');

const { adminProtect } = require('../middlewares/adminAuth');

// Public routes
router.post('/login', adminLogin);

// Protected routes — require valid admin JWT
router.post('/logout', adminProtect, adminLogout);
router.post('/refresh', adminProtect, adminRefreshToken);
router.get('/profile', adminProtect, getAdminProfile);
router.put('/profile', adminProtect, updateAdminProfile);
router.put('/password', adminProtect, updateAdminPassword);

module.exports = router;
