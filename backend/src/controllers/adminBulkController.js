const User = require('../models/Users');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { createAuditLog } = require('../utils/adminHelpers');

/**
 * Process users in batches
 *
 * Helper function to process an array of user IDs in batches of a specified size.
 *
 * @param {Array} userIds - Array of user IDs to process
 * @param {number} batchSize - Size of each batch
 * @param {Function} processBatch - Async function that processes a batch
 * @returns {Promise<Array>} Array of results from all batches
 */
const processBatchedUsers = async (userIds, batchSize, processBatch) => {
  const results = [];
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    const batchResults = await processBatch(batch);
    results.push(...batchResults);
  }
  return results;
};

/**
 * POST /api/admin/bulk/users
 *
 * Performs bulk actions on multiple users (suspend, activate, deactivate).
 * Processes users in batches of 50 for efficiency.
 * Tracks successful and failed operations.
 * Creates individual audit log entries for each successful operation.
 *
 * Request body:
 * {
 *   action: 'suspend' | 'activate' | 'deactivate',
 *   userIds: string[],
 *   reason?: string
 * }
 *
 * Response:
 * {
 *   successful: number,
 *   failed: number,
 *   errors: [{ id, reason }]
 * }
 */
const bulkUserAction = async (req, res) => {
  try {
    const { action, userIds, reason } = req.body;

    // Validate action
    const validActions = ['suspend', 'activate', 'deactivate'];
    if (!validActions.includes(action)) {
      return sendError(
        res,
        `Invalid action. Must be one of: ${validActions.join(', ')}`,
        400
      );
    }

    // Validate userIds
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return sendError(res, 'userIds must be a non-empty array', 400);
    }

    if (userIds.length > 1000) {
      return sendError(res, 'Maximum 1000 users can be processed at once', 400);
    }

    // Validate reason for suspend/deactivate
    if ((action === 'suspend' || action === 'deactivate') && !reason) {
      return sendError(
        res,
        `reason is required for ${action} action`,
        400
      );
    }

    const successful = [];
    const failed = [];

    // Process users in batches of 50
    const BATCH_SIZE = 50;

    const processBatch = async (batch) => {
      const batchResults = [];

      for (const userId of batch) {
        try {
          const user = await User.findById(userId);

          if (!user) {
            failed.push({
              id: userId,
              reason: 'User not found'
            });
            batchResults.push({ success: false, userId });
            continue;
          }

          // Perform the action
          let actionPerformed = false;
          let auditAction = null;

          if (action === 'suspend') {
            if (user.isSuspended) {
              failed.push({
                id: userId,
                reason: 'User is already suspended'
              });
              batchResults.push({ success: false, userId });
              continue;
            }
            user.isSuspended = true;
            user.suspendedAt = new Date();
            user.suspensionReason = reason;
            auditAction = 'user_suspended';
            actionPerformed = true;
          } else if (action === 'activate') {
            user.isSuspended = false;
            user.isDeactivated = false;
            user.isActive = true;
            user.suspensionReason = undefined;
            auditAction = 'user_activated';
            actionPerformed = true;
          } else if (action === 'deactivate') {
            if (user.isDeactivated) {
              failed.push({
                id: userId,
                reason: 'User is already deactivated'
              });
              batchResults.push({ success: false, userId });
              continue;
            }
            user.isDeactivated = true;
            user.isActive = false;
            auditAction = 'user_deactivated';
            actionPerformed = true;
          }

          // Save the user
          await user.save();

          // Create audit log
          if (actionPerformed && auditAction) {
            await createAuditLog(
              req.admin._id,
              auditAction,
              'user',
              userId,
              {
                action,
                reason: reason || null,
                bulkOperation: true
              },
              req
            );
          }

          successful.push(userId);
          batchResults.push({ success: true, userId });
        } catch (error) {
          console.error(`Error processing user ${userId}:`, error.message);
          failed.push({
            id: userId,
            reason: error.message || 'Unknown error'
          });
          batchResults.push({ success: false, userId });
        }
      }

      return batchResults;
    };

    // Process all users in batches
    await processBatchedUsers(userIds, BATCH_SIZE, processBatch);

    // Return summary
    return sendSuccess(
      res,
      {
        successful: successful.length,
        failed: failed.length,
        errors: failed
      },
      'Bulk operation completed',
      200
    );
  } catch (error) {
    console.error('bulkUserAction error:', error);
    return sendError(res, 'Failed to process bulk operation', 500);
  }
};

module.exports = {
  bulkUserAction
};
