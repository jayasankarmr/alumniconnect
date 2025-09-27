import apiClient from './client';

interface DonationData {
  amount: number;
  campaignId?: string;
  paymentMethod: string;
  isAnonymous?: boolean;
  note?: string;
}

export const donationService = {
  async getDonations(page = 1, limit = 20) {
    const response = await apiClient.get(`/donations?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createDonation(data: DonationData) {
    const response = await apiClient.post('/donations', data);
    return response.data;
  },

  async getDonationSummary() {
    const response = await apiClient.get('/donations/summary');
    return response.data;
  },

  async getCampaigns(page = 1, limit = 20) {
    const response = await apiClient.get(`/donations/campaigns?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createCampaign(data: any) {
    const response = await apiClient.post('/donations/campaigns', data);
    return response.data;
  },
};