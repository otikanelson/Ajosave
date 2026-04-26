const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  severity: {
    type: String,
    required: [true, 'Severity is required'],
    enum: {
      values: ['critical', 'warning', 'info'],
      message: 'Severity must be critical, warning, or info'
    },
    default: 'info',
    index: true
  },

  isDismissed: {
    type: Boolean,
    default: false,
    index: true
  },

  dismissedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },

  dismissedAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false, // We manage createdAt manually
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Compound index for efficient querying of active alerts by severity
AlertSchema.index({ isDismissed: 1, severity: 1 });

module.exports = mongoose.model('Alert', AlertSchema);
