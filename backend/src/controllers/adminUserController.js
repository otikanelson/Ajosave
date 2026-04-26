const User = require('../models/Users');
const Wallet = require('../models/Wallets');
const Group = require('../models/Groups');
const { sendSuccess, sendError, sendListResponse } = require('../utils/responseHelpers');
const {
  createAuditLog,
  buildPaginationMeta,
  buildSortOptions
} = require('../utils/adminHelpers');

/**
 * Allowed sort fields for user list queries.
 * Maps friendly names to actual Mongoose field names.
 */
const SORT_FIELD_MAP = {
  name: 'firstName',
  joinDate: 'createdAt',
  kycStatus: 'isVerified'
};

const ALLOWED_SORT_FIELDS = Object.keys(SORT_FIELD_MAP);

/**
 * Build a Mongoose query filter from user list query params.
 *
 * @param {Object} query - Express req.query
 * @returns {Object} Mongoose filter object
 */
const buildUserFilter = (query) => {
  const filter = {};

  // Text search across firstName, lastName, phoneNumber, email
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { phoneNumber: regex },
      { email: regex }
    ];
  }

  // KYC status filter
  if (query.kycStatus) {
    switch (query.kycStatus) {
      case 'verified':
        filter.isVerified = true;
        break;
      case 'unverified':
        filter.isVerified = false;
        break;
      case 'faceVerified':
        filter.isFaceVerified = true;
        break;
      case 'faceUnverified':
        filter.isFaceVerified = false;
        break;
      default:
        break;
    }
  }

  // Account status filter
  if (query.accountStatus) {
    switch (query.accountStatus) {
      case 'active':
        filter.isActive = true;
        filter.isSuspended = false;
        filter.isDeactivated = false;
        break;
      case 'suspended':
        filter.isSuspended = true;
        break;
      case 'deactivated':
        filter.isDeactivated = true;
        break;
      default:
        break;
    }
  }

  return filter;
};

/**
 * GET /api/admin/users
 *
 * Returns a paginated list of users. Supports search, filtering by KYC/account
 * status, sorting, and pagination. Sensitive fields (password, bvn, nin) are
 * excluded by the User model's toJSON transform.
 */
const getUsers = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10) || 20;
    let offset = parseInt(req.query.offset, 10) || 0;

    if (limit > 1000) limit = 1000;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    const filter = buildUserFilter(req.query);

    // Build sort options — default to joinDate desc
    let sortOptions = { createdAt: -1 };
    if (req.query.sortBy) {
      if (!ALLOWED_SORT_FIELDS.includes(req.query.sortBy)) {
        return sendError(
          res,
          `Invalid sortBy field. Allowed fields: ${ALLOWED_SORT_FIELDS.join(', ')}`,
          400
        );
      }
      const mongoField = SORT_FIELD_MAP[req.query.sortBy];
      const direction = req.query.sortOrder === 'asc' ? 1 : -1;
      sortOptions = { [mongoField]: direction };
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sortOptions)
        .skip(offset)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    const pageSize = limit;
    const page = Math.floor(offset / pageSize) + 1;
    const paginationMeta = buildPaginationMeta(total, page, pageSize);

    return sendListResponse(res, users, paginationMeta, 'Users retrieved successfully');
  } catch (error) {
    console.error('getUsers error:', error);
    return sendError(res, 'Failed to retrieve users', 500);
  }
};

/**
 * GET /api/admin/users/:id
 *
 * Returns a single user by ID with wallet summary and group memberships.
 * Returns 404 if the user is not found.
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).lean();
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Fetch wallet summary
    const wallet = await Wallet.findOne({ userId: id })
      .select('totalBalance totalContributions availableBalance lockedBalance')
      .lean();

    // Fetch group memberships where this user appears in membersList
    const groups = await Group.find({ 'membersList.userId': id })
      .select('name status membersList')
      .lean();

    const groupMemberships = groups.map((group) => {
      const memberEntry = group.membersList.find(
        (m) => m.userId && m.userId.toString() === id.toString()
      );
      return {
        groupId: group._id,
        name: group.name,
        status: group.status,
        joinDate: memberEntry ? memberEntry.joinDate : null,
        role: memberEntry ? memberEntry.role : null,
        memberStatus: memberEntry ? memberEntry.status : null
      };
    });

    const responseData = {
      ...user,
      walletSummary: wallet
        ? {
            totalBalance: wallet.totalBalance,
            totalContributions: wallet.totalContributions,
            availableBalance: wallet.availableBalance,
            lockedBalance: wallet.lockedBalance
          }
        : null,
      groupMemberships
    };

    return sendSuccess(res, responseData, 'User retrieved successfully');
  } catch (error) {
    console.error('getUserById error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid user ID', 400);
    }
    return sendError(res, 'Failed to retrieve user', 500);
  }
};

/**
 * PUT /api/admin/users/:id/suspend
 *
 * Suspends a user account. Returns 404 if not found, 400 if already suspended.
 * Requires `reason` in the request body.
 */
