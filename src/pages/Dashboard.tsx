import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../lib/contexts/AuthContext';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Building,
  GraduationCap,
  Mail,
  Phone,
  ExternalLink,
  Video,
  Monitor,
  Globe,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  Award,
  Heart
} from 'lucide-react';
import { eventService } from '../lib/api/eventService';
import { alumniService } from '../lib/api/alumniService';
import { opportunityService } from '../lib/api/opportunityService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  // Fetch user's registered events
  const { data: userEventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['user-events'],
    queryFn: eventService.getUserEvents,
    enabled: !!user,
  });

  // Fetch recent opportunities
  const { data: opportunitiesData } = useQuery({
    queryKey: ['recent-opportunities'],
    queryFn: () => opportunityService.getOpportunities({ page: 1, limit: 5 }),
    enabled: !!user,
  });

  // Fetch recent alumni
  const { data: alumniData } = useQuery({
    queryKey: ['recent-alumni'],
    queryFn: () => alumniService.getAlumni({ page: 1, limit: 5 }),
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-500 text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your dashboard.
          </p>
          <div className="space-y-3">
            <a
              href="/login"
              className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium block"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  const registeredEvents = userEventsData?.data?.registered || [];
  const waitlistedEvents = userEventsData?.data?.waitlisted || [];
  const recentOpportunities = opportunitiesData?.data || [];
  const recentAlumni = alumniData?.data || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online':
        return <Video className="w-4 h-4" />;
      case 'offline':
        return <MapPin className="w-4 h-4" />;
      case 'hybrid':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      networking: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      seminar: 'bg-purple-100 text-purple-800',
      reunion: 'bg-orange-100 text-orange-800',
      career: 'bg-indigo-100 text-indigo-800',
      social: 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening in your alumni network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <Card>
              <Card.Content className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'alumni' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'alumni' ? 'Alumni' : 'Student'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {user.graduationYear && (
                    <div className="flex items-center text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-3" />
                      <span>Class of {user.graduationYear}</span>
                    </div>
                  )}
                  {user.department && (
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-3" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-3" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.company && (
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-3" />
                      <span>{user.company}</span>
                    </div>
                  )}
                </div>

                {user.isMentor && (
                  <div className="mt-4 flex items-center text-blue-600">
                    <Award className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Mentor Available</span>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Quick Stats */}
            <Card>
              <Card.Content className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="text-gray-600">Events Registered</span>
                    </div>
                    <span className="font-semibold text-gray-900">{registeredEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-500 mr-3" />
                      <span className="text-gray-600">On Waitlist</span>
                    </div>
                    <span className="font-semibold text-gray-900">{waitlistedEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-600">Opportunities</span>
                    </div>
                    <span className="font-semibold text-gray-900">{recentOpportunities.length}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Card>
              <Card.Content className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/events" className="block">
                    <Button variant="primary" size="sm" className="w-full" leftIcon={<Calendar className="w-4 h-4" />}>
                      Browse Events
                    </Button>
                  </Link>
                  <Link to="/opportunities" className="block">
                    <Button variant="ghost" size="sm" className="w-full" leftIcon={<Briefcase className="w-4 h-4" />}>
                      View Opportunities
                    </Button>
                  </Link>
                  <Link to="/alumni" className="block">
                    <Button variant="ghost" size="sm" className="w-full" leftIcon={<Users className="w-4 h-4" />}>
                      Alumni Directory
                    </Button>
                  </Link>
                  <Link to="/mentorship" className="block">
                    <Button variant="ghost" size="sm" className="w-full" leftIcon={<Heart className="w-4 h-4" />}>
                      Mentorship
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Right Column - Events & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Events */}
            <Card>
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Events</h3>
                  <Link to="/events">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>

                {eventsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : registeredEvents.length === 0 && waitlistedEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't registered for any events yet</p>
                    <Link to="/events">
                      <Button variant="primary">Browse Events</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Registered Events */}
                    {registeredEvents.map((event: any) => (
                      <div key={event._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                {event.category}
                              </span>
                              <div className="flex items-center text-gray-500 text-sm">
                                {getModeIcon(event.mode)}
                                <span className="ml-1 capitalize">{event.mode}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-green-600 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Registered
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(event.startDate)}</span>
                          {event.venue && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{event.venue}</span>
                            </>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                      </div>
                    ))}

                    {/* Waitlisted Events */}
                    {waitlistedEvents.map((event: any) => (
                      <div key={event._id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                {event.category}
                              </span>
                              <div className="flex items-center text-gray-500 text-sm">
                                {getModeIcon(event.mode)}
                                <span className="ml-1 capitalize">{event.mode}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-yellow-600 text-sm font-medium">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Waitlisted
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(event.startDate)}</span>
                          {event.venue && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{event.venue}</span>
                            </>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Recent Opportunities */}
            <Card>
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Opportunities</h3>
                  <Link to="/opportunities">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>

                {recentOpportunities.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No opportunities available at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOpportunities.slice(0, 3).map((opportunity: any) => (
                      <div key={opportunity._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{opportunity.title}</h4>
                            <p className="text-gray-600 text-sm">{opportunity.company}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            opportunity.type === 'job' ? 'bg-blue-100 text-blue-800' :
                            opportunity.type === 'internship' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {opportunity.type}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{opportunity.location}</span>
                          {opportunity.salaryRange && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="font-medium text-green-600">
                                {opportunity.salaryRange.min && opportunity.salaryRange.max
                                  ? `${opportunity.salaryRange.min/100000}L - ${opportunity.salaryRange.max/100000}L`
                                  : 'Competitive'
                                }
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
