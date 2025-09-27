import apiClient from './client';

export const analyticsService = {
  async getOverview() {
    const response = await apiClient.get('/analytics/overview');
    return response.data;
  },

  async getGraduationYearDistribution() {
    const response = await apiClient.get('/analytics/alumni/graduation-years');
    return response.data;
  },

  async getDepartmentDistribution() {
    const response = await apiClient.get('/analytics/alumni/departments');
    return response.data;
  },

  async getEventRsvpTrends() {
    const response = await apiClient.get('/analytics/events/rsvp-trends');
    return response.data;
  },

  async getDonationTrends() {
    const response = await apiClient.get('/analytics/donations/trends');
    return response.data;
  },

  async getTopCompanies() {
    const response = await apiClient.get('/analytics/alumni/companies');
    return response.data;
  },
};