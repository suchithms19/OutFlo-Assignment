export interface LinkedInProfileData {
	name: string;
	job_title: string;
	company: string;
	location: string;
	summary: string;
}

export interface PersonalizedMessageRequest extends LinkedInProfileData {}

export interface PersonalizedMessageResponse {
	message: string;
}
