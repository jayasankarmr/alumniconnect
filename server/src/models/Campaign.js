const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  
  // Financial Goals
  goalAmount: { type: Number, required: true, min: 0 },
  currentAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  
  // Timeline
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Campaign Details
  category: {
    type: String,
    enum: ['infrastructure', 'scholarship', 'research', 'sports', 'cultural', 'emergency', 'general'],
    required: true
  },
  
  // Visual Content
  bannerUrl: String,
  images: [String],
  
  // Status & Management
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Statistics
  donorCount: { type: Number, default: 0 },
  averageDonation: { type: Number, default: 0 },
  
  // Settings
  isPublic: { type: Boolean, default: true },
  allowAnonymous: { type: Boolean, default: true },
  minimumAmount: { type: Number, default: 100 }
}, {
  timestamps: true
});

// Indexes
campaignSchema.index({ status: 1, endDate: 1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ createdBy: 1 });

// Virtual for completion percentage
campaignSchema.virtual('completionPercentage').get(function() {
  return Math.min(100, (this.currentAmount / this.goalAmount) * 100);
});

// Virtual for is active
campaignSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && now >= this.startDate && now <= this.endDate;
});

module.exports = mongoose.model('Campaign', campaignSchema);