import apiClient from './client';

interface EventFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  mode?: string;
  upcoming?: boolean;
}

export const eventService = {
  async getEvents(filters: EventFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/events?${params}`);
    return response.data;
  },

  async getEvent(id: string) {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  async createEvent(data: any) {
    const response = await apiClient.post('/events', data);
    return response.data;
  },

  async updateEvent(id: string, data: any) {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  },

  async deleteEvent(id: string) {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },

  async rsvpEvent(id: string) {
    const response = await apiClient.post(`/events/${id}/rsvp`);
    return response.data;
  },

  async cancelRsvp(id: string) {
    const response = await apiClient.delete(`/events/${id}/rsvp`);
    return response.data;
  },

  async getUserEvents() {
    const response = await apiClient.get('/events/user/registered');
    return response.data;
  },
};