import type { Document } from "mongoose";

export interface LinkedInProfileData {
	full_name: string;
	job_title: string;
	company: string;
	location: string;
	profile_url: string;
	summary?: string;
}

export interface LinkedInProfile extends LinkedInProfileData, Document {
	_id: string;
	scraped_at: Date;
	created_at: Date;
	updated_at: Date;
}

export interface ScrapingRequest {
	search_url: string;
	max_profiles?: number;
}

export interface ScrapingResponse {
	success: boolean;
	profiles_count: number;
	profiles: LinkedInProfileData[];
	message: string;
}

export interface ProfileSearchQuery {
	full_name?: string;
	company?: string;
	job_title?: string;
	location?: string;
	limit?: number;
	offset?: number;
}
