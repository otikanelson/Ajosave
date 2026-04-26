const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middlewares/adminAuth');
const {
  getGroups,
  getGroupById,
  updateGroupStatus,
  updateGroupSettings
} = require('../controllers/adminGroupController');

// All routes require admin authentication
router.use(adminProtect);

// List groups
router.get('/', getGroups);

// Single group
router.get('/:id', getGroupById);

// Update group status
router.put('/:id/status', updateGroupStatus);

// Update group settings
router.put('/:id/settings', updateGroupSettings);

module.exports = router;
