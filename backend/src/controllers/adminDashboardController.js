const User = require('../models/Users');
const Group = require('../models/Groups');
const Transaction = require('../models/Transactions');
const AuditLog = require('../models/AuditLog');
const Alert = require('../models/Alert');
const Admin = require('../models/Admin');
const { sendSuccess, sendError, sendListResponse } = require('../utils/responseHelpers');
const { buildPaginationMeta } = require('../utils/adminHelpers');

/**
 * Build a date filter object based on the period query param.
 *
 * @param {string} period - 'today' | 'week' | 'month' | 'year'
 * @returns {Object|null} Mongoose date range filter or null if no period given
 */
const buildPeriodFilter = (period) => {
  if (!period) return null;

  const now = new Date();
  let startDate;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return null;
  }

  return { $gte: startDate, $lte: now };
};

/**
 * GET /api/admin/dashboard/stats
 *
 * Returns high-level platform statistics. Supports an optional `period`
 * query param (today, week, month, year) to scope counts to a date range.
 *
 * Response: { totalUsers, activeGroups, totalSavings, transactionsCount24h, timestamp }
 */
const getDashboardStats = async (req, res) => {
  try {
    const { period } = req.query;
    const periodFilter = buildPeriodFilter(period);

    // Build per-model date filters
    const userDateFilter = periodFilter ? { createdAt: periodFilter } : {};
    const groupDateFilter = periodFilter ? { createdAt: periodFilter } : {};
    const txDateFilter = periodFilter ? { createdAt: periodFilter } : {};

    // 24-hour window for transactionsCount24h (always fixed, not affected by period)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeGroups,
      savingsAgg,
      transactionsCount24h
    ] = await Promise.all([
      User.countDocuments(userDateFilter),
      Group.countDocuments({ status: 'active', ...groupDateFilter }),
      Group.aggregate([
        { $match: periodFilter ? { createdAt: periodFilter } : {} },
        { $group: { _id: null, total: { $sum: '$totalPool' } } }
      ]),
      Transaction.countDocuments({
        createdAt: { $gte: twentyFourHoursAgo },
        ...txDateFilter
      })
    ]);

    const totalSavings = savingsAgg.length > 0 ? savingsAgg[0].total : 0;

    return sendSuccess(res, {
      totalUsers,
      activeGroups,
      totalSavings,
      transactionsCount24h,
      timestamp: new Date().toISOString()
    }, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return sendError(res, 'Failed to retrieve dashboard statistics', 500);
  }
};

/**
 * GET /api/admin/dashboard/activities
 *
 * Returns recent admin audit log activities, sorted by timestamp descending.
 * Supports `limit` (default 20, max 100) and `offset` pagination params.
 *
 * Response items: { type, description, timestamp, entityId, entityType, adminName }
 */
const getRecentActivities = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10) || 20;
    let offset = parseInt(req.query.offset, 10) || 0;

    // Clamp limit to max 100
    if (limit > 100) limit = 100;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    const [activities, total] = await Promise.all([
      AuditLog.find()
        .sort({ timestamp: -1 })
        .skip(offset)
        .limit(limit)
        .populate('adminId', 'name email')
        .lean(),
      AuditLog.countDocuments()
    ]);

    const items = activities.map((log) => ({
      type: log.action,
      description: log.details
        ? (typeof log.details === 'string' ? log.details : JSON.stringify(log.details))
        : log.action,
      timestamp: log.timestamp,
      entityId: log.entityId || null,
      entityType: log.entityType,
      adminName: log.adminId ? log.adminId.name : 'Unknown'
    }));

    const pageSize = limit;
    const page = Math.floor(offset / pageSize) + 1;
    const paginationMeta = buildPaginationMeta(total, page, pageSize);

    return sendListResponse(res, items, paginationMeta, 'Recent activities retrieved successfully');
  } catch (error) {
    console.error('getRecentActivities error:', error);
    return sendError(res, 'Failed to retrieve recent activities', 500);
  }
};

/**
 * Severity sort order map — lower number = higher priority.
 */
const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 };

/**
 * GET /api/admin/dashboard/alerts
 *
 * Returns active (non-dismissed) alerts sorted by severity (critical→warning→info)
 * then by timestamp descending. Supports optional `severity` filter param.
 */
const getAlerts = async (req, res) => {
  try {
    const { severity } = req.query;

    const filter = { isDismissed: false };
    if (severity && ['critical', 'warning', 'info'].includes(severity)) {
      filter.severity = severity;
    }

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Sort by severity order first, then by createdAt descending
    alerts.sort((a, b) => {
      const severityDiff = (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99);
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sendSuccess(res, alerts, 'Alerts retrieved successfully');
  } catch (error) {
    console.error('getAlerts error:', error);
    return sendError(res, 'Failed to retrieve alerts', 500);
  }
};

/**
 * POST /api/admin/dashboard/alerts/:id/dismiss
 *
 * Dismisses an alert by ID. Sets isDismissed, dismissedBy, and dismissedAt.
 */
const dismissAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);
    if (!alert) {
      return sendError(res, 'Alert not found', 404);
    }

    if (alert.isDismissed) {
      return sendError(res, 'Alert has already been dismissed', 400);
    }

    alert.isDismissed = true;
    alert.dismissedBy = req.admin._id;
    alert.dismissedAt = new Date();

    await alert.save();

    return sendSuccess(res, alert, 'Alert dismissed successfully');
  } catch (error) {
    console.error('dismissAlert error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid alert ID', 400);
    }
    return sendError(res, 'Failed to dismiss alert', 500);
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivities,
  getAlerts,
  dismissAlert
};
