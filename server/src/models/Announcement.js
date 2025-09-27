const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  
  // Targeting & Segmentation
  segments: {
    graduationYears: [Number],
    departments: [String],
    locations: [String],
    companies: [String],
    roles: [{ type: String, enum: ['alumni', 'admin', 'recruiter', 'student'] }],
    verificationStatus: [String]
  },
  
  // Sender Information
  sentBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sentAt: { type: Date, default: Date.now },
  
  // Status & Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'failed'],
    default: 'draft'
  },
  
  // Scheduling
  scheduledFor: Date,
  
  // Delivery Tracking
  totalRecipients: { type: Number, default: 0 },
  deliveredCount: { type: Number, default: 0 },
  readCount: { type: Number, default: 0 },
  
  // Content & Media
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  
  // Categories & Tags
  category: {
    type: String,
    enum: ['general', 'events', 'opportunities', 'alumni-news', 'urgent'],
    default: 'general'
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes
announcementSchema.index({ sentBy: 1, sentAt: -1 });
announcementSchema.index({ status: 1 });
announcementSchema.index({ category: 1 });
announcementSchema.index({ scheduledFor: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);