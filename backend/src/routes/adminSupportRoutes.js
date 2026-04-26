const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middlewares/adminAuth');
const {
  getTickets,
  getTicketById,
  updateTicketStatus,
  addTicketResponse
} = require('../controllers/adminSupportController');

// All routes require admin authentication
router.use(adminProtect);

// List support tickets
router.get('/', getTickets);

// Single ticket
router.get('/:id', getTicketById);

// Update ticket status
router.put('/:id/status', updateTicketStatus);

// Add response to ticket
router.post('/:id/responses', addTicketResponse);

module.exports = router;
