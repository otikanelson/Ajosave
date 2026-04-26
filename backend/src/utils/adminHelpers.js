const AuditLog = require('../models/AuditLog');

/**
 * Create Audit Log
 *
 * Async helper that creates an AuditLog document recording an admin action.
 *
 * @param {string|ObjectId} adminId - ID of the admin performing the action
 * @param {string} action - Action type (must match AuditLog action enum)
 * @param {string} entityType - Type of entity affected (user, group, transaction, setting, admin)
 * @param {string} [entityId] - ID of the affected entity
 * @param {*} [details] - Additional details about the action
 * @param {Object} [req] - Express request object (used to extract IP and user agent)
 * @returns {Promise<Object>} The created AuditLog document
 */
const createAuditLog = async (adminId, action, entityType, entityId, details, req) => {
  try {
    const logData = {
      adminId,
      action,
      entityType,
      entityId: entityId ? String(entityId) : undefined,
      details
    };

    if (req) {
      logData.ipAddress = req.ip || req.connection?.remoteAddress;
      logData.userAgent = req.get ? req.get('User-Agent') : undefined;
    }

    const auditLog = await AuditLog.create(logData);
    return auditLog;
  } catch (error) {
    // Log the error but don't throw — audit log failures should not break the main operation
    console.error('Failed to create audit log:', error.message, { adminId, action, entityType, entityId });
    return null;
  }
};

/**
 * Build Pagination Meta
 *
 * Returns a pagination metadata object for list responses.
 *
 * @param {number} total - Total number of records matching the query
 * @param {number} page - Current page number (1-based)
 * @param {number} pageSize - Number of records per page
 * @returns {{ total: number, page: number, pageSize: number, totalPages: number }}
 */
const buildPaginationMeta = (total, page, pageSize) => {
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  return {
    total,
    page,
    pageSize,
    totalPages
  };
};

/**
 * Build Sort Options
 *
 * Validates the requested sort field against an allowedFields list and
 * returns a Mongoose-compatible sort object.
 *
 * @param {string} sortField - Field to sort by
 * @param {string} [sortOrder='desc'] - Sort direction: 'asc' or 'desc'
 * @param {string[]} allowedFields - List of fields that are permitted for sorting
 * @returns {Object} Mongoose sort object, e.g. { createdAt: -1 }
 * @throws {Error} If sortField is not in allowedFields
 */
const buildSortOptions = (sortField, sortOrder = 'desc', allowedFields = []) => {
  if (!sortField || !allowedFields.includes(sortField)) {
    throw new Error(
      `Invalid sort field: '${sortField}'. Allowed fields: ${allowedFields.join(', ')}`
    );
  }

  const direction = sortOrder === 'asc' ? 1 : -1;
  return { [sortField]: direction };
};

/**
 * Build Filter Query
 *
 * Constructs a Mongoose query object from a plain filters object.
 * Skips undefined/null/empty-string values so they don't pollute the query.
 *
 * Supported filter value types:
 *  - Primitive (string, number, boolean): exact match
 *  - Object with $gte/$lte/$in/$regex etc.: passed through as-is (Mongoose operators)
 *
 * @param {Object} filters - Key/value pairs of filter conditions
 * @returns {Object} Mongoose query object
 */
const buildFilterQuery = (filters = {}) => {
  const query = {};

  for (const [key, value] of Object.entries(filters)) {
    // Skip empty/null/undefined values
    if (value === undefined || value === null || value === '') continue;

    query[key] = value;
  }

  return query;
};

/**
 * Format List Response
 *
 * Combines an items array with pagination metadata into a single response object.
 *
 * @param {Array} items - Array of result documents
 * @param {{ total: number, page: number, pageSize: number, totalPages: number }} paginationMeta
 * @returns {{ items: Array, total: number, page: number, pageSize: number, totalPages: number }}
 */
const formatListResponse = (items, paginationMeta) => {
  return {
    items,
    ...paginationMeta
  };
};

module.exports = {
  createAuditLog,
  buildPaginationMeta,
  buildSortOptions,
  buildFilterQuery,
  formatListResponse
};
