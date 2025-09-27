import apiClient from './client';

interface AlumniFilters {
  page?: number;
  limit?: number;
  search?: string;
  graduationYear?: number;
  department?: string;
  company?: string;
  location?: string;
  skills?: string;
  isMentor?: boolean;
}

export const alumniService = {
  async getAlumni(filters: AlumniFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/alumni?${params}`);
    return response.data;
  },

  async getAlumniProfile(id: string) {
    const response = await apiClient.get(`/alumni/${id}`);
    return response.data;
  },

  async updateProfile(id: string, data: any) {
    const response = await apiClient.put(`/alumni/${id}`, data);
    return response.data;
  },

  async getPendingVerifications(page = 1, limit = 20) {
    const response = await apiClient.get(`/alumni/admin/pending?page=${page}&limit=${limit}`);
    return response.data;
  },

  async verifyAlumni(id: string, status: 'approved' | 'rejected', reason?: string) {
    const response = await apiClient.put(`/alumni/${id}/verify`, { status, reason });
    return response.data;
  },
};