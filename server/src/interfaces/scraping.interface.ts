import type { Document } from "mongoose";

export interface LinkedInProfileData {
	name: string;
	jobTitle: string;
	company: string;
	location: string;
	profileUrl: string;
	summary?: string;
	scrapedAt?: Date;
}

export interface LinkedInProfile extends LinkedInProfileData, Document {
	_id: string;
	created_at: Date;
	updated_at: Date;
}

export interface ScrapingRequest {
	searchUrl: string;
	numProfiles: number;
}

export interface ScrapingResponse {
	message: string;
	profilesScraped: number;
	profiles: LinkedInProfileData[];
}

export interface GetProfilesRequest {
	page?: number;
	limit?: number;
	company?: string;
	location?: string;
	searchUrl?: string;
}

export interface GetProfilesResponse {
	profiles: LinkedInProfile[];
	total: number;
	page: number;
	pages: number;
	limit: number;
}
