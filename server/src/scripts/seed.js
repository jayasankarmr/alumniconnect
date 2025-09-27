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

const firstNames = [
  'Aarav', 'Aditi', 'Akshay', 'Ananya', 'Arjun', 'Bhavya', 'Chetan', 'Deepika', 'Gaurav', 'Ishita',
  'Karan', 'Kavya', 'Manish', 'Neha', 'Pooja', 'Rahul', 'Riya', 'Sagar', 'Shreya', 'Vikram',
  'Alex', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Lisa', 'Robert', 'Maria',
  'John', 'Jennifer', 'William', 'Ashley', 'Christopher', 'Amanda', 'Daniel', 'Stephanie', 'Matthew', 'Nicole'
];

const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Verma', 'Jain', 'Malhotra', 'Reddy',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez'
];

const generateRandomAlumni = (index) => {
  const graduationYear = 2015 + Math.floor(Math.random() * 8); // 2015-2022
  const department = departments[Math.floor(Math.random() * departments.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const selectedSkills = skills.slice(0, 3 + Math.floor(Math.random() * 3));
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  
  return {
    name: fullName,
    email: `alumni${index + 1}@university.edu`,
    password: 'password123',
    graduationYear,
    degree: 'B.Tech',
    department,
    rollNo: `${graduationYear}${department.substring(0, 2).toUpperCase()}${String(index + 1).padStart(3, '0')}`,
    phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    location,
    company,
    title: ['Software Engineer', 'Product Manager', 'Data Scientist', 'Senior Developer', 'Team Lead', 'Tech Lead', 'Engineering Manager', 'Solutions Architect'][Math.floor(Math.random() * 8)],
    bio: `Passionate ${department} professional with ${Math.floor(Math.random() * 8) + 1} years of experience in ${company}. Specialized in ${selectedSkills.slice(0, 2).join(' and ')}.`,
    skills: selectedSkills,
    linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${index + 1}`,
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
  },
  {
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to a panel of successful entrepreneurs and investors. Great networking opportunity for aspiring entrepreneurs.',
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
    mode: 'hybrid',
    venue: 'Innovation Center, Room 101',
    virtualLink: 'https://zoom.us/startup-pitch',
    category: 'networking',
    maxSeats: 150,
    tags: ['startup', 'entrepreneurship', 'pitching', 'networking'],
    status: 'published'
  },
  {
    title: 'Data Science & Machine Learning Workshop',
    description: 'Hands-on workshop covering the latest tools and techniques in data science. Perfect for professionals looking to upskill in AI/ML.',
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 6 hours later
    mode: 'offline',
    venue: 'Computer Science Lab, Building C',
    category: 'workshop',
    maxSeats: 50,
    tags: ['data-science', 'machine-learning', 'python', 'hands-on'],
    status: 'published'
  },
  {
    title: 'Women in Tech Leadership Panel',
    description: 'Inspiring panel discussion featuring successful women leaders in technology. Learn about career growth, leadership challenges, and industry insights.',
    startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    mode: 'online',
    virtualLink: 'https://meet.google.com/women-in-tech',
    category: 'seminar',
    maxSeats: 300,
    tags: ['women-in-tech', 'leadership', 'diversity', 'career'],
    status: 'published'
  },
  {
    title: 'Alumni Sports Day',
    description: 'Fun-filled sports day with various activities including cricket, football, badminton, and more. Family-friendly event with food and entertainment.',
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 hours later
    mode: 'offline',
    venue: 'University Sports Complex',
    category: 'social',
    maxSeats: 200,
    tags: ['sports', 'family', 'fun', 'networking'],
    status: 'published'
  },
  {
    title: 'Blockchain & Cryptocurrency Seminar',
    description: 'Comprehensive overview of blockchain technology, cryptocurrency trends, and their impact on various industries. Expert speakers from fintech companies.',
    startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
    mode: 'hybrid',
    venue: 'Business School Auditorium',
    virtualLink: 'https://zoom.us/blockchain-seminar',
    category: 'seminar',
    maxSeats: 100,
    tags: ['blockchain', 'cryptocurrency', 'fintech', 'technology'],
    status: 'published'
  },
  {
    title: 'Mentorship Program Launch',
    description: 'Official launch of our alumni mentorship program. Connect with mentors, learn about the program structure, and sign up to be a mentor or mentee.',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    mode: 'online',
    virtualLink: 'https://zoom.us/mentorship-launch',
    category: 'networking',
    maxSeats: 500,
    tags: ['mentorship', 'networking', 'career-development'],
    status: 'published'
  },
  {
    title: 'Industry 4.0 & Smart Manufacturing',
    description: 'Explore the future of manufacturing with IoT, AI, and automation. Presentations from industry leaders and hands-on demonstrations.',
    startDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000), // 50 days from now
    endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 5 hours later
    mode: 'offline',
    venue: 'Mechanical Engineering Department',
    category: 'workshop',
    maxSeats: 80,
    tags: ['manufacturing', 'IoT', 'automation', 'industry-4.0'],
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
    description: 'We are looking for a senior software engineer with 4+ years of experience in full-stack development. Join our dynamic team building cutting-edge web applications.',
    requirements: ['4+ years experience', 'React/Node.js expertise', 'Team leadership skills', 'Agile methodology'],
    skillsRequired: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
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
    description: 'Summer internship opportunity for students/recent graduates interested in data science and machine learning. Work on real-world projects with industry experts.',
    requirements: ['Python programming', 'Statistics background', 'ML fundamentals', 'Strong analytical skills'],
    skillsRequired: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'Statistics'],
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
    description: 'Lead product development for our fintech platform. Looking for someone with B2B product experience and strong analytical skills.',
    requirements: ['3+ years product management', 'Fintech experience', 'Stakeholder management', 'Data-driven decision making'],
    skillsRequired: ['Product Management', 'Strategic Planning', 'Leadership', 'Analytics'],
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
    description: 'Help guide current students and recent graduates in their career journey as part of our mentorship program. Make a difference in someone\'s professional growth.',
    requirements: ['3+ years industry experience', 'Passion for mentoring', 'Good communication skills', 'Willingness to commit time'],
    skillsRequired: ['Mentorship', 'Leadership', 'Communication', 'Career Guidance'],
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
    description: 'Join our DevOps team to build and maintain scalable cloud infrastructure for our enterprise clients. Work with cutting-edge cloud technologies.',
    requirements: ['AWS/Azure experience', 'Docker/Kubernetes', 'CI/CD pipelines', 'Infrastructure as Code'],
    skillsRequired: ['DevOps', 'Cloud Computing', 'Docker', 'Kubernetes', 'Terraform'],
    applyUrl: 'https://cloudtech.com/careers/devops',
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 1000000, max: 1600000 },
    experience: { min: 2, max: 5 },
    status: 'active'
  },
  {
    type: 'job',
    title: 'Full Stack Developer',
    company: 'E-commerce Giant',
    location: 'Bangalore',
    mode: 'hybrid',
    description: 'Join our dynamic team building next-generation e-commerce platforms. Work with cutting-edge technologies and scale to millions of users.',
    requirements: ['3+ years full-stack experience', 'React/Vue.js expertise', 'Database design skills', 'Microservices architecture'],
    skillsRequired: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    applyUrl: 'https://ecommerce-giant.com/careers/fullstack',
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 800000, max: 1500000 },
    experience: { min: 3, max: 6 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'internship',
    title: 'Machine Learning Intern',
    company: 'AI Research Lab',
    location: 'Pune',
    mode: 'hybrid',
    description: 'Work on cutting-edge ML projects including computer vision and NLP. Great learning opportunity for aspiring data scientists.',
    requirements: ['Python programming', 'ML fundamentals', 'Strong mathematical background', 'Research mindset'],
    skillsRequired: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Statistics'],
    applyEmail: 'internships@airesearchlab.com',
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    experience: { min: 0, max: 2 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'job',
    title: 'UX/UI Designer',
    company: 'Design Studio Pro',
    location: 'Mumbai',
    mode: 'remote',
    description: 'Create beautiful and intuitive user experiences for our diverse client portfolio. Work with cross-functional teams and lead design initiatives.',
    requirements: ['3+ years design experience', 'Figma/Adobe XD expertise', 'User research skills', 'Portfolio of work'],
    skillsRequired: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    applyUrl: 'https://designstudiopro.com/careers/ux-designer',
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 600000, max: 1200000 },
    experience: { min: 3, max: 7 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'job',
    title: 'Data Engineer',
    company: 'FinTech Solutions',
    location: 'Chennai',
    mode: 'on-site',
    description: 'Build and maintain data pipelines for our financial analytics platform. Work with big data technologies and ensure data quality.',
    requirements: ['4+ years data engineering', 'Spark/Hadoop experience', 'SQL expertise', 'Financial domain knowledge'],
    skillsRequired: ['Python', 'Apache Spark', 'Hadoop', 'SQL', 'AWS', 'Kafka'],
    applyUrl: 'https://fintechsolutions.com/careers/data-engineer',
    applicationDeadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 1000000, max: 1800000 },
    experience: { min: 4, max: 8 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'internship',
    title: 'Marketing Intern',
    company: 'Digital Marketing Agency',
    location: 'Delhi',
    mode: 'hybrid',
    description: 'Learn digital marketing strategies, social media management, and content creation in a fast-paced environment.',
    requirements: ['Marketing interest', 'Social media knowledge', 'Creative thinking', 'Analytics skills'],
    skillsRequired: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics'],
    applyEmail: 'careers@digitalmarketing.com',
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    experience: { min: 0, max: 1 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'job',
    title: 'Cybersecurity Analyst',
    company: 'SecureTech Inc',
    location: 'Bangalore',
    mode: 'hybrid',
    description: 'Protect our organization from cyber threats. Monitor security systems and respond to incidents in a fast-paced environment.',
    requirements: ['Cybersecurity certification', 'Incident response experience', 'Network security knowledge', 'Analytical mindset'],
    skillsRequired: ['Cybersecurity', 'Network Security', 'Incident Response', 'SIEM', 'Penetration Testing'],
    applyUrl: 'https://securetech.com/careers/cybersecurity',
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 900000, max: 1600000 },
    experience: { min: 2, max: 6 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'volunteer',
    title: 'Career Guidance Volunteer',
    company: 'Alumni Career Services',
    location: 'Various',
    mode: 'remote',
    description: 'Help current students with resume reviews, interview preparation, and career guidance sessions. Share your industry experience.',
    requirements: ['5+ years industry experience', 'HR/Recruitment background preferred', 'Good communication skills', 'Mentoring experience'],
    skillsRequired: ['Career Counseling', 'HR', 'Interview Skills', 'Resume Writing'],
    applyEmail: 'careerservices@university.edu',
    status: 'active',
    isVerified: true
  },
  {
    type: 'job',
    title: 'Mobile App Developer',
    company: 'AppTech Solutions',
    location: 'Hyderabad',
    mode: 'remote',
    description: 'Develop innovative mobile applications for iOS and Android platforms using React Native. Work on cutting-edge mobile technologies.',
    requirements: ['3+ years mobile development', 'React Native expertise', 'App Store experience', 'Cross-platform development'],
    skillsRequired: ['React Native', 'JavaScript', 'iOS', 'Android', 'Mobile Development'],
    applyUrl: 'https://apptech.com/careers/mobile-developer',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 700000, max: 1300000 },
    experience: { min: 3, max: 6 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'internship',
    title: 'Business Analyst Intern',
    company: 'Consulting Firm',
    location: 'Mumbai',
    mode: 'hybrid',
    description: 'Support business analysis projects, data analysis, and client presentations. Great exposure to consulting and business strategy.',
    requirements: ['Business/Management background', 'Analytical skills', 'Presentation skills', 'Excel proficiency'],
    skillsRequired: ['Business Analysis', 'Data Analysis', 'Excel', 'PowerPoint', 'Communication'],
    applyEmail: 'internships@consultingfirm.com',
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    experience: { min: 0, max: 2 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'job',
    title: 'Cloud Solutions Architect',
    company: 'CloudFirst Technologies',
    location: 'Bangalore',
    mode: 'hybrid',
    description: 'Design and implement cloud solutions for enterprise clients. Lead cloud migration projects and architect scalable solutions.',
    requirements: ['5+ years cloud experience', 'AWS/Azure certifications', 'Architecture design skills', 'Enterprise experience'],
    skillsRequired: ['AWS', 'Azure', 'Cloud Architecture', 'DevOps', 'Kubernetes', 'Terraform'],
    applyUrl: 'https://cloudfirst.com/careers/solutions-architect',
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    salaryRange: { min: 1500000, max: 2500000 },
    experience: { min: 5, max: 10 },
    status: 'active',
    isVerified: true
  },
  {
    type: 'project',
    title: 'Open Source Contributor',
    company: 'Tech Community',
    location: 'Remote',
    mode: 'remote',
    description: 'Contribute to open source projects and build your portfolio. Work with the global developer community on meaningful projects.',
    requirements: ['Programming skills', 'Git knowledge', 'Open source interest', 'Community spirit'],
    skillsRequired: ['Programming', 'Git', 'Open Source', 'Collaboration'],
    applyUrl: 'https://github.com/tech-community',
    status: 'active',
    isVerified: true
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

    // Create specific test users
    const studentUser = new User({
      name: 'Test Student',
      email: 'user1@university.edu',
      password: 'user123',
      role: 'student',
      graduationYear: 2025,
      degree: 'B.Tech',
      department: 'Computer Science',
      verificationStatus: 'approved',
      isEmailVerified: true,
      location: 'Bangalore',
      skills: ['JavaScript', 'React', 'Node.js'],
      bio: 'Current student passionate about web development and technology.'
    });
    await studentUser.save();
    console.log('Created test student user');

    const alumniUser = new User({
      name: 'Test Alumni',
      email: 'alumni.test@university.edu',
      password: 'alumni123',
      role: 'alumni',
      graduationYear: 2020,
      degree: 'B.Tech',
      department: 'Computer Science',
      verificationStatus: 'approved',
      isEmailVerified: true,
      location: 'Mumbai',
      company: 'Google',
      title: 'Software Engineer',
      skills: ['Python', 'Machine Learning', 'Cloud Computing'],
      bio: 'Experienced software engineer working at Google. Passionate about mentoring students and sharing knowledge.',
      isMentor: true
    });
    await alumniUser.save();
    console.log('Created test alumni user');

    // Create alumni users
    const alumniData = [];
    for (let i = 0; i < 50; i++) {
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