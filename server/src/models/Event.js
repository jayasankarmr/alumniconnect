const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  mode: { 
    type: String, 
    enum: ['online', 'offline', 'hybrid'], 
    required: true 
  },
  venue: String,
  virtualLink: String,
  bannerUrl: String,
  
  // RSVP Management
  rsvpDeadline: Date,
  maxSeats: Number,
  rsvpAlumniIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  waitlistIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Organization
  tags: [String],
  category: {
    type: String,
    enum: ['networking', 'workshop', 'seminar', 'reunion', 'career', 'social'],
    default: 'networking'
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Status & Settings
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  isPublic: { type: Boolean, default: true },
  requiresApproval: { type: Boolean, default: false },
  
  // Notifications
  reminderSent: { type: Boolean, default: false },
  followUpSent: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ createdBy: 1 });

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function() {
  if (!this.maxSeats) return null;
  return Math.max(0, this.maxSeats - this.rsvpAlumniIds.length);
});

// Virtual for is full
eventSchema.virtual('isFull').get(function() {
  if (!this.maxSeats) return false;
  return this.rsvpAlumniIds.length >= this.maxSeats;
});

module.exports = mongoose.model('Event', eventSchema);