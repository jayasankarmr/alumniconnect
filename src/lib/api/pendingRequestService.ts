import { apiClient } from './client';

export interface PendingRequestData {
  type: 'event' | 'opportunity' | 'mentor';
  data: any;
}

export interface EventRequestData {
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  venue?: string;
  virtualLink?: string;
  maxSeats?: number;
  tags: string[];
}

export interface OpportunityRequestData {
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
  applicationDeadline?: string;
  applicationLink?: string;
  contactEmail?: string;
  skillsRequired: string[];
}

export interface MentorRequestData {
  areasOfExpertise: string[];
  experience: string;
  availability: string;
  bio: string;
  linkedinUrl?: string;
  preferredMenteeType: string;
  mentoringStyle: string;
}

export const pendingRequestService = {
  async submitRequest(requestData: PendingRequestData) {
    const response = await apiClient.post('/pending-requests', requestData);
    return response.data;
  },

  async getPendingRequests() {
    const response = await apiClient.get('/pending-requests');
    return response.data;
  },

  async getMyRequests() {
    const response = await apiClient.get('/pending-requests/my-requests');
    return response.data;
  },

  async approveRequest(id: string, reviewNotes?: string) {
    const response = await apiClient.put(`/pending-requests/${id}/approve`, {
      reviewNotes
    });
    return response.data;
  },

  async rejectRequest(id: string, reviewNotes?: string) {
    const response = await apiClient.put(`/pending-requests/${id}/reject`, {
      reviewNotes
    });
    return response.data;
  }
};
