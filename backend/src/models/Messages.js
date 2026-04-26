const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  // Message content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },

  // Sender information
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required'],
    index: true
  },

  senderName: {
    type: String,
    required: true
  },

  // Group reference
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Group is required'],
    index: true
  },

  // Message metadata
  messageType: {
    type: String,
    enum: ['text', 'system', 'notification'],
    default: 'text'
  },

  // For system messages (e.g., "User joined the group")
  systemMessageType: {
    type: String,
    enum: ['user_joined', 'user_left', 'contribution_made', 'payout_processed', 'group_created'],
    default: null
  },

  // Read receipts
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Reactions/Emojis
  reactions: [{
    emoji: String,
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],

  // Edited message tracking
  isEdited: {
    type: Boolean,
    default: false
  },

  editedAt: {
    type: Date,
    default: null
  },

  editHistory: [{
    content: String,
    editedAt: Date
  }],

  // Deleted message tracking
  isDeleted: {
    type: Boolean,
    default: false
  },

  deletedAt: {
    type: Date,
    default: null
  },

  // Timestamps
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
MessageSchema.index({ group: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, group: 1 });
MessageSchema.index({ group: 1, messageType: 1 });

// Pre-save middleware to update updatedAt
MessageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to mark message as read by a user
MessageSchema.methods.markAsRead = async function(userId) {
  // Check if user has already read this message
  const alreadyRead = this.readBy.some(read => read.userId.toString() === userId.toString());
  
  if (!alreadyRead) {
    this.readBy.push({
      userId,
      readAt: new Date()
    });
    return this.save();
  }
  
  return this;
};

// Method to add reaction
MessageSchema.methods.addReaction = async function(emoji, userId) {
  let reaction = this.reactions.find(r => r.emoji === emoji);
  
  if (!reaction) {
    this.reactions.push({
      emoji,
      users: [userId]
    });
  } else {
    // Check if user already reacted with this emoji
    if (!reaction.users.includes(userId)) {
      reaction.users.push(userId);
    }
  }
  
  return this.save();
};

// Method to remove reaction
MessageSchema.methods.removeReaction = async function(emoji, userId) {
  const reaction = this.reactions.find(r => r.emoji === emoji);
  
  if (reaction) {
    reaction.users = reaction.users.filter(id => id.toString() !== userId.toString());
    
    // Remove reaction if no users left
    if (reaction.users.length === 0) {
      this.reactions = this.reactions.filter(r => r.emoji !== emoji);
    }
  }
  
  return this.save();
};

// Method to edit message
MessageSchema.methods.editMessage = async function(newContent) {
  // Store edit history
  this.editHistory.push({
    content: this.content,
    editedAt: new Date()
  });
  
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  
  return this.save();
};

// Method to soft delete message
MessageSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.content = '[Message deleted]';
  
  return this.save();
};

// Static method to get messages for a group
MessageSchema.statics.getGroupMessages = function(groupId, limit = 50, skip = 0) {
  return this.find({ 
    group: groupId,
    isDeleted: false
  })
    .populate('sender', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

// Static method to get unread message count
MessageSchema.statics.getUnreadCount = function(groupId, userId) {
  return this.countDocuments({
    group: groupId,
    isDeleted: false,
    'readBy.userId': { $ne: userId }
  });
};

module.exports = mongoose.model('Message', MessageSchema);
