const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  alumniId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  campaignId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign' 
  },
  
  // Amount & Currency
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  
  // Transaction Details
  transactionId: String,
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'bank_transfer', 'cash', 'cheque'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Donation Details
  donationType: {
    type: String,
    enum: ['one-time', 'recurring', 'pledge'],
    default: 'one-time'
  },
  isAnonymous: { type: Boolean, default: false },
  note: String,
  
  // Tax & Receipt
  taxDeductible: { type: Boolean, default: true },
  receiptGenerated: { type: Boolean, default: false },
  receiptUrl: String,
  
  // Dates
  donatedAt: { type: Date, default: Date.now },
  processedAt: Date
}, {
  timestamps: true
});

// Indexes
donationSchema.index({ alumniId: 1, donatedAt: -1 });
donationSchema.index({ campaignId: 1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ donatedAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);