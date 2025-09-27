import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  GraduationCap, 
  User,
  Heart,
  ExternalLink
} from 'lucide-react';
import { alumniService } from '../lib/api/alumniService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface AlumniFilters {
  search: string;
  graduationYear: string;
  department: string;
  company: string;
  location: string;
  isMentor: string;
  page: number;
}

const AlumniDirectory = () => {
  const [filters, setFilters] = useState<AlumniFilters>({
    search: '',
    graduationYear: '',
    department: '',
    company: '',
    location: '',
    isMentor: '',
    page: 1,
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['alumni', filters],
    queryFn: () => alumniService.getAlumni({
      ...filters,
      graduationYear: filters.graduationYear ? parseInt(filters.graduationYear) : undefined,
      isMentor: filters.isMentor === 'true' ? true : filters.isMentor === 'false' ? false : undefined,
    }),
    keepPreviousData: true,
  });

  const handleFilterChange = (key: keyof AlumniFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      graduationYear: '',
      department: '',
      company: '',
      location: '',
      isMentor: '',
      page: 1,
    });
  };

  const departments = [
    'Computer Science',
    'Electrical Engineering', 
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics & Communication',
    'Information Technology',
    'Chemical Engineering',
    'Aerospace Engineering',
    'Biotechnology',
    'MBA'
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Unable to load alumni directory</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Alumni Directory</h1>
          <p className="text-gray-600 text-lg">
            Connect with {data?.pagination?.totalItems || 0} alumni worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <Card.Content className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, company, skills, or title..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  leftIcon={<Filter className="w-4 h-4" />}
                >
                  Filters
                </Button>
                {(filters.graduationYear || filters.department || filters.company || filters.location || filters.isMentor) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Year
                    </label>
                    <select
                      value={filters.graduationYear}
                      onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Years</option>
                      {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      placeholder="Filter by company"
                      value={filters.company}
                      onChange={(e) => handleFilterChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Filter by location"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mentors
                    </label>
                    <select
                      value={filters.isMentor}
                      onChange={(e) => handleFilterChange('isMentor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Alumni</option>
                      <option value="true">Mentors Only</option>
                      <option value="false">Non-Mentors</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : data?.data?.length === 0 ? (
          <Card>
            <Card.Content className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </Card.Content>
          </Card>
        ) : (
          <>
            {/* Alumni Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data?.data?.map((alumni: any) => (
                <Card key={alumni._id} hover className="h-full">
                  <Card.Content className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          {alumni.profilePicture ? (
                            <img
                              src={alumni.profilePicture}
                              alt={alumni.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xl font-bold">
                              {alumni.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                          {alumni.name}
                        </h3>
                        {alumni.title && (
                          <p className="text-gray-600 text-sm truncate mb-1">
                            {alumni.title}
                          </p>
                        )}
                        {alumni.company && (
                          <div className="flex items-center text-gray-500 text-sm mb-1">
                            <Building className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{alumni.company}</span>
                          </div>
                        )}
                        {alumni.location && (
                          <div className="flex items-center text-gray-500 text-sm">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{alumni.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{alumni.department} • Class of {alumni.graduationYear}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {alumni.skills && alumni.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {alumni.skills.slice(0, 3).map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {alumni.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{alumni.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Mentor Badge */}
                    {alumni.isMentor && (
                      <div className="flex items-center text-green-600 text-sm mb-4">
                        <Heart className="w-4 h-4 mr-1" />
                        <span className="font-medium">Available for Mentorship</span>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Link to={`/alumni/${alumni._id}`} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      {alumni.linkedinUrl && (
                        <a
                          href={alumni.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0"
                        >
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="ghost"
                  disabled={data.pagination.currentPage === 1}
                  onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={data.pagination.currentPage === page ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {data.pagination.totalPages > 5 && (
                    <>
                      <span className="text-gray-500">...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(data.pagination.totalPages)}
                      >
                        {data.pagination.totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  disabled={data.pagination.currentPage === data.pagination.totalPages}
                  onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;