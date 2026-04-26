const Settings = require('../models/Settings');
const { createAuditLog } = require('../utils/adminHelpers');
const { sendSuccess, sendError, sendListResponse } = require('../utils/responseHelpers');
const {
  ValidationError,
  NotFoundError,
  asyncErrorHandler
} = require('../middlewares/errorHandler');

/**
 * Validation Rules for Settings
 *
 * Defines expected types and ranges for each setting key.
 * Used to validate new values before updating.
 */
const SETTING_VALIDATION_RULES = {
  maxgroupsize: {
    type: 'number',
    min: 1,
    max: 10000,
    description: 'Must be a positive integer between 1 and 10000'
  },
  mincontributionamount: {
    type: 'number',
    min: 0,
    description: 'Must be a non-negative number'
  },
  maxcontributionamount: {
    type: 'number',
    min: 0,
    description: 'Must be a non-negative number'
  },
  maxtransactionamount: {
    type: 'number',
    min: 0,
    description: 'Must be a non-negative number'
  },
  maxwithdrawalamount: {
    type: 'number',
    min: 0,
    description: 'Must be a non-negative number'
  },
  kycrequired: {
    type: 'boolean',
    description: 'Must be a boolean value (true or false)'
  },
  maintenancemode: {
    type: 'boolean',
    description: 'Must be a boolean value (true or false)'
  }
};

/**
 * Validate Setting Value
 *
 * Validates a new setting value against the defined validation rules.
 *
 * @param {string} key - Setting key
 * @param {*} value - New value to validate
 * @throws {ValidationError} If validation fails
 */
const validateSettingValue = (key, value) => {
  const rule = SETTING_VALIDATION_RULES[key.toLowerCase()];

  if (!rule) {
    throw new ValidationError(`Unknown setting key: ${key}`);
  }

  // Type validation
  const actualType = typeof value;
  if (actualType !== rule.type) {
    throw new ValidationError(
      `Invalid type for setting '${key}'. Expected ${rule.type}, got ${actualType}. ${rule.description}`
    );
  }

  // Range validation for numbers
  if (rule.type === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      throw new ValidationError(
        `Setting '${key}' value must be >= ${rule.min}. ${rule.description}`
      );
    }
    if (rule.max !== undefined && value > rule.max) {
      throw new ValidationError(
        `Setting '${key}' value must be <= ${rule.max}. ${rule.description}`
      );
    }
  }
};

/**
 * Get Settings
 *
 * @route   GET /api/admin/settings
 * @desc    Query all Settings documents, optionally filter by category
 * @access  Protected (admin)
 * @query   {string} [category] - Optional category filter (transactions, groups, users, system)
 */
const getSettings = asyncErrorHandler(async (req, res) => {
  const { category } = req.query;

  const query = {};
  if (category) {
    query.category = category;
  }

  const settings = await Settings.find(query).sort({ category: 1, key: 1 });

  return sendSuccess(res, settings, 'Settings retrieved successfully');
});

/**
 * Update Setting
 *
 * @route   PUT /api/admin/settings/:key
 * @desc    Find setting by key, validate new value, update and create audit log
 * @access  Protected (admin)
 * @param   {string} key - Setting key
 * @body    {*} value - New value for the setting
 */
const updateSetting = asyncErrorHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (value === undefined || value === null) {
    throw new ValidationError('Value is required');
  }

  // Validate the new value
  validateSettingValue(key, value);

  // Find the setting
  const setting = await Settings.findOne({ key: key.toLowerCase() });

  if (!setting) {
    throw new NotFoundError(`Setting with key '${key}' not found`);
  }

  // Store old value for audit log
  const oldValue = setting.value;

  // Update the setting
  setting.value = value;
  setting.updatedBy = req.admin._id;
  setting.updatedAt = new Date();

  await setting.save();

  // Create audit log with old and new values
  await createAuditLog(
    req.admin._id,
    'setting_changed',
    'setting',
    setting._id,
    {
      key: setting.key,
      oldValue,
      newValue: value
    },
    req
  );

  return sendSuccess(res, setting, 'Setting updated successfully');
});

module.exports = {
  getSettings,
  updateSetting
};
