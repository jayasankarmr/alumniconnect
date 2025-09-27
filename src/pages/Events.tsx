import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../lib/contexts/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Filter,
  Search,
  ExternalLink,
  Video,
  Monitor,
  Globe,
  UserPlus,
  UserMinus,
  CheckCircle
} from 'lucide-react';
import { eventService } from '../lib/api/eventService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import CreateEventModal from '../components/forms/CreateEventModal';
import toast from 'react-hot-toast';

interface EventFilters {
  search: string;
  category: string;
  mode: string;
  upcoming: boolean;
  page: number;
}

const Events = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: '',
    mode: '',
    upcoming: true,
    page: 1,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    event: null as any,
    action: '' as 'rsvp' | 'cancel'
  });
  const [createEventModal, setCreateEventModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventService.getEvents({
      ...filters,
      upcoming: filters.upcoming ? true : undefined,
    }),
    keepPreviousData: true,
    enabled: !!user, // Only fetch data if user is authenticated
  });

  // RSVP mutation
  const rsvpMutation = useMutation({
    mutationFn: (eventId: string) => eventService.rsvpEvent(eventId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
      toast.success(response.waitlisted ? 'Added to waitlist!' : 'Successfully registered for event!');
      setConfirmationModal({ isOpen: false, event: null, action: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register for event');
    }
  });

  // Cancel RSVP mutation
  const cancelRsvpMutation = useMutation({
    mutationFn: (eventId: string) => eventService.cancelRsvp(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
      toast.success('Registration cancelled successfully');
      setConfirmationModal({ isOpen: false, event: null, action: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    }
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
            You need to be signed in to view events. Please log in to access this content.
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

  const handleFilterChange = (key: keyof EventFilters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      mode: '',
      upcoming: true,
      page: 1,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  // Check if user is registered for an event
  const isUserRegistered = (event: any) => {
    if (!user || !event.rsvpAlumniIds) return false;
    return event.rsvpAlumniIds.some((id: any) => id.toString() === user._id);
  };

  // Check if user is on waitlist
  const isUserOnWaitlist = (event: any) => {
    if (!user || !event.waitlistIds) return false;
    return event.waitlistIds.some((id: any) => id.toString() === user._id);
  };

  // Handle RSVP confirmation
  const handleRsvpConfirm = () => {
    if (confirmationModal.action === 'rsvp') {
      rsvpMutation.mutate(confirmationModal.event._id);
    } else if (confirmationModal.action === 'cancel') {
      cancelRsvpMutation.mutate(confirmationModal.event._id);
    }
  };

  // Open confirmation modal
  const openConfirmationModal = (event: any, action: 'rsvp' | 'cancel') => {
    setConfirmationModal({
      isOpen: true,
      event,
      action
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Unable to load events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Events</h1>
              <p className="text-gray-600 text-lg">
                Discover {data?.pagination?.totalItems || 0} upcoming and past events
              </p>
            </div>
            {user && user.role === 'alumni' && (
              <Button
                variant="primary"
                leftIcon={<Calendar className="w-4 h-4" />}
                onClick={() => setCreateEventModal(true)}
              >
                Create Event
              </Button>
            )}
          </div>
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
                  placeholder="Search events by title, description, or tags..."
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
                {(filters.category || filters.mode || !filters.upcoming) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      <option value="networking">Networking</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="reunion">Reunion</option>
                      <option value="career">Career</option>
                      <option value="social">Social</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode
                    </label>
                    <select
                      value={filters.mode}
                      onChange={(e) => handleFilterChange('mode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Modes</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <select
                      value={filters.upcoming ? 'upcoming' : 'all'}
                      onChange={(e) => handleFilterChange('upcoming', e.target.value === 'upcoming')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="upcoming">Upcoming Only</option>
                      <option value="all">All Events</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Events */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : data?.data?.length === 0 ? (
          <Card>
            <Card.Content className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </Card.Content>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((event: any) => (
              <Card key={event._id} hover className="h-full">
                <Card.Content className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {event.title}
                        </h3>
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
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      
                      {event.venue && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      )}

                      {event.virtualLink && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Virtual Link Available</span>
                        </div>
                      )}

                      {event.maxSeats && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>
                            {event.rsvpAlumniIds?.length || 0} / {event.maxSeats} attendees
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {event.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{event.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Registration Status */}
                    {isUserRegistered(event) && (
                      <div className="flex items-center text-green-600 text-sm font-medium mb-3">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        You are registered for this event
                      </div>
                    )}
                    {isUserOnWaitlist(event) && (
                      <div className="flex items-center text-yellow-600 text-sm font-medium mb-3">
                        <Clock className="w-4 h-4 mr-2" />
                        You are on the waitlist
                      </div>
                    )}
                  </div>

                  {/* Action buttons at the bottom */}
                  <div className="flex space-x-3 mt-auto">
                    <Link to={`/events/${event._id}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        View Details
                      </Button>
            </Link>
                    
                    {/* Registration/Cancellation Button */}
                    {new Date(event.startDate) > new Date() && (
                      <>
                        {isUserRegistered(event) || isUserOnWaitlist(event) ? (
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => openConfirmationModal(event, 'cancel')}
                            leftIcon={<UserMinus className="w-4 h-4" />}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => openConfirmationModal(event, 'rsvp')}
                            leftIcon={<UserPlus className="w-4 h-4" />}
                          >
                            Register
                          </Button>
                        )}
                      </>
                    )}
                    
                    {event.virtualLink && (
                      <a
                        href={event.virtualLink}
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
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, event: null, action: '' })}
          onConfirm={handleRsvpConfirm}
          title={confirmationModal.action === 'rsvp' ? 'Register for Event' : 'Cancel Registration'}
          message={
            confirmationModal.action === 'rsvp'
              ? `Are you sure you want to register for "${confirmationModal.event?.title}"?`
              : `Are you sure you want to cancel your registration for "${confirmationModal.event?.title}"?`
          }
          type={confirmationModal.action === 'rsvp' ? 'success' : 'warning'}
          confirmText={confirmationModal.action === 'rsvp' ? 'Register' : 'Cancel Registration'}
          cancelText="Keep Registration"
          isLoading={rsvpMutation.isPending || cancelRsvpMutation.isPending}
        />

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={createEventModal}
          onClose={() => setCreateEventModal(false)}
          onSuccess={() => {
            // Optionally refresh the events list
            queryClient.invalidateQueries({ queryKey: ['events'] });
          }}
        />
      </div>
    </div>
  );
};

export default Events;
