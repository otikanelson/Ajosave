const User = require('../models/Users');
const Transaction = require('../models/Transactions');
const AuditLog = require('../models/AuditLog');
const { sendError } = require('../utils/responseHelpers');
const { buildSortOptions } = require('../utils/adminHelpers');
const { asyncErrorHandler } = require('../middlewares/errorHandler');

/**
 * Escape CSV field value
 *
 * Properly escapes CSV field values by:
 * - Wrapping in quotes if contains comma, newline, or quote
 * - Escaping internal quotes by doubling them
 *
 * @param {*} value - Value to escape
 * @returns {string} Escaped CSV field value
 */
const escapeCSVField = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If value contains comma, newline, or quote, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Build CSV header row
 *
 * @param {Array<string>} fields - Field names
 * @returns {string} CSV header row
 */
const buildCSVHeader = (fields) => {
  return fields.map(escapeCSVField).join(',') + '\n';
};

/**
 * Build CSV data row
 *
 * @param {Object} record - Data record
 * @param {Array<string>} fields - Field names to extract
 * @returns {string} CSV data row
 */
const buildCSVRow = (record, fields) => {
  return fields.map(field => {
    const value = record[field];
    return escapeCSVField(value);
  }).join(',') + '\n';
};

/**
 * Export Users
 *
 * Exports users to CSV format with optional filters (same as getUsers).
 * Excludes sensitive fields (bvn, nin, password).
 * Streams CSV response with proper headers.
 *
 * Query params:
 * - search: regex on firstName, lastName, phoneNumber, email
 * - kycStatus: filter by verification status
 * - accountStatus: filter by account status
 * - sortBy: name, joinDate, kycStatus
 * - sortOrder: asc or desc
 */
const exportUsers = asyncErrorHandler(async (req, res) => {
  const {
    search,
    kycStatus,
    accountStatus,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter
  const filter = {};

  // Text search across firstName, lastName, phoneNumber, email
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { phoneNumber: regex },
      { email: regex }
    ];
  }

  // KYC status filter
  if (kycStatus) {
    switch (kycStatus) {
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
  if (accountStatus) {
    switch (accountStatus) {
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

  // Build sort options
  const SORT_FIELD_MAP = {
    name: 'firstName',
    joinDate: 'createdAt',
    kycStatus: 'isVerified'
  };

  const ALLOWED_SORT_FIELDS = Object.keys(SORT_FIELD_MAP);
  let sortOptions = { createdAt: -1 };

  if (sortBy) {
    if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
      return sendError(
        res,
        `Invalid sortBy field. Allowed fields: ${ALLOWED_SORT_FIELDS.join(', ')}`,
        400
      );
    }
    const mongoField = SORT_FIELD_MAP[sortBy];
    const direction = sortOrder === 'asc' ? 1 : -1;
    sortOptions = { [mongoField]: direction };
  }

  // Set response headers for CSV download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv');

  // Define CSV fields (excluding sensitive fields: bvn, nin, password)
  const csvFields = [
    '_id',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'dateOfBirth',
    'address',
    'isVerified',
    'verifiedAt',
    'isEmailVerified',
    'isPhoneVerified',
    'isFaceVerified',
    'isActive',
    'isSuspended',
    'isDeactivated',
    'suspendedAt',
    'suspensionReason',
    'lastLoginAt',
    'createdAt',
    'updatedAt'
  ];

  // Write CSV header
  res.write(buildCSVHeader(csvFields));

  // Stream users in batches to avoid memory issues
  const batchSize = 1000;
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const users = await User.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(batchSize)
      .lean();

    if (users.length === 0) {
      hasMore = false;
      break;
    }

    // Write each user row
    for (const user of users) {
      res.write(buildCSVRow(user, csvFields));
    }

    skip += batchSize;
  }

  // End response
  res.end();
});

/**
 * Export Transactions
 *
 * Exports transactions to CSV format with optional filters (same as getTransactions).
 * Streams CSV response with proper headers.
 *
 * Query params:
 * - search: regex on transactionId
 * - status: filter by transaction status
 * - type: filter by transaction type
 * - startDate, endDate: filter by date range
 * - sortBy: amount, createdAt, status
 * - sortOrder: asc or desc
 */
const exportTransactions = asyncErrorHandler(async (req, res) => {
  const {
    search,
    status,
    type,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter
  const filters = {};

  // Status filter
  if (status) {
    const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }
    filters.status = status;
  }

  // Type filter
  if (type) {
    const validTypes = ['contribution', 'payout', 'withdrawal', 'fund_wallet', 'lock', 'unlock'];
    if (!validTypes.includes(type)) {
      return sendError(res, `Invalid type. Must be one of: ${validTypes.join(', ')}`, 400);
    }
    filters.type = type;
  }

  // Date range filter
  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return sendError(res, 'Invalid startDate format. Use ISO 8601 format', 400);
      }
      filters.createdAt.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return sendError(res, 'Invalid endDate format. Use ISO 8601 format', 400);
      }
      filters.createdAt.$lte = end;
    }
  }

  // Search filter - transactionId
  if (search) {
    const transactionIdRegex = new RegExp(search, 'i');
    filters.transactionId = transactionIdRegex;
  }

  // Build sort options
  const ALLOWED_SORT_FIELDS = ['amount', 'createdAt', 'status'];
  let sortOptions = { createdAt: -1 };

  if (sortBy) {
    if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
      return sendError(
        res,
        `Invalid sortBy field. Allowed fields: ${ALLOWED_SORT_FIELDS.join(', ')}`,
        400
      );
    }
    const direction = sortOrder === 'asc' ? 1 : -1;
    sortOptions = { [sortBy]: direction };
  }

  // Set response headers for CSV download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=transactions-export.csv');

  // Define CSV fields
  const csvFields = [
    '_id',
    'userId',
    'groupId',
    'transactionId',
    'type',
    'amount',
    'status',
    'description',
    'vendor',
    'paymentMethod',
    'createdAt',
    'completedAt',
    'updatedAt'
  ];

  // Write CSV header
  res.write(buildCSVHeader(csvFields));

  // Stream transactions in batches
  const batchSize = 1000;
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const transactions = await Transaction.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(batchSize)
      .lean();

    if (transactions.length === 0) {
      hasMore = false;
      break;
    }

    // Write each transaction row
    for (const transaction of transactions) {
      res.write(buildCSVRow(transaction, csvFields));
    }

    skip += batchSize;
  }

  // End response
  res.end();
});

