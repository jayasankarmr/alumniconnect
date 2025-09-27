const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['job', 'internship', 'volunteer', 'project'], 
    required: true 
  },
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  location: String,
  mode: { 
    type: String, 
    enum: ['remote', 'hybrid', 'on-site'], 
    required: true 
  },
  description: { type: String, required: true },
  requirements: [String],
  skillsRequired: [String],
  
  // Application Details
  applyUrl: String,
  applyEmail: String,
  applicationDeadline: Date,
  
  // Compensation & Details
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  experience: {
    min: { type: Number, default: 0 },
    max: Number
  },
  
  // Organization
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tags: [String],
  category: String,
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['active', 'filled', 'expired', 'draft'],
    default: 'active'
  },
  isVerified: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  
  // Application Tracking
  applicationCount: { type: Number, default: 0 },
  interestedAlumni: [{
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes
opportunitySchema.index({ type: 1, status: 1 });
opportunitySchema.index({ company: 1 });
opportunitySchema.index({ skillsRequired: 1 });
opportunitySchema.index({ applicationDeadline: 1 });
opportunitySchema.index({ postedBy: 1 });

// Virtual for is expired
opportunitySchema.virtual('isExpired').get(function() {
  return this.applicationDeadline && new Date() > this.applicationDeadline;
});

module.exports = mongoose.model('Opportunity', opportunitySchema);