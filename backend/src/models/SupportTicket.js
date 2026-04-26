const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Admin ID is required']
  },

  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Response message cannot exceed 2000 characters']
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const SupportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: [true, 'Ticket ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },

  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['open', 'in_progress', 'resolved', 'closed'],
      message: 'Status must be open, in_progress, resolved, or closed'
    },
    default: 'open',
    index: true
  },

  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be low, medium, high, or urgent'
    },
    default: 'medium',
    index: true
  },

  responses: [ResponseSchema],

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for efficient querying
SupportTicketSchema.index({ status: 1, priority: 1 });
SupportTicketSchema.index({ userId: 1, createdAt: -1 });

/**
 * Pre-save middleware to update the updatedAt timestamp
 */
SupportTicketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Generate a unique ticket ID
 * Format: TKT + timestamp + random 4-digit number
 */
SupportTicketSchema.statics.generateTicketId = function() {
  const prefix = 'TKT';
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
