import React, { useState } from 'react';
import { useAuth } from '../lib/contexts/AuthContext';
import { Users } from 'lucide-react';
import Button from '../components/ui/Button';

interface MentorshipProgram {
  _id: string;
  title: string;
  description: string;
  category: 'career' | 'technical' | 'leadership' | 'entrepreneurship' | 'personal';
  duration: string;
  commitment: string;
  mode: 'remote' | 'on-site' | 'hybrid';
  targetAudience: string;
  mentorCount: number;
  menteeCount: number;
  skillsRequired: string[];
  benefits: string[];
  applicationDeadline?: string;
  startDate: string;
  isActive: boolean;
  createdBy: {
    name: string;
    company: string;
  };
}

interface MentorshipFilters {
  search: string;
  category: string;
  mode: string;
  commitment: string;
}

const Mentorship = () => {
  const { user, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState<MentorshipFilters>({
    search: '',
    category: '',
    mode: '',
    commitment: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-500 text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we verify your authentication</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view mentorship programs. Please log in to access this content.
          </p>
          <div className="space-y-3">
            <a
              href="/login"
              className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium block"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium block"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Sample mentorship programs data
  const mentorshipPrograms: MentorshipProgram[] = [
    {
      _id: '1',
      title: 'Software Engineering Career Guidance',
      description: 'Get personalized guidance from senior software engineers working at top tech companies. Perfect for recent graduates and career switchers.',
      category: 'career',
      duration: '6 months',
      commitment: '2 hours/week',
      mode: 'remote',
      targetAudience: 'Recent graduates, career switchers',
      mentorCount: 15,
      menteeCount: 45,
      skillsRequired: ['Programming', 'Problem Solving', 'Communication'],
      benefits: ['1-on-1 mentoring', 'Resume review', 'Interview prep', 'Career planning'],
      applicationDeadline: '2025-10-15',
      startDate: '2025-11-01',
      isActive: true,
      createdBy: { name: 'Sarah Johnson', company: 'Google' }
    },
    {
      _id: '2',
      title: 'Data Science & Machine Learning',
      description: 'Learn from industry experts in data science, machine learning, and AI. Hands-on projects and real-world case studies included.',
      category: 'technical',
      duration: '4 months',
      commitment: '3 hours/week',
      mode: 'hybrid',
      targetAudience: 'Students, professionals with 1-3 years experience',
      mentorCount: 8,
      menteeCount: 24,
      skillsRequired: ['Python', 'Statistics', 'Machine Learning', 'SQL'],
      benefits: ['Project guidance', 'Industry insights', 'Portfolio building', 'Networking'],
      applicationDeadline: '2025-10-20',
      startDate: '2025-11-05',
      isActive: true,
      createdBy: { name: 'Dr. Michael Chen', company: 'Microsoft' }
    },
    {
      _id: '3',
      title: 'Leadership Development Program',
      description: 'Develop leadership skills with experienced managers and executives. Focus on team management, strategic thinking, and communication.',
      category: 'leadership',
      duration: '8 months',
      commitment: '2 hours/week',
      mode: 'remote',
      targetAudience: 'Mid-level professionals, aspiring managers',
      mentorCount: 12,
      menteeCount: 36,
      skillsRequired: ['Team Management', 'Strategic Thinking', 'Communication', 'Decision Making'],
      benefits: ['Leadership coaching', 'Case studies', 'Peer learning', 'Executive insights'],
      applicationDeadline: '2025-10-25',
      startDate: '2025-11-10',
      isActive: true,
      createdBy: { name: 'Lisa Rodriguez', company: 'Amazon' }
    },
    {
      _id: '4',
      title: 'Startup & Entrepreneurship',
      description: 'Learn the fundamentals of starting and scaling a business from successful entrepreneurs and investors.',
      category: 'entrepreneurship',
      duration: '6 months',
      commitment: '3 hours/week',
      mode: 'hybrid',
      targetAudience: 'Aspiring entrepreneurs, early-stage founders',
      mentorCount: 6,
      menteeCount: 18,
      skillsRequired: ['Business Strategy', 'Marketing', 'Finance', 'Innovation'],
      benefits: ['Business plan review', 'Investor connections', 'Market research', 'Pitch training'],
      applicationDeadline: '2025-10-30',
      startDate: '2025-11-15',
      isActive: true,
      createdBy: { name: 'Alex Kumar', company: 'TechVentures' }
    },
    {
      _id: '5',
      title: 'Product Management Essentials',
      description: 'Master product management from ideation to launch with experienced PMs from leading tech companies.',
      category: 'career',
      duration: '5 months',
      commitment: '2.5 hours/week',
      mode: 'remote',
      targetAudience: 'Product managers, aspiring PMs',
      mentorCount: 10,
      menteeCount: 30,
      skillsRequired: ['Product Strategy', 'User Research', 'Analytics', 'Cross-functional Collaboration'],
      benefits: ['Product roadmap guidance', 'User research methods', 'Stakeholder management', 'Career advancement'],
      applicationDeadline: '2025-11-05',
      startDate: '2025-11-20',
      isActive: true,
      createdBy: { name: 'Emily Davis', company: 'Meta' }
    },
    {
      _id: '6',
      title: 'Cybersecurity & Information Security',
      description: 'Learn cybersecurity best practices and threat mitigation from security experts and ethical hackers.',
      category: 'technical',
      duration: '4 months',
      commitment: '3 hours/week',
      mode: 'remote',
      targetAudience: 'IT professionals, security enthusiasts',
      mentorCount: 7,
      menteeCount: 21,
      skillsRequired: ['Network Security', 'Penetration Testing', 'Risk Assessment', 'Incident Response'],
      benefits: ['Hands-on labs', 'Certification guidance', 'Industry tools', 'Career transition support'],
      applicationDeadline: '2025-11-10',
      startDate: '2025-11-25',
      isActive: true,
      createdBy: { name: 'James Wilson', company: 'Cisco' }
    }
  ];

  const handleFilterChange = (key: keyof MentorshipFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      mode: '',
      commitment: '',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'career': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-green-100 text-green-800';
      case 'leadership': return 'bg-purple-100 text-purple-800';
      case 'entrepreneurship': return 'bg-orange-100 text-orange-800';
      case 'personal': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'remote': return 'bg-green-100 text-green-800';
      case 'on-site': return 'bg-blue-100 text-blue-800';
      case 'hybrid': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter programs based on current filters
  const filteredPrograms = mentorshipPrograms.filter(program => {
    const matchesSearch = !filters.search || 
      program.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      program.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || program.category === filters.category;
    const matchesMode = !filters.mode || program.mode === filters.mode;
    const matchesCommitment = !filters.commitment || program.commitment === filters.commitment;

    return matchesSearch && matchesCategory && matchesMode && matchesCommitment;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Programs</h1>
              <p className="text-gray-600">Connect with experienced professionals and accelerate your career growth through our mentorship programs</p>
            </div>
            {user && user.role === 'alumni' && (
              <Button
                variant="primary"
                leftIcon={<Users className="w-4 h-4" />}
                onClick={() => {/* TODO: Open become mentor modal */}}
              >
                Become a Mentor
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search mentorship programs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="career">Career</option>
                  <option value="technical">Technical</option>
                  <option value="leadership">Leadership</option>
                  <option value="entrepreneurship">Entrepreneurship</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                <select
                  value={filters.mode}
                  onChange={(e) => handleFilterChange('mode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Modes</option>
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commitment</label>
                <select
                  value={filters.commitment}
                  onChange={(e) => handleFilterChange('commitment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Commitments</option>
                  <option value="2 hours/week">2 hours/week</option>
                  <option value="2.5 hours/week">2.5 hours/week</option>
                  <option value="3 hours/week">3 hours/week</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">Found {filteredPrograms.length} mentorship programs</p>
        </div>

        {/* Mentorship Programs Grid */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program: MentorshipProgram) => (
              <div key={program._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{program.title}</h3>
                      <p className="text-sm text-gray-500">{program.targetAudience}</p>
                    </div>
                    {program.isActive && (
                      <div className="flex-shrink-0 ml-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Active
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(program.category)}`}>
                      {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModeColor(program.mode)}`}>
                      {program.mode === 'on-site' ? 'On-site' : program.mode.charAt(0).toUpperCase() + program.mode.slice(1)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{program.description}</p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Duration:</span>
                      <span className="font-medium">{program.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Commitment:</span>
                      <span className="font-medium">{program.commitment}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Mentors:</span>
                      <span className="font-medium">{program.mentorCount}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Mentees:</span>
                      <span className="font-medium">{program.menteeCount}</span>
                    </div>
                    {program.applicationDeadline && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-20">Deadline:</span>
                        <span className="font-medium">{new Date(program.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Required Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {program.skillsRequired.slice(0, 3).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {skill}
                        </span>
                      ))}
                      {program.skillsRequired.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          +{program.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Benefits:</div>
                    <div className="flex flex-wrap gap-1">
                      {program.benefits.slice(0, 2).map((benefit, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {benefit}
                        </span>
                      ))}
                      {program.benefits.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600">
                          +{program.benefits.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Created By */}
                  <div className="text-xs text-gray-500 mb-4">
                    Created by {program.createdBy.name} from {program.createdBy.company}
                  </div>
                </div>

                {/* Fixed bottom section with buttons */}
                <div className="px-6 pb-6">
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Apply as Mentee
                    </button>
                    {user && user.role === 'alumni' && (
                      <button className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        Apply as Mentor
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No mentorship programs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentorship;
