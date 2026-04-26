const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/config');
const { createAuditLog } = require('../utils/adminHelpers');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const {
  AuthenticationError,
  ValidationError,
  asyncErrorHandler
} = require('../middlewares/errorHandler');

/**
 * Generate Admin JWT Token
 *
 * Issues a JWT with admin-specific claims: id, role, and type='admin'.
 *
 * @param {Object} admin - Admin document from database
 * @param {string} [expiresIn] - Token expiration (defaults to config value)
 * @returns {string} Signed JWT token
 */
const generateAdminToken = (admin, expiresIn = config.jwt.expiresIn) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      type: 'admin'
    },
    config.jwt.secret,
    { expiresIn }
  );
};

/**
 * Set Admin Auth Cookie
 *
 * Sets an httpOnly cookie with the admin JWT token.
 *
 * @param {Object} res - Express response object
 * @param {string} token - JWT token
 */
const setAdminAuthCookie = (res, token) => {
  res.cookie('adminAuthToken', token, {
    ...config.security.cookie
  });
};

/**
 * Clear Admin Auth Cookie
 *
 * Clears the admin authentication cookie (used on logout).
 *
 * @param {Object} res - Express response object
 */
const clearAdminAuthCookie = (res) => {
  res.cookie('adminAuthToken', '', {
    ...config.security.cookie,
    maxAge: 0
  });
};

/**
 * Admin Login
 *
 * @route   POST /api/admin/auth/login
 * @desc    Authenticate admin with email and password, issue JWT
 * @access  Public
 */
const adminLogin = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find admin by email, explicitly select password (excluded by default)
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!admin) {
    throw new AuthenticationError('Invalid email or password');
  }

  if (!admin.isActive) {
    throw new AuthenticationError('Admin account has been deactivated');
  }

  const isPasswordValid = await admin.matchPassword(password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Update last login timestamp
  admin.lastLoginAt = new Date();
  await admin.save();

  // Issue JWT with admin claims
  const token = generateAdminToken(admin);
  setAdminAuthCookie(res, token);

  // Create audit log (non-blocking — failure won't break login)
  await createAuditLog(admin._id, 'admin_login', 'admin', admin._id, null, req);

  return sendSuccess(
    res,
    {
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        preferences: admin.preferences,
        lastLoginAt: admin.lastLoginAt
      },
      token
    },
    'Login successful'
  );
});

/**
 * Admin Logout
 *
 * @route   POST /api/admin/auth/logout
 * @desc    Clear admin auth cookie and create audit log
 * @access  Protected (adminProtect)
 */
const adminLogout = asyncErrorHandler(async (req, res) => {
  const adminId = req.admin._id;

  clearAdminAuthCookie(res);

  await createAuditLog(adminId, 'admin_logout', 'admin', adminId, null, req);

  return sendSuccess(res, null, 'Logout successful');
});

/**
 * Admin Refresh Token
 *
 * @route   POST /api/admin/auth/refresh
 * @desc    Issue a new JWT for the authenticated admin
 * @access  Protected (adminProtect)
 */
const adminRefreshToken = asyncErrorHandler(async (req, res) => {
  const admin = req.admin;

  const newToken = generateAdminToken(admin);
  setAdminAuthCookie(res, newToken);

  return sendSuccess(res, { token: newToken }, 'Token refreshed successfully');
});

/**
 * Get Admin Profile
 *
 * @route   GET /api/admin/auth/profile
 * @desc    Return the authenticated admin's profile (password excluded)
 * @access  Protected (adminProtect)
 */
const getAdminProfile = asyncErrorHandler(async (req, res) => {
  // req.admin is already loaded by adminProtect (password excluded by model default)
  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    throw new AuthenticationError('Admin not found');
  }

  return sendSuccess(
    res,
    {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      lastLoginAt: admin.lastLoginAt,
      preferences: admin.preferences,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    },
    'Profile retrieved successfully'
  );
});

/**
 * Update Admin Profile
 *
 * @route   PUT /api/admin/auth/profile
 * @desc    Update admin name and/or preferences, create audit log
 * @access  Protected (adminProtect)
 */
const updateAdminProfile = asyncErrorHandler(async (req, res) => {
  const adminId = req.admin._id;
  const { name, preferences } = req.body;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new AuthenticationError('Admin not found');
  }

  const oldValues = {
    name: admin.name,
    preferences: admin.preferences
  };

  // Apply updates selectively
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters');
    }
    admin.name = name.trim();
  }

  if (preferences !== undefined) {
    if (typeof preferences !== 'object' || Array.isArray(preferences)) {
      throw new ValidationError('Preferences must be an object');
    }

    // Merge preferences rather than replace entirely
    if (preferences.language !== undefined) {
      admin.preferences.language = preferences.language;
    }
    if (preferences.timezone !== undefined) {
      admin.preferences.timezone = preferences.timezone;
    }
    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications === 'object') {
        Object.assign(admin.preferences.notifications, preferences.notifications);
      }
    }
  }

  const updatedAdmin = await admin.save();

  await createAuditLog(
    adminId,
    'setting_changed',
    'admin',
    adminId,
    { oldValues, newValues: { name: updatedAdmin.name, preferences: updatedAdmin.preferences } },
    req
  );

  return sendSuccess(
    res,
    {
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      preferences: updatedAdmin.preferences,
      updatedAt: updatedAdmin.updatedAt
    },
    'Profile updated successfully'
  );
});

/**
 * Update Admin Password
 *
 * @route   PUT /api/admin/auth/password
 * @desc    Validate current password, hash and save new password, create audit log
 * @access  Protected (adminProtect)
 */
const updateAdminPassword = asyncErrorHandler(async (req, res) => {
  const adminId = req.admin._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError('currentPassword and newPassword are required');
  }

  if (newPassword.length < 6) {
    throw new ValidationError('New password must be at least 6 characters');
  }

  // Load admin with password field
  const admin = await Admin.findById(adminId).select('+password');
  if (!admin) {
    throw new AuthenticationError('Admin not found');
  }

  const isCurrentPasswordValid = await admin.matchPassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Assign new password — pre-save hook will hash it
  admin.password = newPassword;
  await admin.save();

  await createAuditLog(
    adminId,
    'setting_changed',
    'admin',
    adminId,
    { action: 'password_changed' },
    req
  );

  return sendSuccess(res, null, 'Password updated successfully');
});

module.exports = {
  adminLogin,
  adminLogout,
  adminRefreshToken,
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword
};
