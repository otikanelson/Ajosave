const User = require('../models/Users');
const Group = require('../models/Groups');
const Transaction = require('../models/Transactions');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

/**
 * Build a date range filter based on the period query param.
 *
 * @param {string} period - 'week' | 'month' | 'quarter' | 'year'
 * @returns {Object} { startDate, endDate } for the period
 */
const buildDateRange = (period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      // Default to month if invalid period
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
  }

  return { startDate, endDate: now };
};

/**
 * Determine grouping granularity based on period.
 * Returns a MongoDB date format string for $dateToString.
 *
 * @param {string} period - 'week' | 'month' | 'quarter' | 'year'
 * @returns {string} MongoDB date format string
 */
const getDateFormat = (period) => {
  switch (period) {
    case 'week':
    case 'month':
      return '%Y-%m-%d'; // Daily
    case 'quarter':
    case 'year':
      return '%Y-%m'; // Weekly/Monthly
    default:
      return '%Y-%m-%d';
  }
};

/**
 * GET /api/admin/analytics
 *
 * Returns analytics data including user growth, group creation trends,
 * transaction volume by type, and savings trends.
 *
 * Query params:
 *   - period: 'week' | 'month' | 'quarter' | 'year' (default: 'month')
 *
 * Response: {
 *   userGrowth: [{ date, value }, ...],
 *   groupTrends: [{ date, value }, ...],
 *   transactionVolume: [{ date, value }, ...],
 *   savingsTrends: [{ date, value }, ...]
 * }
 */
const getAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Validate period
    if (!['week', 'month', 'quarter', 'year'].includes(period)) {
      return sendError(res, 'Invalid period. Must be week, month, quarter, or year', 400);
    }

    const { startDate, endDate } = buildDateRange(period);
    const dateFormat = getDateFormat(period);

    // Run all aggregation pipelines in parallel using Promise.all
    const [userGrowthData, groupTrendsData, transactionVolumeData, savingsTrendsData] = await Promise.all([
      // User growth: daily/weekly new user counts
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: dateFormat, date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),

      // Group creation trends: daily/weekly new group counts
      Group.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: dateFormat, date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),

      // Transaction volume by type: sum of amounts grouped by type and date
      Transaction.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: dateFormat, date: '$createdAt' }
              },
              type: '$type'
            },
            totalAmount: { $sum: '$amount' }
          }
        },
        {
          $group: {
            _id: '$_id.date',
            volume: { $sum: '$totalAmount' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),

      // Savings trends: cumulative totalPool across groups
      Group.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: dateFormat, date: '$createdAt' }
            },
            totalSavings: { $sum: '$totalPool' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
    ]);

    // Transform aggregation results to { date, value } pairs
    const userGrowth = userGrowthData.map(item => ({
      date: item._id,
      value: item.count
    }));

    const groupTrends = groupTrendsData.map(item => ({
      date: item._id,
      value: item.count
    }));

    const transactionVolume = transactionVolumeData.map(item => ({
      date: item._id,
      value: item.volume
    }));

    const savingsTrends = savingsTrendsData.map(item => ({
      date: item._id,
      value: item.totalSavings
    }));

    return sendSuccess(res, {
      userGrowth,
      groupTrends,
      transactionVolume,
      savingsTrends
    }, 'Analytics data retrieved successfully');
  } catch (error) {
    console.error('getAnalytics error:', error);
    return sendError(res, 'Failed to retrieve analytics data', 500);
  }
};

module.exports = {
  getAnalytics
};
