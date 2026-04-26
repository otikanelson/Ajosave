const AuditLog = require('../models/AuditLog');
const Admin = require('../models/Admin');
const { sendError, sendListResponse } = require('../utils/responseHelpers');
const {
  buildPaginationMeta,
  buildSortOptions
} = require('../utils/adminHelpers');

/**
 * Allowed sort fields for audit log list queries.
 */
const ALLOWED_SORT_FIELDS = ['timestamp', 'action'];

/**
 * Build a Mongoose query filter from audit log list query params.
 *
 * @param {Object} query - Express req.query
 * @returns {Object} Mongoose filter object
 */
const buildAuditFilter = (query) => {
  const filter = {};

  // Text search across admin name (via adminId) and entityId
  if (query.search) {
    // We'll handle admin name search after querying, but we can search entityId here
    filter.$or = [
      { entityId: new RegExp(query.search, 'i') }
    ];
  }

  // Action filter
  if (query.action) {
    filter.action = query.action;
  }

  // Date range filter
  if (query.startDate || query.endDate) {
    filter.timestamp = {};
    if (query.startDate) {
      const startDate = new Date(query.startDate);
      if (!isNaN(startDate.getTime())) {
        filter.timestamp.$gte = startDate;
      }
    }
    if (query.endDate) {
      const endDate = new Date(query.endDate);
      if (!isNaN(endDate.getTime())) {
        // Set to end of day
        endDate.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = endDate;
      }
    }
  }

  return filter;
};

/**
 * GET /api/admin/audit-logs
 *
 * Returns a paginated list of audit logs. Supports search (by admin name and entityId),
 * filtering by action and date range, sorting, and pagination.
 * Populates adminId with admin name and email.
 */
const getAuditLogs = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10) || 20;
    let offset = parseInt(req.query.offset, 10) || 0;
    const sortBy = req.query.sortBy || 'timestamp';
    const sortOrder = req.query.sortOrder || 'desc';

    // Validate and cap pagination
    if (limit > 1000) limit = 1000;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    // Validate sort field
    let sortOptions;
    try {
      sortOptions = buildSortOptions(sortBy, sortOrder, ALLOWED_SORT_FIELDS);
    } catch (error) {
      return sendError(res, error.message, 400);
    }

    // Build filter
    const filter = buildAuditFilter(req.query);

    // Execute query with pagination and sorting
    const [auditLogs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('adminId', 'name email')
        .sort(sortOptions)
        .limit(limit)
        .skip(offset)
        .lean(),
      AuditLog.countDocuments(filter)
    ]);

    // Handle search by admin name if provided
    let filteredLogs = auditLogs;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filteredLogs = auditLogs.filter(log => {
        // Check if admin name matches
        if (log.adminId && log.adminId.name) {
          return searchRegex.test(log.adminId.name);
        }
        return false;
      });
    }

    // Calculate pagination metadata
    const page = Math.floor(offset / limit) + 1;
    const paginationMeta = buildPaginationMeta(total, page, limit);

    return sendListResponse(res, filteredLogs, paginationMeta, 'Audit logs retrieved successfully');
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return sendError(res, 'Failed to fetch audit logs', 500);
  }
};

module.exports = {
  getAuditLogs
};
