import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../lib/contexts/AuthContext';
import { opportunityService } from '../lib/api/opportunityService';
import { Briefcase, Search, MapPin, DollarSign, Clock, ExternalLink, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

interface Opportunity {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'job' | 'internship' | 'volunteer' | 'project';
  mode: 'remote' | 'on-site' | 'hybrid';
  description: string;
  salaryRange?: {
    min?: number;
    max?: number;
    currency: string;
  };
  experience?: {
    min?: number;
    max?: number;
  };
  skillsRequired: string[];
  applicationDeadline?: string;
  applyUrl?: string;
  applyEmail?: string;
  postedBy: {
    name: string;
    company: string;
  };
  status: string;
  isVerified: boolean;
}

interface OpportunityFilters {
  search: string;
  type: string;
  mode: string;
  company: string;
  page: number;
}

const Opportunities = () => {
  const { user, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState<OpportunityFilters>({
    search: '',
    type: '',
    mode: '',
    company: '',
    page: 1,
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => opportunityService.getOpportunities(filters),
    keepPreviousData: true,
    enabled: !!user, // Only fetch data if user is authenticated
  });

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
            You need to be signed in to view career opportunities. Please log in to access this content.
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

  const handleFilterChange = (key: keyof OpportunityFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      mode: '',
      company: '',
      page: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-500 text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Opportunities...</h2>
          <p className="text-gray-600">Please wait while we fetch the latest opportunities</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Unable to load opportunities</p>
          <p className="text-sm text-gray-500 mt-2">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  const opportunities = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Opportunities</h1>
              <p className="text-gray-600">Discover exciting job opportunities, internships, and projects from our alumni network</p>
            </div>
            {user && user.role === 'alumni' && (
              <Button
                variant="primary"
                leftIcon={<Briefcase className="w-4 h-4" />}
                onClick={() => {/* TODO: Open post opportunity modal */}}
              >
                Post Opportunity
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search opportunities..."
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

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="project">Project</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="Filter by company"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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

        <div className="mb-6">
          <p className="text-gray-600">Found {opportunities.length} opportunities</p>
        </div>

        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity: Opportunity) => (
              <div key={opportunity._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
                      <p className="text-gray-600 font-medium">{opportunity.company}</p>
                      <p className="text-sm text-gray-500">{opportunity.location}</p>
                    </div>
                    {opportunity.isVerified && (
                      <div className="flex-shrink-0 ml-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Verified
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {opportunity.mode === 'on-site' ? 'On-site' : opportunity.mode.charAt(0).toUpperCase() + opportunity.mode.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{opportunity.description}</p>

                  <div className="space-y-2 mb-4">
                    {opportunity.salaryRange && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-16">Salary:</span>
                        <span className="font-medium text-green-600">
                          {opportunity.salaryRange.min && opportunity.salaryRange.max 
                            ? `${opportunity.salaryRange.min/100000}L - ${opportunity.salaryRange.max/100000}L ${opportunity.salaryRange.currency}`
                            : 'Not specified'
                          }
                        </span>
                      </div>
                    )}
                    {opportunity.experience && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-16">Exp:</span>
                        <span className="font-medium">
                          {opportunity.experience.min && opportunity.experience.max 
                            ? `${opportunity.experience.min}-${opportunity.experience.max} years`
                            : `${opportunity.experience.min}+ years`
                          }
                        </span>
                      </div>
                    )}
                    {opportunity.applicationDeadline && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-16">Deadline:</span>
                        <span className="font-medium">{new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {opportunity.skillsRequired.slice(0, 3).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {skill}
                        </span>
                      ))}
                      {opportunity.skillsRequired.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          +{opportunity.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Posted by {opportunity.postedBy.name} from {opportunity.postedBy.company}
                  </div>
                </div>

                {/* Fixed bottom section with buttons */}
                <div className="px-6 pb-6">
                  <div className="flex gap-2">
                    {opportunity.applyUrl && (
                      <a
                        href={opportunity.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Apply Now
                      </a>
                    )}
                    {opportunity.applyEmail && (
                      <a
                        href={`mailto:${opportunity.applyEmail}`}
                        className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No opportunities found</h3>
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

export default Opportunities;