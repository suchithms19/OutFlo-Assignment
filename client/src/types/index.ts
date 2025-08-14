export interface Campaign {
  _id?: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'deleted';
  leads?: string[];
  account_ids?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

// Scraped LinkedIn Profile interface for the bonus feature
export interface ScrapedLinkedInProfile {
  _id?: string;
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
  summary?: string;
  scrapedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScrapingRequest {
  searchUrl: string;
  numProfiles: number;
}

export interface ScrapingResponse {
  message: string;
  profilesScraped: number;
  profiles: ScrapedLinkedInProfile[];
}

export interface GetProfilesResponse {
  profiles: ScrapedLinkedInProfile[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface GeneratedMessage {
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
