const Transaction = require('../models/Transactions');
const Wallet = require('../models/Wallets');
const User = require('../models/Users');
const Group = require('../models/Groups');
const { createAuditLog, buildPaginationMeta, buildSortOptions, buildFilterQuery } = require('../utils/adminHelpers');
const { sendSuccess, sendError, sendListResponse } = require('../utils/responseHelpers');
const { asyncErrorHandler } = require('../middlewares/errorHandler');

/**
 * Get Transactions
 *
 * Retrieves a paginated list of transactions with filtering and sorting.
 * Supports search by transactionId (with user name population), status, type, date range.
 *
 * Query params:
 * - search: regex on transactionId; populate userId to search by user name
 * - status: filter by transaction status enum
 * - type: filter by transaction type enum
 * - startDate, endDate: filter createdAt range
 * - sortBy: amount, createdAt, status (validated)
 * - sortOrder: asc or desc
 * - limit: default 20, max 1000
 * - offset: default 0
 */
const getTransactions = asyncErrorHandler(async (req, res) => {
  const {
    search,
    status,
    type,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 20,
    offset = 0
  } = req.query;

  // Validate and parse pagination params
  const pageLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 1000);
  const pageOffset = Math.max(parseInt(offset) || 0, 0);

  // Validate sort params
  const allowedSortFields = ['amount', 'createdAt', 'status'];
  let sortOptions;
  try {
    sortOptions = buildSortOptions(sortBy, sortOrder, allowedSortFields);
  } catch (error) {
    return sendError(res, error.message, 400);
  }

  // Build filter query
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

  // Search filter - transactionId or user name
  if (search) {
    // First, try to find transactions by transactionId regex
    const transactionIdRegex = new RegExp(search, 'i');
    
    // Also search by user name if search term looks like a name
    const userMatches = await User.find({
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ]
    }).select('_id');

    const userIds = userMatches.map(u => u._id);

    filters.$or = [
      { transactionId: transactionIdRegex },
      ...(userIds.length > 0 ? [{ userId: { $in: userIds } }] : [])
    ];
  }

  // Execute query with pagination
  const query = buildFilterQuery(filters);
  
  // Handle $or separately if it exists
  let dbQuery = Transaction.find(search ? { $or: filters.$or } : query);
  
  // Apply other filters if search was used
  if (search) {
    const otherFilters = { ...filters };
    delete otherFilters.$or;
    dbQuery = dbQuery.find(otherFilters);
  }

  const total = await Transaction.countDocuments(search ? { $or: filters.$or } : query);
  
  const transactions = await dbQuery
    .populate('userId', 'firstName lastName phoneNumber')
    .populate('groupId', 'name')
    .sort(sortOptions)
    .limit(pageLimit)
    .skip(pageOffset)
    .lean();

  const paginationMeta = buildPaginationMeta(total, Math.floor(pageOffset / pageLimit) + 1, pageLimit);

  return sendListResponse(res, transactions, paginationMeta, 'Transactions retrieved successfully');
});

/**
 * Get Transaction By ID
 *
 * Retrieves a single transaction by ID or transactionId field.
 * Populates userId and groupId with full details.
 */
const getTransactionById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  // Try to find by MongoDB _id first, then by transactionId
  let transaction = await Transaction.findById(id)
    .populate('userId', 'firstName lastName phoneNumber email')
    .populate('groupId', 'name status');

  if (!transaction) {
    transaction = await Transaction.findOne({ transactionId: id })
      .populate('userId', 'firstName lastName phoneNumber email')
      .populate('groupId', 'name status');
  }

  if (!transaction) {
    return sendError(res, 'Transaction not found', 404);
  }

  return sendSuccess(res, transaction, 'Transaction retrieved successfully');
});

/**
 * Reverse Transaction
 *
 * Reverses a completed transaction by:
 * 1. Validating transaction exists and status is 'completed'
 * 2. Updating status to 'cancelled'
 * 3. Reversing the balance impact on user's wallet
 * 4. Creating a new reversal transaction record
 * 5. Creating an audit log
 */