const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (user.isSuspended) {
      return sendError(res, 'User is already suspended', 400);
    }

    user.isSuspended = true;
    user.suspendedAt = new Date();
    user.suspensionReason = reason || '';

    await user.save();

    await createAuditLog(
      req.admin._id,
      'user_suspended',
      'user',
      id,
      { reason: user.suspensionReason, suspendedAt: user.suspendedAt },
      req
    );

    return sendSuccess(res, user.toObject(), 'User suspended successfully');
  } catch (error) {
    console.error('suspendUser error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid user ID', 400);
    }
    return sendError(res, 'Failed to suspend user', 500);
  }
};

/**
 * PUT /api/admin/users/:id/activate
 *
 * Activates a user account, clearing suspension and deactivation flags.
 * Returns 404 if not found.
 */
const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    user.isSuspended = false;
    user.isDeactivated = false;
    user.isActive = true;
    user.suspensionReason = undefined;

    await user.save();

    await createAuditLog(
      req.admin._id,
      'user_activated',
      'user',
      id,
      { activatedAt: new Date() },
      req
    );

    return sendSuccess(res, user.toObject(), 'User activated successfully');
  } catch (error) {
    console.error('activateUser error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid user ID', 400);
    }
    return sendError(res, 'Failed to activate user', 500);
  }
};

/**
 * PUT /api/admin/users/:id/deactivate
 *
 * Deactivates a user account. Returns 404 if not found.
 */
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    user.isDeactivated = true;
    user.isActive = false;

    await user.save();

    await createAuditLog(
      req.admin._id,
      'user_deactivated',
      'user',
      id,
      { deactivatedAt: new Date() },
      req
    );

    return sendSuccess(res, user.toObject(), 'User deactivated successfully');
  } catch (error) {
    console.error('deactivateUser error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid user ID', 400);
    }
    return sendError(res, 'Failed to deactivate user', 500);
  }
};

/**
 * PUT /api/admin/users/:id/kyc/approve
 *
 * Approves KYC for a user. Returns 404 if not found, 400 if already verified.
 */
const approveKyc = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (user.isVerified) {
      return sendError(res, 'User KYC is already verified', 400);
    }

    user.isVerified = true;
    user.verifiedAt = new Date();

    await user.save();

    await createAuditLog(
      req.admin._id,
      'kyc_approved',
      'user',
      id,
      { verifiedAt: user.verifiedAt },
      req
    );

    return sendSuccess(res, user.toObject(), 'KYC approved successfully');
  } catch (error) {
    console.error('approveKyc error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid user ID', 400);
    }
    return sendError(res, 'Failed to approve KYC', 500);
  }
};

/**
 * PUT /api/admin/users/:id/kyc/reject
 *
 * Rejects KYC for a user. Stores the rejection reason in the audit log.
 * Returns 404 if not found.
 */
const rejectKyc = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    user.isVerified = false;

    await user.save();

    await createAuditLog(
      req.admin._id,
      'kyc_rejected',
      'user',
      id,
      { reason: reason || '', rejectedAt: new Date() },
      req
    );

    return sendSuccess(res, user.toObject(), 'KYC rejected successfully');
  } catch (error) {
    console.error('rejectKyc error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid user ID', 400);
    }
    return sendError(res, 'Failed to reject KYC', 500);
  }
};

/**
 * GET /api/admin/users/kyc/pending
 *
 * Returns a paginated list of users with pending KYC:
 * phone-verified but not yet identity-verified.
 */
const getPendingKyc = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10) || 20;
    let offset = parseInt(req.query.offset, 10) || 0;

    if (limit > 1000) limit = 1000;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    const filter = {
      isVerified: false,
      isPhoneVerified: true
    };

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    const pageSize = limit;
    const page = Math.floor(offset / pageSize) + 1;
    const paginationMeta = buildPaginationMeta(total, page, pageSize);

    return sendListResponse(res, users, paginationMeta, 'Pending KYC users retrieved successfully');
  } catch (error) {
    console.error('getPendingKyc error:', error);
    return sendError(res, 'Failed to retrieve pending KYC users', 500);
  }
};

module.exports = {
  getUsers,
  getUserById,
  suspendUser,
  activateUser,
  deactivateUser,
  approveKyc,
  rejectKyc,
  getPendingKyc
};
