const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Opportunity = require('../models/Opportunity');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get opportunities with filters and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isIn(['job', 'internship', 'volunteer', 'project']),
  query('mode').optional().isIn(['remote', 'hybrid', 'on-site']),
  query('company').optional().isString(),
  query('skills').optional().isString(),
  query('search').optional().isString()
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
    const filter = { status: 'active' };
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.mode) {
      filter.mode = req.query.mode;
    }
    if (req.query.company) {
      filter.company = new RegExp(req.query.company, 'i');
    }
    if (req.query.skills) {
      filter.skillsRequired = { $in: [new RegExp(req.query.skills, 'i')] };
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex },
        { skillsRequired: { $in: [searchRegex] } }
      ];
    }

    const opportunities = await Opportunity.find(filter)
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Opportunity.countDocuments(filter);

    res.json({
      success: true,
      data: opportunities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch opportunities' 
    });
  }
});

// Get single opportunity
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedBy', 'name email company title');

    if (!opportunity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Opportunity not found' 
      });
    }

    // Increment view count
    opportunity.viewCount += 1;
    await opportunity.save();

    res.json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch opportunity' 
    });
  }
});

// Create opportunity
router.post('/', auth, [
  body('type').isIn(['job', 'internship', 'volunteer', 'project']).withMessage('Invalid type'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('mode').isIn(['remote', 'hybrid', 'on-site']).withMessage('Invalid mode'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('skillsRequired').optional().isArray().withMessage('Skills must be an array'),
  body('applicationDeadline').optional().isISO8601().withMessage('Valid deadline required')
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

    // Check if user can post opportunities
    if (req.user.role === 'student') {
      return res.status(403).json({ 
        success: false, 
        message: 'Students cannot post opportunities' 
      });
    }

    const opportunityData = {
      ...req.body,
      postedBy: req.user._id,
      isVerified: req.user.role === 'admin' || req.user.verificationStatus === 'approved'
    };

    const opportunity = new Opportunity(opportunityData);
    await opportunity.save();

    await opportunity.populate('postedBy', 'name company');

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      data: opportunity
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create opportunity' 
    });
  }
});

// Update opportunity
router.put('/:id', auth, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('status').optional().isIn(['active', 'filled', 'expired', 'draft']).withMessage('Invalid status')
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

    const opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Opportunity not found' 
      });
    }

    // Check if user can update this opportunity
    if (opportunity.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only update your own opportunities' 
      });
    }

    Object.assign(opportunity, req.body);
    await opportunity.save();

    await opportunity.populate('postedBy', 'name company');

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      data: opportunity
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update opportunity' 
    });
  }
});

// Express interest in opportunity
router.post('/:id/interest', auth, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Opportunity not found' 
      });
    }

    // Check if already expressed interest
    const alreadyInterested = opportunity.interestedAlumni.some(
      interested => interested.alumniId.toString() === req.user._id.toString()
    );

    if (alreadyInterested) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already expressed interest in this opportunity' 
      });
    }

    opportunity.interestedAlumni.push({
      alumniId: req.user._id,
      appliedAt: new Date()
    });
    opportunity.applicationCount += 1;

    await opportunity.save();

    res.json({
      success: true,
      message: 'Interest expressed successfully'
    });
  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to express interest' 
    });
  }
});

// Get my opportunities (posted by user)
router.get('/my/posted', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const opportunities = await Opportunity.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Opportunity.countDocuments({ postedBy: req.user._id });

    res.json({
      success: true,
      data: opportunities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get my opportunities error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your opportunities' 
    });
  }
});

// Delete opportunity
router.delete('/:id', auth, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Opportunity not found' 
      });
    }

    // Check if user can delete this opportunity
    if (opportunity.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own opportunities' 
      });
    }

    await Opportunity.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete opportunity' 
    });
  }
});

module.exports = router;