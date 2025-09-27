import apiClient from './client';

interface OpportunityFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  mode?: string;
  company?: string;
  skills?: string;
}

export const opportunityService = {
  async getOpportunities(filters: OpportunityFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/opportunities?${params}`);
    return response.data;
  },

  async getOpportunity(id: string) {
    const response = await apiClient.get(`/opportunities/${id}`);
    return response.data;
  },

  async createOpportunity(data: any) {
    const response = await apiClient.post('/opportunities', data);
    return response.data;
  },

  async updateOpportunity(id: string, data: any) {
    const response = await apiClient.put(`/opportunities/${id}`, data);
    return response.data;
  },

  async deleteOpportunity(id: string) {
    const response = await apiClient.delete(`/opportunities/${id}`);
    return response.data;
  },

  async expressInterest(id: string) {
    const response = await apiClient.post(`/opportunities/${id}/interest`);
    return response.data;
  },

  async getMyOpportunities(page = 1, limit = 20) {
    const response = await apiClient.get(`/opportunities/my/posted?page=${page}&limit=${limit}`);
    return response.data;
  },
};