import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  UserCheck, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PendingRequest {
  _id: string;
  alumniId: {
    _id: string;
    name: string;
    email: string;
    graduationYear: number;
    department: string;
  };
  type: 'mentorship' | 'event' | 'opportunity';
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: string;
  venue?: string;
  category: string;
  status: string;
}

interface Opportunity {
  _id: string;
  type: string;
  title: string;
  company: string;
  location: string;
  description: string;
  status: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'events' | 'opportunities' | 'mentorship'>('requests');
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch pending requests, events, and opportunities
      // For now, using mock data - you'll need to implement actual API calls
      setPendingRequests([
        {
          _id: '1',
          alumniId: {
            _id: 'alumni1',
            name: 'John Doe',
            email: 'john@example.com',
            graduationYear: 2020,
            department: 'Computer Science'
          },
          type: 'mentorship',
          status: 'pending',
          message: 'Requesting mentorship for career guidance',
          createdAt: '2025-01-15T10:00:00Z'
        },
        {
          _id: '2',
          alumniId: {
            _id: 'alumni2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            graduationYear: 2019,
            department: 'Electrical Engineering'
          },
          type: 'event',
          status: 'pending',
          message: 'Requesting to speak at tech conference',
          createdAt: '2025-01-14T15:30:00Z'
        }
      ]);

      setEvents([
        {
          _id: '1',
          title: 'Annual Alumni Reunion 2024',
          description: 'Join us for our biggest alumni gathering',
          startDate: '2025-02-15T09:00:00Z',
          endDate: '2025-02-15T18:00:00Z',
          mode: 'offline',
          venue: 'University Main Auditorium',
          category: 'reunion',
          status: 'published'
        }
      ]);

      setOpportunities([
        {
          _id: '1',
          type: 'job',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'Bangalore',
          description: 'Looking for experienced software engineer',
          status: 'active'
        }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      // Implement API call to approve/reject request
      setPendingRequests(prev => 
        prev.map(req => 
          req._id === requestId 
            ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
            : req
        )
      );
      toast.success(`Request ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Failed to ${action} request`);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // Implement API call to delete event
        setEvents(prev => prev.filter(event => event._id !== eventId));
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        // Implement API call to delete opportunity
        setOpportunities(prev => prev.filter(opp => opp._id !== opportunityId));
        toast.success('Opportunity deleted successfully');
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        toast.error('Failed to delete opportunity');
      }
    }
  };

  const tabs = [
    { id: 'requests', label: 'Pending Requests', icon: Clock, count: pendingRequests.filter(r => r.status === 'pending').length },
    { id: 'events', label: 'Events', icon: Calendar, count: events.length },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase, count: opportunities.length },
    { id: 'mentorship', label: 'Mentorship', icon: UserCheck, count: 0 }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests.filter(r => r.status === 'pending').length}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 py-1 px-2 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'requests' && (
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Pending Requests</h2>
            </div>
            <div className="space-y-4">
              {pendingRequests.filter(r => r.status === 'pending').map((request) => (
                <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.type === 'mentorship' ? 'bg-blue-100 text-blue-800' :
                          request.type === 'event' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900">{request.alumniId.name}</h3>
                      <p className="text-sm text-gray-600">{request.alumniId.email}</p>
                      <p className="text-sm text-gray-600">
                        {request.alumniId.graduationYear} • {request.alumniId.department}
                      </p>
                      <p className="mt-2 text-gray-700">{request.message}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleRequestAction(request._id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestAction(request._id, 'reject')}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingRequests.filter(r => r.status === 'pending').length === 0 && (
                <p className="text-gray-500 text-center py-8">No pending requests</p>
              )}
            </div>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'events' && (
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Events Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{event.mode}</span>
                        {event.venue && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{event.venue}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteEvent(event._id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'opportunities' && (
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Opportunities Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Opportunity
              </Button>
            </div>
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <div key={opportunity._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {opportunity.type}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                      <p className="text-sm text-gray-600">{opportunity.company} • {opportunity.location}</p>
                      <p className="text-sm text-gray-700 mt-1">{opportunity.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteOpportunity(opportunity._id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'mentorship' && (
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Mentorship Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Mentor
              </Button>
            </div>
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Mentorship management features coming soon</p>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
