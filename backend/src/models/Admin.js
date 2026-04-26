const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Exclude from queries by default for security
  },

  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['super_admin', 'admin', 'moderator'],
      message: 'Role must be super_admin, admin, or moderator'
    },
    default: 'moderator',
    index: true
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  lastLoginAt: {
    type: Date,
    default: null
  },

  preferences: {
    language: {
      type: String,
      enum: ['en', 'fr', 'es', 'de'],
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },

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
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
AdminSchema.index({ email: 1, isActive: 1 });

/**
 * Pre-save middleware to hash password
 * Only runs when password is modified to avoid unnecessary hashing
 */
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Pre-save middleware to update the updatedAt timestamp
 */
AdminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Compare entered password with hashed password in database
 *
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
AdminSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('Admin', AdminSchema);
