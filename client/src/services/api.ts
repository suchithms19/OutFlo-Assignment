import axios from 'axios';
import type { 
  Campaign, 
  LinkedInProfile, 
  GeneratedMessage, 
  ScrapedLinkedInProfile,
  ScrapingRequest,
  ScrapingResponse,
  GetProfilesResponse
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const campaignApi = {
  getAll: async (): Promise<Campaign[]> => {
    const response = await api.get('/campaigns');
    return response.data;
  },

  getById: async (id: string): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  create: async (campaign: Omit<Campaign, '_id'>): Promise<Campaign> => {
    const response = await api.post('/campaigns', campaign);
    return response.data;
  },

  update: async (id: string, campaign: Partial<Campaign>): Promise<Campaign> => {
    const response = await api.put(`/campaigns/${id}`, campaign);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/campaigns/${id}`);
  },
};

export const messageApi = {
  generatePersonalized: async (profile: LinkedInProfile): Promise<GeneratedMessage> => {
    const response = await api.post('/personalized-message', profile);
    return response.data;
  },
};

export const scrapingApi = {
  scrapeProfiles: async (request: ScrapingRequest): Promise<ScrapingResponse> => {
    const response = await api.post('/scraping/scrape', request);
    return response.data;
  },

  getAllProfiles: async (params?: {
    page?: number;
    limit?: number;
    company?: string;
    location?: string;
  }): Promise<GetProfilesResponse> => {
    const response = await api.get('/scraping/profiles', { params });
    return response.data;
  },

  getProfileById: async (id: string): Promise<ScrapedLinkedInProfile> => {
    const response = await api.get(`/scraping/profiles/${id}`);
    return response.data;
  },

  deleteProfile: async (id: string): Promise<void> => {
    await api.delete(`/scraping/profiles/${id}`);
  },

  deleteAllProfiles: async (): Promise<{ message: string; deletedCount: number }> => {
    const response = await api.delete('/scraping/profiles');
    return response.data;
  },

  cleanupInvalidProfiles: async (): Promise<{ message: string; deletedCount: number }> => {
    const response = await api.post('/scraping/cleanup');
    return response.data;
  },
};

export default api;
