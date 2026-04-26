const SupportTicket = require('../models/SupportTicket');
const User = require('../models/Users');
const Admin = require('../models/Admin');
const { sendSuccess, sendError, sendListResponse } = require('../utils/responseHelpers');
const {
  createAuditLog,
  buildPaginationMeta
} = require('../utils/adminHelpers');

/**
 * Allowed sort fields for support ticket list queries.
 */
const ALLOWED_SORT_FIELDS = ['createdAt', 'priority', 'status'];

/**
 * Build a Mongoose query filter from support ticket list query params.
 *
 * @param {Object} query - Express req.query
 * @returns {Object} Mongoose filter object
 */
const buildTicketFilter = (query) => {
  const filter = {};

  // Text search on ticketId (will be handled separately with regex)
  // and user name (will be handled with populate + filtering)

  // Status filter
  if (query.status) {
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (validStatuses.includes(query.status)) {
      filter.status = query.status;
    }
  }

  // Priority filter
  if (query.priority) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (validPriorities.includes(query.priority)) {
      filter.priority = query.priority;
    }
  }

  return filter;
};

/**
 * GET /api/admin/support-tickets
 *
 * Returns a paginated list of support tickets. Supports search (on ticketId and user name),
 * filtering by status and priority, and pagination.
 */
const getTickets = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10) || 20;
    let offset = parseInt(req.query.offset, 10) || 0;

    if (limit > 1000) limit = 1000;
    if (limit < 1) limit = 1;
    if (offset < 0) offset = 0;

    const filter = buildTicketFilter(req.query);

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
      const direction = req.query.sortOrder === 'asc' ? 1 : -1;
      sortOptions = { [req.query.sortBy]: direction };
    }

    // Get total count before applying search filter
    let totalQuery = SupportTicket.countDocuments(filter);

    // If search is provided, we need to handle it specially
    // First get all matching tickets, then filter by user name if needed
    let tickets;
    let total;

    if (req.query.search) {
      // Search on ticketId with regex
      const ticketIdRegex = new RegExp(req.query.search, 'i');
      filter.ticketId = ticketIdRegex;

      // Get tickets matching ticketId
      tickets = await SupportTicket.find(filter)
        .populate('userId', 'firstName lastName phoneNumber')
        .sort(sortOptions)
        .lean();

      // Filter by user name if search doesn't match ticketId
      const searchRegex = new RegExp(req.query.search, 'i');
      tickets = tickets.filter((ticket) => {
        if (ticket.userId) {
          const fullName = `${ticket.userId.firstName} ${ticket.userId.lastName}`;
          return (
            searchRegex.test(ticket.ticketId) ||
            searchRegex.test(fullName) ||
            searchRegex.test(ticket.userId.phoneNumber)
          );
        }
        return searchRegex.test(ticket.ticketId);
      });

      total = tickets.length;
      tickets = tickets.slice(offset, offset + limit);
    } else {
      // No search, just apply filters and pagination
      [tickets, total] = await Promise.all([
        SupportTicket.find(filter)
          .populate('userId', 'firstName lastName phoneNumber')
          .sort(sortOptions)
          .skip(offset)
          .limit(limit)
          .lean(),
        SupportTicket.countDocuments(filter)
      ]);
    }

    const pageSize = limit;
    const page = Math.floor(offset / pageSize) + 1;
    const paginationMeta = buildPaginationMeta(total, page, pageSize);

    return sendListResponse(res, tickets, paginationMeta, 'Support tickets retrieved successfully');
  } catch (error) {
    console.error('getTickets error:', error);
    return sendError(res, 'Failed to retrieve support tickets', 500);
  }
};

