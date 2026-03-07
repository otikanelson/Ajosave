// backend/src/routes/groupRoutes.js - UPDATED

const express = require('express');
const router = express.Router();

const {
  createGroup,
  getUserGroups,
  getGroupById,
  findGroupByCode,
  joinGroup,
  processPayout, // NEW
  updateGroupStatus,
  getGroupStats
} = require('../controllers/groupContoller');

const { protect, requireVerification } = require('../middlewares/authMiddleware');
const { sanitizeInput } = require('../middlewares/validation');

// Apply authentication to all routes
router.use(protect);
router.use(sanitizeInput);

// Group CRUD operations
router.post('/', /* requireVerification, */ createGroup); // TODO: re-enable in production
router.get('/', getUserGroups);

// Group joining - must be BEFORE /:id to avoid route conflict
router.get('/find/:code', findGroupByCode);

router.get('/:id', getGroupById);
router.get('/:id/stats', getGroupStats);
router.post('/:id/join', /* requireVerification, */ joinGroup); // TODO: re-enable in production

// Group management (admin only)
router.put('/:id/status', /* requireVerification, */ updateGroupStatus); // TODO: re-enable in production
router.post('/:id/process-payout', /* requireVerification, */ processPayout); // TODO: re-enable in production

module.exports = router;