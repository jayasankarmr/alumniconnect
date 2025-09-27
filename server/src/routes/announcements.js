const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get announcements
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('priority').optional().isIn(['low', 'normal', 'high', 'urgent'])
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
    const filter = { status: 'sent' };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const announcements = await Announcement.find(filter)
      .populate('sentBy', 'name')
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      success: true,
      data: announcements,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch announcements' 
    });
  }
});

// Create announcement (Admin only)
router.post('/', auth, adminAuth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('body').trim().notEmpty().withMessage('Body is required'),
  body('category').optional().isIn(['general', 'events', 'opportunities', 'alumni-news', 'urgent']),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
  body('segments.graduationYears').optional().isArray(),
  body('segments.departments').optional().isArray(),
  body('segments.locations').optional().isArray(),
  body('segments.roles').optional().isArray()
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

    // Build recipient filter based on segments
    const recipientFilter = { role: { $in: ['alumni', 'student'] } };
    
    if (req.body.segments) {
      const { graduationYears, departments, locations, roles } = req.body.segments;
      
      const conditions = [];
      
      if (graduationYears && graduationYears.length > 0) {
        conditions.push({ graduationYear: { $in: graduationYears } });
      }
      if (departments && departments.length > 0) {
        conditions.push({ department: { $in: departments } });
      }
      if (locations && locations.length > 0) {
        conditions.push({ location: { $in: locations } });
      }
      if (roles && roles.length > 0) {
        recipientFilter.role = { $in: roles };
      }
      
      if (conditions.length > 0) {
        recipientFilter.$and = conditions;
      }
    }

    // Count potential recipients
    const totalRecipients = await User.countDocuments(recipientFilter);

    const announcementData = {
      ...req.body,
      sentBy: req.user._id,
      totalRecipients,
      status: 'sent',
      sentAt: new Date()
    };

    const announcement = new Announcement(announcementData);
    await announcement.save();

    // TODO: Send actual notifications/emails to recipients
    // For now, we'll just mark as delivered
    announcement.deliveredCount = totalRecipients;
    await announcement.save();

    await announcement.populate('sentBy', 'name');

    res.status(201).json({
      success: true,
      message: `Announcement sent to ${totalRecipients} recipients`,
      data: announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create announcement' 
    });
  }
});

// Get single announcement
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('sentBy', 'name email');

    if (!announcement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Announcement not found' 
      });
    }

    // Increment read count if not admin
    if (!req.user || req.user.role !== 'admin') {
      announcement.readCount += 1;
      await announcement.save();
    }

    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch announcement' 
    });
  }
});

// Update announcement (Admin only)
router.put('/:id', auth, adminAuth, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('body').optional().trim().notEmpty().withMessage('Body cannot be empty'),
  body('status').optional().isIn(['draft', 'scheduled', 'sent', 'failed'])
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

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('sentBy', 'name');

    if (!announcement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Announcement not found' 
      });
    }

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update announcement' 
    });
  }
});

// Delete announcement (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Announcement not found' 
      });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete announcement' 
    });
  }
});

// Get announcement analytics (Admin only)
router.get('/:id/analytics', auth, adminAuth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Announcement not found' 
      });
    }

    const analytics = {
      totalRecipients: announcement.totalRecipients,
      delivered: announcement.deliveredCount,
      read: announcement.readCount,
      deliveryRate: announcement.totalRecipients ? 
        (announcement.deliveredCount / announcement.totalRecipients * 100).toFixed(2) : 0,
      readRate: announcement.deliveredCount ? 
        (announcement.readCount / announcement.deliveredCount * 100).toFixed(2) : 0
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get announcement analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch analytics' 
    });
  }
});

module.exports = router;