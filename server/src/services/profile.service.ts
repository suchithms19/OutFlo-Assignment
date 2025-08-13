import { ProfileModel } from "../models/profile.model.js";
import type {
	LinkedInProfile,
	ProfileSearchQuery,
} from "../interfaces/profile.interface.js";

const getAllProfiles = async (
	limit = 20,
	offset = 0,
): Promise<{ profiles: LinkedInProfile[]; total: number }> => {
	const profiles = await ProfileModel.find()
		.sort({ scraped_at: -1 })
		.limit(limit)
		.skip(offset);

	const total = await ProfileModel.countDocuments();
	return { profiles, total };
};

const searchProfiles = async (
	query: ProfileSearchQuery,
): Promise<LinkedInProfile[]> => {
	const filter: any = {};

	// Text search across name, company, and job title
	if (query.full_name) {
		filter.$text = { $search: query.full_name };
	}

	// Regex search for partial matches
	if (query.company) {
		filter.company = { $regex: query.company, $options: "i" };
	}

	if (query.job_title) {
		filter.job_title = { $regex: query.job_title, $options: "i" };
	}

	if (query.location) {
		filter.location = { $regex: query.location, $options: "i" };
	}

	return await ProfileModel.find(filter)
		.sort({ scraped_at: -1 })
		.limit(query.limit || 20)
		.skip(query.offset || 0);
};

const getProfileById = async (id: string): Promise<LinkedInProfile | null> => {
	return await ProfileModel.findById(id);
};

const deleteProfile = async (id: string): Promise<LinkedInProfile | null> => {
	return await ProfileModel.findByIdAndDelete(id);
};

const getProfileStats = async (): Promise<{
	total_profiles: number;
	companies: number;
	locations: number;
	recent_scrapes: number;
}> => {
	const total_profiles = await ProfileModel.countDocuments();

	const companies = await ProfileModel.distinct("company").then(
		(result) => result.length,
	);

	const locations = await ProfileModel.distinct("location").then(
		(result) => result.length,
	);

	// Count profiles scraped in last 24 hours
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	const recent_scrapes = await ProfileModel.countDocuments({
		scraped_at: { $gte: yesterday },
	});

	return {
		total_profiles,
		companies,
		locations,
		recent_scrapes,
	};
};

export const ProfileService = {
	getAllProfiles,
	searchProfiles,
	getProfileById,
	deleteProfile,
	getProfileStats,
};
