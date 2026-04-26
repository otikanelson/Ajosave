const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Admin ID is required'],
    index: true
  },

  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: {
      values: [
        'user_suspended',
        'user_activated',
        'user_deactivated',
        'kyc_approved',
        'kyc_rejected',
        'transaction_reversed',
        'transaction_failed',
        'group_modified',
        'setting_changed',
        'admin_login',
        'admin_logout',
        'bulk_operation'
      ],
      message: 'Invalid action type'
    },
    index: true
  },

  entityType: {
    type: String,
    required: [true, 'Entity type is required'],
    enum: {
      values: ['user', 'group', 'transaction', 'setting', 'admin'],
      message: 'Entity type must be user, group, transaction, setting, or admin'
    }
  },

  entityId: {
    type: String,
    trim: true
  },

  details: {
    type: mongoose.Schema.Types.Mixed
  },

  oldValue: {
    type: mongoose.Schema.Types.Mixed
  },

  newValue: {
    type: mongoose.Schema.Types.Mixed
  },

  ipAddress: {
    type: String,
    trim: true
  },

  userAgent: {
    type: String,
    trim: true
  },

  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false, // We manage timestamp manually
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for efficient querying
AuditLogSchema.index({ adminId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
