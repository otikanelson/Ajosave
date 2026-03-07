const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  verifyUser, 
  logoutUser, 
  getCurrentUser, 
  refreshToken,
  sendOtp,
  verifyOtpHandler,
  verifyFace,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { protect, requireVerification } = require('../middlewares/authMiddleware');

const { 
  validateRegistration, 
  validateLogin, 
  validateVerification 
} = require('../middlewares/validation');

// Sensitive routes — rate limiting disabled during debugging
router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpHandler);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Non-sensitive routes — no auth rate limit
router.put('/verify', protect, validateVerification, verifyUser);
router.post('/verify-face', protect, verifyFace);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getCurrentUser);
router.post('/refresh', protect, refreshToken);

router.get('/profile', protect, requireVerification, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to verified user profile',
    user: req.user
  });
});

module.exports = router;