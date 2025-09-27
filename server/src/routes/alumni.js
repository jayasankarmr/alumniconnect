const express = require('express');
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, adminAuth, verifiedAuth } = require('../middleware/auth');

const router = express.Router();

// Get alumni list with filters and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
  query('graduationYear').optional().isInt().withMessage('Invalid graduation year'),
  query('department').optional().isString(),
  query('company').optional().isString(),
  query('location').optional().isString(),
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

    // Build filter object
    const filter = { role: 'alumni' };
    
    // Apply visibility filter based on user role
    if (!req.user) {
      filter.visibility = 'public';
    } else if (req.user.role !== 'admin') {
      filter.$or = [
        { visibility: 'public' },
        { visibility: 'alumni' }
      ];
    }

    // Only show approved alumni to non-admin users
    if (!req.user || req.user.role !== 'admin') {
      filter.verificationStatus = 'approved';
    }

    // Apply filters
    if (req.query.graduationYear) {
      filter.graduationYear = parseInt(req.query.graduationYear);
    }
    if (req.query.department) {
      filter.department = new RegExp(req.query.department, 'i');
    }
    if (req.query.company) {
      filter.company = new RegExp(req.query.company, 'i');
    }
    if (req.query.location) {
      filter.location = new RegExp(req.query.location, 'i');
    }
    if (req.query.skills) {
      filter.skills = { $in: [new RegExp(req.query.skills, 'i')] };
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { company: searchRegex },
        { title: searchRegex },
        { skills: { $in: [searchRegex] } }
      ];
    }
    if (req.query.isMentor === 'true') {
      filter.isMentor = true;
    }

    // Get alumni with pagination
    const alumni = await User.find(filter)
      .select('-password -donations')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    // Hide sensitive information based on visibility settings
    const sanitizedAlumni = alumni.map(alum => {
      const alumObj = alum.toObject();
      if (alum.visibility === 'private' && req.user?._id.toString() !== alum._id.toString()) {
        delete alumObj.email;
        delete alumObj.phone;
      }
      return alumObj;
    });

    res.json({
      success: true,
      data: sanitizedAlumni,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch alumni' 
    });
  }
});

// Get single alumni profile
router.get('/:id', async (req, res) => {
  try {
    const alumni = await User.findById(req.params.id)
      .select('-password')
      .populate('donations.campaignId', 'name');

    if (!alumni || alumni.role !== 'alumni') {
      return res.status(404).json({ 
        success: false, 
        message: 'Alumni not found' 
      });
    }

    // Check visibility permissions
    const canViewFull = req.user && (
      req.user._id.toString() === alumni._id.toString() || 
      req.user.role === 'admin' ||
      alumni.visibility === 'public' ||
      (alumni.visibility === 'alumni' && req.user.role !== 'student')
    );

    if (!canViewFull && alumni.visibility === 'private') {
      return res.status(403).json({ 
        success: false, 
        message: 'Profile is private' 
      });
    }

    // Sanitize data based on visibility
    const alumniData = alumni.toObject();
    if (!canViewFull) {
      delete alumniData.email;
      delete alumniData.phone;
      delete alumniData.donations;
    }

    res.json({
      success: true,
      data: alumniData
    });
  } catch (error) {
    console.error('Get alumni profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch alumni profile' 
    });
  }
});

// Update alumni profile
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('location').optional().isString(),
  body('company').optional().isString(),
  body('title').optional().isString(),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be under 500 characters'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('linkedinUrl').optional().isURL().withMessage('Valid LinkedIn URL required'),
  body('githubUrl').optional().isURL().withMessage('Valid GitHub URL required'),
  body('portfolioUrl').optional().isURL().withMessage('Valid portfolio URL required'),
  body('visibility').optional().isIn(['public', 'alumni', 'private']).withMessage('Invalid visibility option'),
  body('isMentor').optional().isBoolean().withMessage('isMentor must be boolean')
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

    // Check if user can update this profile
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only update your own profile' 
      });
    }

    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated through this endpoint
    delete updateData.email;
    delete updateData.password;
    delete updateData.role;
    delete updateData.verificationStatus;
    delete updateData.donations;

    const alumni = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!alumni) {
      return res.status(404).json({ 
        success: false, 
        message: 'Alumni not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: alumni
    });
  } catch (error) {
    console.error('Update alumni error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
});

// Admin: Approve/Reject alumni
router.put('/:id/verify', auth, adminAuth, [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('reason').optional().isString().withMessage('Reason must be a string')
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

    const { status, reason } = req.body;

    const alumni = await User.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status },
      { new: true }
    ).select('-password');

    if (!alumni) {
      return res.status(404).json({ 
        success: false, 
        message: 'Alumni not found' 
      });
    }

    // TODO: Send email notification to alumni about verification status

    res.json({
      success: true,
      message: `Alumni ${status} successfully`,
      data: alumni
    });
  } catch (error) {
    console.error('Verify alumni error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify alumni' 
    });
  }
});

// Get pending verifications (Admin only)
router.get('/admin/pending', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const pendingAlumni = await User.find({ 
      role: 'alumni', 
      verificationStatus: 'pending' 
    })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ 
      role: 'alumni', 
      verificationStatus: 'pending' 
    });

    res.json({
      success: true,
      data: pendingAlumni,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get pending alumni error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending alumni' 
    });
  }
});

module.exports = router;