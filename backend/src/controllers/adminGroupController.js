const Group = require('../models/Groups');
const Transaction = require('../models/Transactions');
const User = require('../models/Users');
const { sendSuccess, sendError, sendListResponse } = require('../utils/responseHelpers');
const {
  createAuditLog,
  buildPaginationMeta,
  buildSortOptions
} = require('../utils/adminHelpers');

/**
 * Allowed sort fields for group list queries.
 * Maps friendly names to actual Mongoose field names.
 */
const SORT_FIELD_MAP = {
  name: 'name',
  totalPool: 'totalPool',
  status: 'status',
  nextPayout: 'nextPayout'
};

const ALLOWED_SORT_FIELDS = Object.keys(SORT_FIELD_MAP);

/**
 * Build a Mongoose query filter from group list query params.
 *
 * @param {Object} query - Express req.query
 * @returns {Object} Mongoose filter object
 */
const buildGroupFilter = (query) => {
  const filter = {};

  // Text search on group name
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.name = regex;
  }

  // Status filter
  if (query.status) {
    const validStatuses = ['pending', 'active', 'completed', 'cancelled'];
    if (validStatuses.includes(query.status)) {
      filter.status = query.status;
    }
  }

  return filter;
};

/**
 * GET /api/admin/groups
 *
 * Returns a paginated list of groups. Supports search, filtering by status,
 * sorting, and pagination. Populates admin field with firstName and lastName.
 * Returns member count, totalPool, status, and nextPayout.
 */
const getGroups = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10) || 20;
    let offset = parseInt(req.query.offset, 10) || 0;

    if (limit > 1000) limit = 1000;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    const filter = buildGroupFilter(req.query);

    // Build sort options — default to createdAt desc
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

    const [groups, total] = await Promise.all([
      Group.find(filter)
        .populate('admin', 'firstName lastName')
        .sort(sortOptions)
        .skip(offset)
        .limit(limit)
        .lean(),
      Group.countDocuments(filter)
    ]);

    // Transform groups to include member count
    const transformedGroups = groups.map((group) => ({
      ...group,
      memberCount: group.members ? group.members.length : 0
    }));

    const pageSize = limit;
    const page = Math.floor(offset / pageSize) + 1;
    const paginationMeta = buildPaginationMeta(total, page, pageSize);

    return sendListResponse(res, transformedGroups, paginationMeta, 'Groups retrieved successfully');
  } catch (error) {
    console.error('getGroups error:', error);
    return sendError(res, 'Failed to retrieve groups', 500);
  }
};

/**
 * GET /api/admin/groups/:id
 *
 * Returns a single group by ID with:
 * - Admin details (name, email, phone)
 * - Members list with user details (firstName, lastName, phoneNumber)
 * - Recent transactions (last 10) for this group
 * Returns 404 if not found.
 */
const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id)
      .populate('admin', 'firstName lastName email phoneNumber')
      .populate('members', 'firstName lastName phoneNumber')
      .lean();

    if (!group) {
      return sendError(res, 'Group not found', 404);
    }

    // Fetch recent transactions (last 10) for this group
    const recentTransactions = await Transaction.find({ groupId: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Populate membersList.userId with user details
    let populatedMembersList = group.membersList || [];
    if (populatedMembersList.length > 0) {
      const userIds = populatedMembersList.map((m) => m.userId);
      const users = await User.find({ _id: { $in: userIds } })
        .select('firstName lastName phoneNumber')
        .lean();

      const userMap = {};
      users.forEach((user) => {
        userMap[user._id.toString()] = user;
      });

      populatedMembersList = populatedMembersList.map((member) => ({
        ...member,
        userId: userMap[member.userId.toString()] || member.userId
      }));
    }

    const responseData = {
      ...group,
      membersList: populatedMembersList,
      recentTransactions
    };

    return sendSuccess(res, responseData, 'Group retrieved successfully');
  } catch (error) {
    console.error('getGroupById error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid group ID', 400);
    }
    return sendError(res, 'Failed to retrieve group', 500);
  }
};

/**
 * PUT /api/admin/groups/:id/status
 *
 * Updates the status of a group. Validates that the new status is a valid enum value.
 * Creates an audit log with old and new status.
 * Returns 404 if not found.
 */
const updateGroupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const group = await Group.findById(id);
    if (!group) {
      return sendError(res, 'Group not found', 404);
    }

    // Validate status is a valid enum value
    const validStatuses = ['pending', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return sendError(
        res,
        `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
        400
      );
    }

    const oldStatus = group.status;
    group.status = status;

    await group.save();

    await createAuditLog(
      req.admin._id,
      'group_modified',
      'group',
      id,
      { oldStatus, newStatus: status, changedField: 'status' },
      req
    );

    return sendSuccess(res, group.toObject(), 'Group status updated successfully');
  } catch (error) {
    console.error('updateGroupStatus error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid group ID', 400);
    }
    return sendError(res, 'Failed to update group status', 500);
  }
};

/**
 * PUT /api/admin/groups/:id/settings
 *
 * Updates group settings. Allows updating:
 * - contributionAmount
 * - frequency
 * - maxMembers
 * - description
 *
 * Creates an audit log with changed fields.
 * Returns 404 if not found.
 */
const updateGroupSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { contributionAmount, frequency, maxMembers, description } = req.body;

    const group = await Group.findById(id);
    if (!group) {
      return sendError(res, 'Group not found', 404);
    }

    const changedFields = {};

    // Update contributionAmount if provided
    if (contributionAmount !== undefined) {
      changedFields.contributionAmount = {
        oldValue: group.contributionAmount,
        newValue: contributionAmount
      };
      group.contributionAmount = contributionAmount;
    }

    // Update frequency if provided
    if (frequency !== undefined) {
      const validFrequencies = ['Weekly', 'Bi-Weekly', 'Monthly'];
      if (!validFrequencies.includes(frequency)) {
        return sendError(
          res,
          `Invalid frequency. Allowed values: ${validFrequencies.join(', ')}`,
          400
        );
      }
      changedFields.frequency = {
        oldValue: group.frequency,
        newValue: frequency
      };
      group.frequency = frequency;
    }

    // Update maxMembers if provided
    if (maxMembers !== undefined) {
      changedFields.maxMembers = {
        oldValue: group.maxMembers,
        newValue: maxMembers
      };
      group.maxMembers = maxMembers;
    }

    // Update description if provided
    if (description !== undefined) {
      changedFields.description = {
        oldValue: group.description,
        newValue: description
      };
      group.description = description;
    }

    // Only save and log if something changed
    if (Object.keys(changedFields).length === 0) {
      return sendError(res, 'No fields to update', 400);
    }

    await group.save();

    await createAuditLog(
      req.admin._id,
      'group_modified',
      'group',
      id,
      { changedFields },
      req
    );

    return sendSuccess(res, group.toObject(), 'Group settings updated successfully');
  } catch (error) {
    console.error('updateGroupSettings error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid group ID', 400);
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return sendError(res, 'Validation error', 400, messages);
    }
    return sendError(res, 'Failed to update group settings', 500);
  }
};

module.exports = {
  getGroups,
  getGroupById,
  updateGroupStatus,
  updateGroupSettings
};
