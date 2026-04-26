/**
 * Response Helpers
 *
 * Utility functions for sending consistent JSON responses from admin API handlers.
 * All responses include a timestamp in ISO 8601 format and a success flag.
 */

/**
 * Send Success Response
 *
 * Sends a successful JSON response with the standard envelope format.
 *
 * @param {Object} res - Express response object
 * @param {*} data - Response payload
 * @param {string} [message='Success'] - Human-readable success message
 * @param {number} [statusCode=200] - HTTP status code
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send Error Response
 *
 * Sends an error JSON response with the standard envelope format.
 *
 * @param {Object} res - Express response object
 * @param {string} [message='An error occurred'] - Human-readable error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {Array|Object} [errors=null] - Optional validation errors or additional error details
 */
const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const body = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors !== null && errors !== undefined) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
};

/**
 * Send List Response
 *
 * Sends a paginated list response with the standard envelope format.
 * The data field contains both the items array and pagination metadata.
 *
 * @param {Object} res - Express response object
 * @param {Array} items - Array of result documents
 * @param {{ total: number, page: number, pageSize: number, totalPages: number }} paginationMeta
 * @param {string} [message='Success'] - Human-readable success message
 * @param {number} [statusCode=200] - HTTP status code
 */
const sendListResponse = (res, items, paginationMeta, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      items,
      ...paginationMeta
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendListResponse
};
