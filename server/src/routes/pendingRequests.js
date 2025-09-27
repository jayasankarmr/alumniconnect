const express = require('express');
const router = express.Router();
const PendingRequest = require('../models/PendingRequest');
const Event = require('../models/Event');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// Get all pending requests (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const requests = await PendingRequest.find({ status: 'pending' })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending requests'
    });
  }
});

// Submit a new request
router.post('/', auth, async (req, res) => {
  try {
    const { type, data } = req.body;

    // Validate request type
    if (!['event', 'opportunity', 'mentor'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request type'
      });
    }

    // Create pending request
    const pendingRequest = new PendingRequest({
      type,
      submittedBy: req.user._id,
      [`${type}Data`]: data
    });

    await pendingRequest.save();

    res.status(201).json({
      success: true,
      message: 'Your request has been submitted for review. You will be notified once it\'s approved.',
      data: pendingRequest
    });
  } catch (error) {
    console.error('Submit request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit request'
    });
  }
});

// Approve a request (Admin only)
router.put('/:id/approve', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { reviewNotes } = req.body;
    const request = await PendingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update request status
    request.status = 'approved';
    request.reviewedBy = req.user._id;
    request.reviewDate = new Date();
    request.reviewNotes = reviewNotes;

    // Create the actual item based on type
    if (request.type === 'event') {
      const event = new Event({
        ...request.eventData,
        createdBy: request.submittedBy,
        status: 'published'
      });
      await event.save();
    } else if (request.type === 'opportunity') {
      const opportunity = new Opportunity({
        ...request.opportunityData,
        createdBy: request.submittedBy,
        status: 'published'
      });
      await opportunity.save();
    } else if (request.type === 'mentor') {
      // Update user's mentor status
      await User.findByIdAndUpdate(request.submittedBy, {
        isMentor: true,
        mentorProfile: request.mentorData
      });
    }

    await request.save();

    res.json({
      success: true,
      message: 'Request approved successfully'
    });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve request'
    });
  }
});

// Reject a request (Admin only)
router.put('/:id/reject', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { reviewNotes } = req.body;
    const request = await PendingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update request status
    request.status = 'rejected';
    request.reviewedBy = req.user._id;
    request.reviewDate = new Date();
    request.reviewNotes = reviewNotes;

    await request.save();

    res.json({
      success: true,
      message: 'Request rejected'
    });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject request'
    });
  }
});

// Get user's submitted requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await PendingRequest.find({ submittedBy: req.user._id })
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your requests'
    });
  }
});

module.exports = router;
