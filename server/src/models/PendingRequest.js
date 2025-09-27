const mongoose = require('mongoose');

const pendingRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'opportunity', 'mentor'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: {
    type: Date
  },
  reviewNotes: {
    type: String
  },
  // Event-specific fields
  eventData: {
    title: String,
    description: String,
    category: String,
    startDate: Date,
    endDate: Date,
    venue: String,
    virtualLink: String,
    maxSeats: Number,
    tags: [String]
  },
  // Opportunity-specific fields
  opportunityData: {
    title: String,
    company: String,
    location: String,
    type: String,
    mode: String,
    description: String,
    salaryRange: {
      min: Number,
      max: Number,
      currency: String
    },
    experience: {
      min: Number,
      max: Number
    },
    applicationDeadline: Date,
    applicationLink: String,
    contactEmail: String,
    skillsRequired: [String]
  },
  // Mentor-specific fields
  mentorData: {
    areasOfExpertise: [String],
    experience: String,
    availability: String,
    bio: String,
    linkedinUrl: String,
    preferredMenteeType: String,
    mentoringStyle: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
pendingRequestSchema.index({ type: 1, status: 1 });
pendingRequestSchema.index({ submittedBy: 1 });

module.exports = mongoose.model('PendingRequest', pendingRequestSchema);
