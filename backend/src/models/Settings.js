const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Key is required'],
    unique: true,
    trim: true,
    lowercase: true
  },

  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Value is required']
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['transactions', 'groups', 'users', 'system'],
      message: 'Category must be transactions, groups, users, or system'
    },
    index: true
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // We manage updatedAt manually
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

/**
 * Default settings to seed on first load
 */
const DEFAULT_SETTINGS = [
  {
    key: 'maxgroupsize',
    value: 50,
    description: 'Maximum number of members allowed in a savings group',
    category: 'groups'
  },
  {
    key: 'mincontributionamount',
    value: 100,
    description: 'Minimum contribution amount in Naira',
    category: 'transactions'
  },
  {
    key: 'maxcontributionamount',
    value: 1000000,
    description: 'Maximum contribution amount in Naira',
    category: 'transactions'
  },
  {
    key: 'maxtransactionamount',
    value: 5000000,
    description: 'Maximum single transaction amount in Naira',
    category: 'transactions'
  },
  {
    key: 'maxwithdrawalamount',
    value: 2000000,
    description: 'Maximum withdrawal amount in Naira',
    category: 'transactions'
  },
  {
    key: 'kycrequired',
    value: true,
    description: 'Whether KYC verification is required for users to participate in groups',
    category: 'users'
  },
  {
    key: 'maintenancemode',
    value: false,
    description: 'Whether the platform is in maintenance mode',
    category: 'system'
  }
];

/**
 * Seed default settings if none exist
 * Called during server startup after database connection is established
 */
SettingsSchema.statics.seedDefaults = async function() {
  try {
    const count = await this.countDocuments();
    if (count === 0) {
      await this.insertMany(DEFAULT_SETTINGS);
      console.log('Default settings seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding default settings:', error);
  }
};

module.exports = mongoose.model('Settings', SettingsSchema);
