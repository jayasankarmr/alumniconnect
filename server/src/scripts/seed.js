const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');
const Opportunity = require('../models/Opportunity');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
require('dotenv').config();

const departments = [
  'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
  'Civil Engineering', 'Electronics & Communication', 'Information Technology',
  'Chemical Engineering', 'Aerospace Engineering', 'Biotechnology', 'MBA'
];

const companies = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla',
  'TCS', 'Infosys', 'Wipro', 'Accenture', 'IBM', 'Oracle', 'Salesforce',
  'Flipkart', 'Zomato', 'Paytm', 'Razorpay', 'BYJU\'S', 'Swiggy'
];

const skills = [
  'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
  'Machine Learning', 'Data Science', 'AI', 'Cloud Computing', 'DevOps',
  'Product Management', 'Digital Marketing', 'Finance', 'Operations',
  'Leadership', 'Project Management', 'Strategic Planning', 'Business Analysis'
];

const locations = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
  'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
  'New York', 'San Francisco', 'London', 'Singapore', 'Dubai', 'Toronto'
];

const generateRandomAlumni = (index) => {
  const graduationYear = 2015 + Math.floor(Math.random() * 8); // 2015-2022
  const department = departments[Math.floor(Math.random() * departments.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const selectedSkills = skills.slice(0, 3 + Math.floor(Math.random() * 3));
  
  return {
    name: `Alumni User ${index + 1}`,
    email: `alumni${index + 1}@university.edu`,
    password: 'password123',
    graduationYear,
    degree: 'B.Tech',
    department,
    rollNo: `${graduationYear}${department.substring(0, 2).toUpperCase()}${String(index + 1).padStart(3, '0')}`,
    phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    location,
    company,
    title: ['Software Engineer', 'Product Manager', 'Data Scientist', 'Senior Developer', 'Team Lead'][Math.floor(Math.random() * 5)],
    bio: `Passionate ${department} professional with ${Math.floor(Math.random() * 8) + 1} years of experience in ${company}.`,
    skills: selectedSkills,
    linkedinUrl: `https://linkedin.com/in/alumni-${index + 1}`,
    isMentor: Math.random() > 0.7,
    verificationStatus: 'approved',
    visibility: ['public', 'alumni'][Math.floor(Math.random() * 2)],
    isEmailVerified: true
  };
};

const sampleEvents = [
  {
    title: 'Annual Alumni Reunion 2024',
    description: 'Join us for our biggest alumni gathering of the year! Reconnect with old friends, network with professionals, and celebrate our shared journey.',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000), // 32 days from now
    mode: 'offline',
    venue: 'University Main Auditorium',
    category: 'reunion',
    maxSeats: 500,
    tags: ['networking', 'reunion', 'celebration'],
    status: 'published'
  },
  {
    title: 'Tech Talk: Future of AI in Industry',
    description: 'Learn about the latest trends in artificial intelligence from industry experts and alumni working at top tech companies.',
    startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    mode: 'hybrid',
    venue: 'Engineering Building, Hall A',
    virtualLink: 'https://meet.google.com/tech-talk-ai',
    category: 'workshop',
    maxSeats: 200,
    tags: ['technology', 'AI', 'career'],
    status: 'published'
  },
  {
    title: 'Career Guidance Workshop',
    description: 'Get insights from successful alumni on career transitions, skill development, and professional growth strategies.',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
    mode: 'online',
    virtualLink: 'https://zoom.us/career-workshop',
    category: 'career',
    tags: ['career', 'mentorship', 'guidance'],
    status: 'published'
  }
];

const sampleOpportunities = [
  {
    type: 'job',
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Ltd',
    location: 'Bangalore',
    mode: 'hybrid',
    description: 'We are looking for a senior software engineer with 4+ years of experience in full-stack development.',
    requirements: ['4+ years experience', 'React/Node.js expertise', 'Team leadership skills'],
    skillsRequired: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    applyUrl: 'https://company.com/careers/senior-engineer',
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 1200000, max: 1800000 },
    experience: { min: 4, max: 8 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'internship',
    title: 'Data Science Intern',
    company: 'Analytics Corp',
    location: 'Mumbai',
    mode: 'remote',
    description: 'Summer internship opportunity for students/recent graduates interested in data science and machine learning.',
    requirements: ['Python programming', 'Statistics background', 'ML fundamentals'],
    skillsRequired: ['Python', 'Machine Learning', 'Data Science'],
    applyEmail: 'careers@analyticscorp.com',
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    experience: { min: 0, max: 1 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'job',
    title: 'Product Manager',
    company: 'StartupCo',
    location: 'Delhi',
    mode: 'on-site',
    description: 'Lead product development for our fintech platform. Looking for someone with B2B product experience.',
    requirements: ['3+ years product management', 'Fintech experience', 'Stakeholder management'],
    skillsRequired: ['Product Management', 'Strategic Planning', 'Leadership'],
    applyUrl: 'https://startupco.com/jobs/pm',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 1500000, max: 2500000 },
    experience: { min: 3, max: 6 },
    status: 'active'
  },
  {
    type: 'volunteer',
    title: 'Mentorship Program Volunteer',
    company: 'University Alumni Association',
    location: 'Various',
    mode: 'remote',
    description: 'Help guide current students and recent graduates in their career journey as part of our mentorship program.',
    requirements: ['3+ years industry experience', 'Passion for mentoring', 'Good communication skills'],
    skillsRequired: ['Mentorship', 'Leadership', 'Communication'],
    applyEmail: 'mentorship@university.edu',
    status: 'active',
    isVerified: true
  },
  {
    type: 'job',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Hyderabad',
    mode: 'hybrid',
    description: 'Join our DevOps team to build and maintain scalable cloud infrastructure for our enterprise clients.',
    requirements: ['AWS/Azure experience', 'Docker/Kubernetes', 'CI/CD pipelines'],
    skillsRequired: ['DevOps', 'Cloud Computing', 'Docker', 'Kubernetes'],
    applyUrl: 'https://cloudtech.com/careers/devops',
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 1000000, max: 1600000 },
    experience: { min: 2, max: 5 },
    status: 'active'
  }
];

