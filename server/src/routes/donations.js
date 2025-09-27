const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get donations (with filters for admin)
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('campaign').optional().isMongoId(),
  query('status').optional().isIn(['pending', 'completed', 'failed', 'refunded']),
  query('method').optional().isIn(['card', 'upi', 'netbanking', 'wallet', 'bank_transfer', 'cash', 'cheque'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter based on user role
    let filter = {};
    
    if (req.user.role === 'admin') {
      // Admin can see all donations
      if (req.query.campaign) {
        filter.campaignId = req.query.campaign;
      }
      if (req.query.status) {
        filter.paymentStatus = req.query.status;
      }
      if (req.query.method) {
        filter.paymentMethod = req.query.method;
      }
    } else {
      // Users can only see their own donations
      filter.alumniId = req.user._id;
    }

    const donations = await Donation.find(filter)
      .populate('alumniId', 'name email')
      .populate('campaignId', 'name')
      .sort({ donatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donation.countDocuments(filter);

    // Hide sensitive info for non-admin users
    const sanitizedDonations = donations.map(donation => {
      const donationObj = donation.toObject();
      if (req.user.role !== 'admin' && donation.isAnonymous) {
        delete donationObj.alumniId;
      }
      return donationObj;
    });

    res.json({
      success: true,
      data: sanitizedDonations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch donations' 
    });
  }
});

// Create donation (mock payment)
router.post('/', auth, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('campaignId').optional().isMongoId().withMessage('Invalid campaign ID'),
  body('paymentMethod').isIn(['card', 'upi', 'netbanking', 'wallet', 'bank_transfer', 'cash', 'cheque']).withMessage('Invalid payment method'),
  body('isAnonymous').optional().isBoolean(),
  body('note').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { amount, campaignId, paymentMethod, isAnonymous, note } = req.body;

    // Validate campaign if provided
    let campaign = null;
    if (campaignId) {
      campaign = await Campaign.findById(campaignId);
      if (!campaign || campaign.status !== 'active') {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid or inactive campaign' 
        });
      }
    }

    // Create donation record
    const donationData = {
      alumniId: req.user._id,
      amount,
      paymentMethod,
      isAnonymous: isAnonymous || false,
      note,
      donationType: 'one-time',
      paymentStatus: 'completed', // Mock as completed
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      donatedAt: new Date(),
      processedAt: new Date()
    };

    if (campaignId) {
      donationData.campaignId = campaignId;
    }

    const donation = new Donation(donationData);
    await donation.save();

    // Update campaign totals if applicable
    if (campaign) {
      campaign.currentAmount += amount;
      campaign.donorCount += 1;
      campaign.averageDonation = campaign.currentAmount / campaign.donorCount;
      await campaign.save();
    }

    // Add to user's donation history
    const user = await User.findById(req.user._id);
    user.donations.push({
      amount,
      date: new Date(),
      campaignId: campaignId || null,
      note
    });
    await user.save();

    await donation.populate([
      { path: 'alumniId', select: 'name email' },
      { path: 'campaignId', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully',
      data: donation
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process donation' 
    });
  }
});

// Get donation summary
router.get('/summary', auth, async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role !== 'admin') {
      filter.alumniId = req.user._id;
    }

    const [totalStats, monthlyStats] = await Promise.all([
      Donation.aggregate([
        { $match: { ...filter, paymentStatus: 'completed' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalDonations: { $sum: 1 },
            averageDonation: { $avg: '$amount' }
          }
        }
      ]),
      Donation.aggregate([
        {
          $match: {
            ...filter,
            paymentStatus: 'completed',
            donatedAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
          }
        },
        {
          $group: {
            _id: { 
              year: { $year: '$donatedAt' },
              month: { $month: '$donatedAt' }
            },
            amount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    const summary = {
      total: totalStats[0] || { totalAmount: 0, totalDonations: 0, averageDonation: 0 },
      monthly: monthlyStats
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get donation summary error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch donation summary' 
    });
  }
});

// Get campaigns
router.get('/campaigns', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['draft', 'active', 'paused', 'completed', 'cancelled']),
  query('category').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    } else if (!req.user || req.user.role !== 'admin') {
      // Non-admin users only see active campaigns
      filter.status = 'active';
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const campaigns = await Campaign.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Campaign.countDocuments(filter);

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch campaigns' 
    });
  }
});

// Create campaign (Admin only)
router.post('/campaigns', auth, adminAuth, [
  body('name').trim().notEmpty().withMessage('Campaign name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('goalAmount').isFloat({ min: 1 }).withMessage('Goal amount must be greater than 0'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('category').isIn(['infrastructure', 'scholarship', 'research', 'sports', 'cultural', 'emergency', 'general']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const campaignData = {
      ...req.body,
      createdBy: req.user._id
    };

    const campaign = new Campaign(campaignData);
    await campaign.save();

    await campaign.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create campaign' 
    });
  }
});

module.exports = router;