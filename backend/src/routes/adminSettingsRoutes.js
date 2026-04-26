const express = require('express');
const router = express.Router();

const {
  getSettings,
  updateSetting
} = require('../controllers/adminSettingsController');

const { adminProtect } = require('../middlewares/adminAuth');

// All routes protected with adminProtect
router.get('/', adminProtect, getSettings);
router.put('/:key', adminProtect, updateSetting);

module.exports = router;