const sampleCampaigns = [
  {
    name: 'New Library Construction Fund',
    description: 'Help us build a state-of-the-art library facility that will serve thousands of current and future students.',
    goalAmount: 5000000,
    currentAmount: 1200000,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Started 60 days ago
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // Ends in 120 days
    category: 'infrastructure',
    status: 'active',
    donorCount: 45,
    isPublic: true,
    allowAnonymous: true,
    minimumAmount: 1000
  },
  {
    name: 'Student Scholarship Program',
    description: 'Support deserving students from economically disadvantaged backgrounds to pursue their dreams in engineering and technology.',
    goalAmount: 2000000,
    currentAmount: 750000,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Started 30 days ago
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Ends in 90 days
    category: 'scholarship',
    status: 'active',
    donorCount: 28,
    isPublic: true,
    allowAnonymous: true,
    minimumAmount: 500
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Opportunity.deleteMany({}),
      Campaign.deleteMany({}),
      Donation.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@university.edu',
      password: 'admin123',
      role: 'admin',
      graduationYear: 2010,
      degree: 'B.Tech',
      department: 'Computer Science',
      verificationStatus: 'approved',
      isEmailVerified: true
    });
    await admin.save();
    console.log('Created admin user');

    // Create alumni users
    const alumniData = [];
    for (let i = 0; i < 25; i++) {
      alumniData.push(generateRandomAlumni(i));
    }

    const alumni = await User.insertMany(alumniData);
    console.log(`Created ${alumni.length} alumni users`);

    // Create campaigns first (needed for donations)
    const campaignData = sampleCampaigns.map(campaign => ({
      ...campaign,
      createdBy: admin._id
    }));
    const campaigns = await Campaign.insertMany(campaignData);
    console.log(`Created ${campaigns.length} campaigns`);

    // Create events
    const eventData = sampleEvents.map(event => ({
      ...event,
      createdBy: admin._id,
      rsvpAlumniIds: alumni.slice(0, Math.floor(Math.random() * 15) + 5).map(a => a._id)
    }));
    const events = await Event.insertMany(eventData);
    console.log(`Created ${events.length} events`);

    // Create opportunities
    const opportunityData = sampleOpportunities.map((opp, index) => ({
      ...opp,
      postedBy: index < 3 ? admin._id : alumni[Math.floor(Math.random() * alumni.length)]._id
    }));
    const opportunities = await Opportunity.insertMany(opportunityData);
    console.log(`Created ${opportunities.length} opportunities`);

    // Create sample donations
    const donations = [];
    for (let i = 0; i < 20; i++) {
      const randomAlumni = alumni[Math.floor(Math.random() * alumni.length)];
      const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
      const amount = [1000, 2000, 5000, 10000, 25000, 50000][Math.floor(Math.random() * 6)];
      
      donations.push({
        alumniId: randomAlumni._id,
        campaignId: randomCampaign._id,
        amount,
        paymentMethod: ['card', 'upi', 'netbanking'][Math.floor(Math.random() * 3)],
        paymentStatus: 'completed',
        donationType: 'one-time',
        transactionId: `TXN_${Date.now() + i}_${Math.random().toString(36).substr(2, 9)}`,
        donatedAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        processedAt: new Date(Date.now() - Math.floor(Math.random() * 89) * 24 * 60 * 60 * 1000),
        isAnonymous: Math.random() > 0.7
      });
    }

    await Donation.insertMany(donations);
    console.log(`Created ${donations.length} donations`);

    // Update campaign totals
    for (const campaign of campaigns) {
      const campaignDonations = donations.filter(d => d.campaignId.toString() === campaign._id.toString());
      campaign.currentAmount = campaignDonations.reduce((sum, d) => sum + d.amount, 0);
      campaign.donorCount = campaignDonations.length;
      campaign.averageDonation = campaign.donorCount > 0 ? campaign.currentAmount / campaign.donorCount : 0;
      await campaign.save();
    }
    console.log('Updated campaign totals');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`✓ Admin User: admin@university.edu / admin123`);
    console.log(`✓ Alumni: ${alumni.length} users (alumni1@university.edu to alumni${alumni.length}@university.edu / password123)`);
    console.log(`✓ Events: ${events.length} events`);
    console.log(`✓ Opportunities: ${opportunities.length} opportunities`);
    console.log(`✓ Campaigns: ${campaigns.length} campaigns`);
    console.log(`✓ Donations: ${donations.length} donations`);
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@university.edu / admin123');
    console.log('Alumni: alumni1@university.edu / password123 (and alumni2, alumni3, etc.)');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();