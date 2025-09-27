const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Opportunity = require('../models/Opportunity');
const Donation = require('../models/Donation');
const Announcement = require('../models/Announcement');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get overview analytics (Admin only)
router.get('/overview', auth, adminAuth, async (req, res) => {
  try {
    const [
      totalAlumni,
      verifiedAlumni,
      mentors,
      upcomingEvents,
      totalEvents,
      activeOpportunities,
      totalOpportunities,
      monthlyRSVPs,
      totalDonations,
      monthlyDonations
    ] = await Promise.all([
      User.countDocuments({ role: 'alumni' }),
      User.countDocuments({ role: 'alumni', verificationStatus: 'approved' }),
      User.countDocuments({ role: 'alumni', isMentor: true }),
      Event.countDocuments({ 
        status: 'published', 
        startDate: { $gt: new Date() } 
      }),
      Event.countDocuments(),
      Opportunity.countDocuments({ status: 'active' }),
      Opportunity.countDocuments(),
      Event.aggregate([
        {
          $match: {
            status: 'published',
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
          }
        },
        {
          $group: {
            _id: null,
            totalRSVPs: { $sum: { $size: '$rsvpAlumniIds' } }
          }
        }
      ]),
      Donation.aggregate([
        {
          $match: { paymentStatus: 'completed' }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalCount: { $sum: 1 }
          }
        }
      ]),
      Donation.aggregate([
        {
          $match: {
            paymentStatus: 'completed',
            donatedAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
          }
        },
        {
          $group: {
            _id: null,
            monthlyAmount: { $sum: '$amount' },
            monthlyCount: { $sum: 1 }
          }
        }
      ])
    ]);

    const verificationRate = totalAlumni > 0 ? 
      ((verifiedAlumni / totalAlumni) * 100).toFixed(1) : 0;

    const monthlyRSVPCount = monthlyRSVPs[0]?.totalRSVPs || 0;
    const donationStats = totalDonations[0] || { totalAmount: 0, totalCount: 0 };
    const monthlyDonationStats = monthlyDonations[0] || { monthlyAmount: 0, monthlyCount: 0 };

    const analytics = {
      users: {
        totalAlumni,
        verifiedAlumni,
        verificationRate: `${verificationRate}%`,
        mentors,
        pendingVerifications: totalAlumni - verifiedAlumni
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        monthlyRSVPs: monthlyRSVPCount
      },
      opportunities: {
        total: totalOpportunities,
        active: activeOpportunities,
        filled: totalOpportunities - activeOpportunities
      },
      donations: {
        totalAmount: donationStats.totalAmount,
        totalCount: donationStats.totalCount,
        monthlyAmount: monthlyDonationStats.monthlyAmount,
        monthlyCount: monthlyDonationStats.monthlyCount,
        averageDonation: donationStats.totalCount > 0 ? 
          (donationStats.totalAmount / donationStats.totalCount).toFixed(2) : 0
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch analytics' 
    });
  }
});

// Get alumni distribution by graduation year
router.get('/alumni/graduation-years', auth, adminAuth, async (req, res) => {
  try {
    const distribution = await User.aggregate([
      {
        $match: { role: 'alumni', verificationStatus: 'approved' }
      },
      {
        $group: {
          _id: '$graduationYear',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          year: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('Get graduation years analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch graduation year analytics' 
    });
  }
});

// Get alumni distribution by department
router.get('/alumni/departments', auth, adminAuth, async (req, res) => {
  try {
    const distribution = await User.aggregate([
      {
        $match: { role: 'alumni', verificationStatus: 'approved' }
      },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $project: {
          department: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('Get departments analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch department analytics' 
    });
  }
});

// Get event RSVP trends
router.get('/events/rsvp-trends', auth, adminAuth, async (req, res) => {
  try {
    const trends = await Event.aggregate([
      {
        $match: {
          status: 'published',
          startDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$startDate' },
            month: { $month: '$startDate' }
          },
          totalEvents: { $sum: 1 },
          totalRSVPs: { $sum: { $size: '$rsvpAlumniIds' } },
          averageRSVPs: { $avg: { $size: '$rsvpAlumniIds' } }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          month: '$_id.month',
          year: '$_id.year',
          totalEvents: 1,
          totalRSVPs: 1,
          averageRSVPs: { $round: ['$averageRSVPs', 1] },
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Get RSVP trends error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch RSVP trends' 
    });
  }
});

// Get donation trends
router.get('/donations/trends', auth, adminAuth, async (req, res) => {
  try {
    const trends = await Donation.aggregate([
      {
        $match: {
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
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          averageDonation: { $avg: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          month: '$_id.month',
          year: '$_id.year',
          totalAmount: 1,
          totalDonations: 1,
          averageDonation: { $round: ['$averageDonation', 2] },
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Get donation trends error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch donation trends' 
    });
  }
});

// Get top companies by alumni count
router.get('/alumni/companies', auth, adminAuth, async (req, res) => {
  try {
    const companies = await User.aggregate([
      {
        $match: { 
          role: 'alumni', 
          verificationStatus: 'approved',
          company: { $exists: true, $ne: '', $ne: null }
        }
      },
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 20
      },
      {
        $project: {
          company: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Get companies analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch companies analytics' 
    });
  }
});

module.exports = router;