const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get events with filters and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('mode').optional().isIn(['online', 'offline', 'hybrid']),
  query('upcoming').optional().isBoolean(),
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
    const filter = { status: 'published' };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.mode) {
      filter.mode = req.query.mode;
    }
    if (req.query.upcoming === 'true') {
      filter.startDate = { $gt: new Date() };
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch events' 
    });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('rsvpAlumniIds', 'name email graduationYear department');

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Check if user can view this event
    if (event.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Event not available' 
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch event' 
    });
  }
});

// Create event (Admin only)
router.post('/', auth, adminAuth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('mode').isIn(['online', 'offline', 'hybrid']).withMessage('Invalid mode'),
  body('category').optional().isIn(['networking', 'workshop', 'seminar', 'reunion', 'career', 'social']),
  body('maxSeats').optional().isInt({ min: 1 }).withMessage('Max seats must be positive integer'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
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

    // Validate date logic
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    
    if (endDate <= startDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'End date must be after start date' 
      });
    }

    const eventData = {
      ...req.body,
      createdBy: req.user._id,
      startDate,
      endDate
    };

    const event = new Event(eventData);
    await event.save();

    await event.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create event' 
    });
  }
});

// Update event (Admin only)
router.put('/:id', auth, adminAuth, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('startDate').optional().isISO8601().withMessage('Valid start date required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date required'),
  body('mode').optional().isIn(['online', 'offline', 'hybrid']).withMessage('Invalid mode'),
  body('status').optional().isIn(['draft', 'published', 'cancelled', 'completed']).withMessage('Invalid status')
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

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update event' 
    });
  }
});

// RSVP to event
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    if (event.status !== 'published') {
      return res.status(400).json({ 
        success: false, 
        message: 'Event is not available for RSVP' 
      });
    }

    // Check if already RSVPed
    if (event.rsvpAlumniIds.includes(req.user._id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already RSVPed to this event' 
      });
    }

    // Check if event is full
    if (event.maxSeats && event.rsvpAlumniIds.length >= event.maxSeats) {
      // Add to waitlist if not already there
      if (!event.waitlistIds.includes(req.user._id)) {
        event.waitlistIds.push(req.user._id);
        await event.save();
        
        return res.json({
          success: true,
          message: 'Added to waitlist',
          waitlisted: true
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Event is full and you are already on waitlist' 
        });
      }
    }

    // Add to RSVP list
    event.rsvpAlumniIds.push(req.user._id);
    await event.save();

    res.json({
      success: true,
      message: 'RSVP successful',
      waitlisted: false
    });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to RSVP' 
    });
  }
});

// Cancel RSVP
router.delete('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Remove from RSVP list
    event.rsvpAlumniIds = event.rsvpAlumniIds.filter(
      id => id.toString() !== req.user._id.toString()
    );

    // Remove from waitlist if exists
    event.waitlistIds = event.waitlistIds.filter(
      id => id.toString() !== req.user._id.toString()
    );

    // Move first person from waitlist to RSVP if there's space
    if (event.waitlistIds.length > 0 && (!event.maxSeats || event.rsvpAlumniIds.length < event.maxSeats)) {
      const waitlistId = event.waitlistIds.shift();
      event.rsvpAlumniIds.push(waitlistId);
    }

    await event.save();

    res.json({
      success: true,
      message: 'RSVP cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel RSVP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel RSVP' 
    });
  }
});

// Delete event (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete event' 
    });
  }
});

module.exports = router;