const reverseTransaction = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  // Find transaction
  let transaction = await Transaction.findById(id);
  if (!transaction) {
    transaction = await Transaction.findOne({ transactionId: id });
  }

  if (!transaction) {
    return sendError(res, 'Transaction not found', 404);
  }

  // Validate status is 'completed'
  if (transaction.status !== 'completed') {
    return sendError(res, `Cannot reverse transaction with status '${transaction.status}'. Only 'completed' transactions can be reversed`, 400);
  }

  // Find user's wallet
  const wallet = await Wallet.findOne({ userId: transaction.userId });
  if (!wallet) {
    return sendError(res, 'User wallet not found', 404);
  }

  // Reverse the balance impact based on transaction type
  // For debits (contribution, withdrawal, lock): add amount back
  // For credits (payout, unlock, fund_wallet): deduct amount
  const debitTypes = ['contribution', 'withdrawal', 'lock'];
  const creditTypes = ['payout', 'unlock', 'fund_wallet'];

  if (debitTypes.includes(transaction.type)) {
    // Add amount back to available balance
    wallet.availableBalance += transaction.amount;
  } else if (creditTypes.includes(transaction.type)) {
    // Deduct amount from available balance
    if (wallet.availableBalance < transaction.amount) {
      return sendError(res, 'Insufficient wallet balance to reverse this transaction', 400);
    }
    wallet.availableBalance -= transaction.amount;
  }

  wallet.updatedAt = new Date();
  await wallet.save();

  // Update original transaction status
  transaction.status = 'cancelled';
  transaction.updatedAt = new Date();
  await transaction.save();

  // Create reversal transaction record
  const reversalTransaction = new Transaction({
    userId: transaction.userId,
    groupId: transaction.groupId,
    transactionId: Transaction.generateTransactionId(),
    type: transaction.type,
    amount: transaction.amount,
    status: 'completed',
    description: `Reversal: ${transaction.description || transaction.type}`,
    vendor: transaction.vendor,
    paymentMethod: transaction.paymentMethod,
    paymentDetails: transaction.paymentDetails,
    metadata: {
      ...transaction.metadata,
      reversalOf: transaction._id.toString()
    },
    completedAt: new Date(),
    createdAt: new Date()
  });

  await reversalTransaction.save();

  // Create audit log
  await createAuditLog(
    req.admin._id,
    'transaction_reversed',
    'transaction',
    transaction._id.toString(),
    {
      originalTransactionId: transaction.transactionId,
      reversalTransactionId: reversalTransaction.transactionId,
      amount: transaction.amount,
      type: transaction.type
    },
    req
  );

  return sendSuccess(res, {
    originalTransaction: transaction,
    reversalTransaction: reversalTransaction
  }, 'Transaction reversed successfully', 200);
});

/**
 * Mark Transaction Failed
 *
 * Marks a pending transaction as failed.
 * Validates transaction exists and status is 'pending'.
 */
const markTransactionFailed = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  // Find transaction
  let transaction = await Transaction.findById(id);
  if (!transaction) {
    transaction = await Transaction.findOne({ transactionId: id });
  }

  if (!transaction) {
    return sendError(res, 'Transaction not found', 404);
  }

  // Validate status is 'pending'
  if (transaction.status !== 'pending') {
    return sendError(res, `Cannot mark transaction as failed. Current status is '${transaction.status}'. Only 'pending' transactions can be marked as failed`, 400);
  }

  // Update status to 'failed'
  transaction.status = 'failed';
  transaction.updatedAt = new Date();
  await transaction.save();

  // Create audit log
  await createAuditLog(
    req.admin._id,
    'transaction_failed',
    'transaction',
    transaction._id.toString(),
    {
      transactionId: transaction.transactionId,
      amount: transaction.amount,
      type: transaction.type
    },
    req
  );

  return sendSuccess(res, transaction, 'Transaction marked as failed successfully', 200);
});

module.exports = {
  getTransactions,
  getTransactionById,
  reverseTransaction,
  markTransactionFailed
};
