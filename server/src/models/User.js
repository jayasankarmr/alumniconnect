const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  note: String
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ['alumni', 'admin', 'recruiter', 'student'], 
    default: 'alumni' 
  },
  
  // Academic Information
  graduationYear: { type: Number, required: true },
  degree: { type: String, required: true },
  department: { type: String, required: true },
  rollNo: String,
  
  // Contact & Professional
  phone: String,
  location: String,
  company: String,
  title: String,
  bio: { type: String, maxlength: 500 },
  
  // Skills & Links
  skills: [String],
  linkedinUrl: String,
  githubUrl: String,
  portfolioUrl: String,
  
  // Settings & Status
  isMentor: { type: Boolean, default: false },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  visibility: { 
    type: String, 
    enum: ['public', 'alumni', 'private'], 
    default: 'public' 
  },
  
  // Donations
  donations: [donationSchema],
  
  // Account Management
  isEmailVerified: { type: Boolean, default: false },
  profilePicture: String,
  lastLogin: Date,
  
  // Preferences
  notifications: {
    events: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
    opportunities: { type: Boolean, default: true },
    mentorship: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Indexes for better search performance
userSchema.index({ email: 1 });
userSchema.index({ graduationYear: 1, department: 1 });
userSchema.index({ company: 1 });
userSchema.index({ verificationStatus: 1 });
userSchema.index({ skills: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);