/**
 * Export Audit Logs
 *
 * Exports audit logs to CSV format with optional filters.
 * Streams CSV response with proper headers.
 *
 * Query params:
 * - search: regex on entityId
 * - action: filter by action type
 * - startDate, endDate: filter by timestamp range
 * - sortBy: timestamp, action
 * - sortOrder: asc or desc
 */
const exportAuditLogs = asyncErrorHandler(async (req, res) => {
  const {
    search,
    action,
    startDate,
    endDate,
    sortBy = 'timestamp',
    sortOrder = 'desc'
  } = req.query;

  // Build filter
  const filter = {};

  // Search filter - entityId
  if (search) {
    filter.entityId = new RegExp(search, 'i');
  }

  // Action filter
  if (action) {
    filter.action = action;
  }

  // Date range filter
  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return sendError(res, 'Invalid startDate format. Use ISO 8601 format', 400);
      }
      filter.timestamp.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return sendError(res, 'Invalid endDate format. Use ISO 8601 format', 400);
      }
      // Set to end of day
      end.setHours(23, 59, 59, 999);
      filter.timestamp.$lte = end;
    }
  }

  // Build sort options
  const ALLOWED_SORT_FIELDS = ['timestamp', 'action'];
  let sortOptions = { timestamp: -1 };

  if (sortBy) {
    if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
      return sendError(
        res,
        `Invalid sortBy field. Allowed fields: ${ALLOWED_SORT_FIELDS.join(', ')}`,
        400
      );
    }
    const direction = sortOrder === 'asc' ? 1 : -1;
    sortOptions = { [sortBy]: direction };
  }

  // Set response headers for CSV download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=audit-logs-export.csv');

  // Define CSV fields
  const csvFields = [
    '_id',
    'adminId',
    'action',
    'entityType',
    'entityId',
    'details',
    'oldValue',
    'newValue',
    'ipAddress',
    'userAgent',
    'timestamp'
  ];

  // Write CSV header
  res.write(buildCSVHeader(csvFields));

  // Stream audit logs in batches
  const batchSize = 1000;
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const auditLogs = await AuditLog.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(batchSize)
      .lean();

    if (auditLogs.length === 0) {
      hasMore = false;
      break;
    }

    // Write each audit log row
    for (const log of auditLogs) {
      res.write(buildCSVRow(log, csvFields));
    }

    skip += batchSize;
  }

  // End response
  res.end();
});

module.exports = {
  exportUsers,
  exportTransactions,
  exportAuditLogs
};
