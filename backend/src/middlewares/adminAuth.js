const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/config');
const {
  AuthenticationError,
  AuthorizationError,
  asyncErrorHandler
} = require('./errorHandler');

// Re-use the same token extraction logic from authMiddleware
const { extractToken, verifyToken } = require('./authMiddleware');

/**
 * Load Admin from Database
 *
 * Loads admin information from database and attaches to request object.
 *
 * @param {string} adminId - Admin ID from token
 * @returns {Object} Admin document from database
 * @throws {AuthenticationError} If admin not found or account issues
 */
const loadAdmin = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw new AuthenticationError('Admin account not found. Please login again');
    }

    if (!admin.isActive) {
      throw new AuthenticationError('Admin account has been deactivated');
    }

    return admin;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AuthenticationError('Invalid admin identifier');
    }
    throw error;
  }
};

/**
 * Admin Protect Middleware
 *
 * Protects admin routes by verifying JWT tokens with admin role claim
 * and loading the Admin document, attaching it to req.admin.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const adminProtect = asyncErrorHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new AuthenticationError('Access denied. No authentication token provided');
  }

  try {
    const decoded = verifyToken(token);

    // Ensure the token was issued for an admin (type claim check)
    if (decoded.type !== 'admin') {
      throw new AuthenticationError('Invalid token type. Admin token required');
    }

    req.admin = await loadAdmin(decoded.id);
    req.tokenDecoded = decoded;
    next();
  } catch (error) {
    if (req.cookies?.authToken) res.clearCookie('authToken');
    throw error;
  }
});

/**
 * Admin Authorize Middleware Factory
 *
 * Checks the authenticated admin's role against the list of allowed roles.
 * Must be used after adminProtect middleware.
 *
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware function
 */
const adminAuthorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      throw new AuthenticationError('Admin authentication required for this action');
    }

    if (!roles.includes(req.admin.role)) {
      throw new AuthorizationError(
        `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.admin.role}`
      );
    }

    next();
  };
};

/**
 * Require Admin Role
 *
 * Convenience middleware array that combines adminProtect with
 * adminAuthorize for all standard admin roles (admin, super_admin, moderator).
 *
 * Usage: router.get('/route', ...requireAdminRole, handler)
 */
const requireAdminRole = [
  adminProtect,
  adminAuthorize('admin', 'super_admin', 'moderator')
];

module.exports = {
  adminProtect,
  adminAuthorize,
  requireAdminRole,
  loadAdmin
};