/**
 * GET /api/admin/support-tickets/:id
 *
 * Returns a single support ticket by ID or ticketId field.
 * Populates userId and responses.adminId with admin names.
 * Returns 404 if not found.
 */
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by MongoDB _id first, then by ticketId
    let ticket = await SupportTicket.findById(id)
      .populate('userId', 'firstName lastName phoneNumber email')
      .lean();

    if (!ticket) {
      ticket = await SupportTicket.findOne({ ticketId: id })
        .populate('userId', 'firstName lastName phoneNumber email')
        .lean();
    }

    if (!ticket) {
      return sendError(res, 'Support ticket not found', 404);
    }

    // Populate admin names in responses
    if (ticket.responses && ticket.responses.length > 0) {
      const adminIds = ticket.responses.map((r) => r.adminId);
      const admins = await Admin.find({ _id: { $in: adminIds } })
        .select('name')
        .lean();

      const adminMap = {};
      admins.forEach((admin) => {
        adminMap[admin._id.toString()] = admin.name;
      });

      ticket.responses = ticket.responses.map((response) => ({
        ...response,
        adminName: adminMap[response.adminId.toString()] || 'Unknown Admin'
      }));
    }

    return sendSuccess(res, ticket, 'Support ticket retrieved successfully');
  } catch (error) {
    console.error('getTicketById error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid ticket ID', 400);
    }
    return sendError(res, 'Failed to retrieve support ticket', 500);
  }
};

/**
 * PUT /api/admin/support-tickets/:id/status
 *
 * Updates the status of a support ticket.
 * Validates ticket exists and creates an audit log.
 */
const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return sendError(
        res,
        `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
        400
      );
    }

    // Find ticket by _id or ticketId
    let ticket = await SupportTicket.findById(id);
    if (!ticket) {
      ticket = await SupportTicket.findOne({ ticketId: id });
    }

    if (!ticket) {
      return sendError(res, 'Support ticket not found', 404);
    }

    const oldStatus = ticket.status;
    ticket.status = status;
    await ticket.save();

    // Create audit log
    await createAuditLog(
      req.admin._id,
      'ticket_status_updated',
      'support_ticket',
      ticket._id,
      {
        ticketId: ticket.ticketId,
        oldStatus,
        newStatus: status
      },
      req
    );

    // Populate for response
    await ticket.populate('userId', 'firstName lastName phoneNumber');

    return sendSuccess(res, ticket, 'Support ticket status updated successfully');
  } catch (error) {
    console.error('updateTicketStatus error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid ticket ID', 400);
    }
    return sendError(res, 'Failed to update support ticket status', 500);
  }
};

/**
 * POST /api/admin/support-tickets/:id/responses
 *
 * Adds a response to a support ticket.
 * Validates ticket exists, pushes new response, and creates an audit log.
 */
const addTicketResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return sendError(res, 'Message is required', 400);
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return sendError(res, 'Message must be a non-empty string', 400);
    }

    // Find ticket by _id or ticketId
    let ticket = await SupportTicket.findById(id);
    if (!ticket) {
      ticket = await SupportTicket.findOne({ ticketId: id });
    }

    if (!ticket) {
      return sendError(res, 'Support ticket not found', 404);
    }

    // Push new response
    const newResponse = {
      adminId: req.admin._id,
      message: message.trim(),
      timestamp: new Date()
    };

    ticket.responses.push(newResponse);
    await ticket.save();

    // Create audit log
    await createAuditLog(
      req.admin._id,
      'ticket_response_added',
      'support_ticket',
      ticket._id,
      {
        ticketId: ticket.ticketId,
        responseMessage: message.substring(0, 100) // Log first 100 chars
      },
      req
    );

    // Populate for response
    await ticket.populate('userId', 'firstName lastName phoneNumber');

    return sendSuccess(res, ticket, 'Response added to support ticket successfully');
  } catch (error) {
    console.error('addTicketResponse error:', error);
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid ticket ID', 400);
    }
    return sendError(res, 'Failed to add response to support ticket', 500);
  }
};

module.exports = {
  getTickets,
  getTicketById,
  updateTicketStatus,
  addTicketResponse
};
