import { LinkedInProfileModel } from "../models/linkedinProfile.model.js";
import type {
	LinkedInProfile,
	LinkedInProfileData,
	ScrapingResponse,
	GetProfilesRequest,
	GetProfilesResponse,
} from "../interfaces/scraping.interface.js";

/**
 * Placeholder scraping function - Playwright has been removed for deployment
 * This function now returns a mock response indicating scraping is disabled
 */
const scrapeLinkedInProfiles = async (
	searchUrl: string,
	numProfiles: number,
): Promise<ScrapingResponse> => {
	console.log("Scraping function called but Playwright has been disabled for deployment");
	console.log(`Request was for ${numProfiles} profiles from: ${searchUrl}`);
	
	// Return a response indicating scraping is disabled
	return {
		message: "LinkedIn profile scraping is currently disabled. Playwright has been removed for deployment compatibility.",
		profilesScraped: 0,
		profiles: [],
	};
};

/**
 * Retrieves all LinkedIn profiles from the database with filtering and pagination
 * @param request - Filter and pagination parameters
 * @returns Paginated list of LinkedIn profiles
 */
const getAllProfiles = async (
	request: GetProfilesRequest,
): Promise<GetProfilesResponse> => {
	const { page = 1, limit = 10, company, location } = request;
	const skip = (page - 1) * limit;

	// Build filter object for MongoDB query
	const filter: any = {};
	if (company) {
		filter.company = { $regex: company, $options: "i" };
	}
	if (location) {
		filter.location = { $regex: location, $options: "i" };
	}

	// Get total count for pagination
	const total = await LinkedInProfileModel.countDocuments(filter);

	// Fetch profiles with filters, sorting, and pagination
	const profiles = await LinkedInProfileModel.find(filter)
		.sort({ created_at: -1 })
		.skip(skip)
		.limit(limit);

	const pages = Math.ceil(total / limit);

	return {
		profiles,
		total,
		page,
		pages,
		limit,
	};
};

/**
 * Retrieves a single LinkedIn profile by ID
 * @param id - Profile ID
 * @returns LinkedIn profile or null if not found
 */
const getProfileById = async (id: string): Promise<LinkedInProfile | null> => {
	return await LinkedInProfileModel.findById(id);
};

/**
 * Deletes a LinkedIn profile by ID
 * @param id - Profile ID to delete
 * @returns Deleted profile or null if not found
 */
const deleteProfile = async (id: string): Promise<LinkedInProfile | null> => {
	return await LinkedInProfileModel.findByIdAndDelete(id);
};

/**
 * Deletes all LinkedIn profiles from the database
 * @returns Object containing the number of deleted profiles
 */
const deleteAllProfiles = async (): Promise<{ deletedCount: number }> => {
	const result = await LinkedInProfileModel.deleteMany({});
	return { deletedCount: result.deletedCount || 0 };
};

/**
 * Removes invalid profiles (profiles with null, empty, or missing profileUrl)
 * @returns Object containing the number of deleted profiles
 */
const cleanupInvalidProfiles = async (): Promise<{ deletedCount: number }> => {
	const result = await LinkedInProfileModel.deleteMany({
		$or: [
			{ profileUrl: null },
			{ profileUrl: "" },
			{ profileUrl: { $exists: false } }
		]
	});
	return { deletedCount: result.deletedCount || 0 };
};

export const ScrapingService = {
	scrapeLinkedInProfiles,
	getAllProfiles,
	getProfileById,
	deleteProfile,
	deleteAllProfiles,
	cleanupInvalidProfiles,
};