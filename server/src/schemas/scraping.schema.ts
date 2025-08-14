import { z } from "zod";

export const scrapingRequestSchema = z.object({
	searchUrl: z.string().url("Invalid LinkedIn search URL"),
	numProfiles: z
		.number()
		.min(1, "Number of profiles must be at least 1")
		.max(50, "Cannot scrape more than 50 profiles at once"),
});

export const getProfilesQuerySchema = z.object({
	page: z
		.string()
		.transform(Number)
		.refine((val) => val > 0, "Page must be greater than 0")
		.optional()
		.default("1"),
	limit: z
		.string()
		.transform(Number)
		.refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
		.optional()
		.default("10"),
	company: z.string().optional(),
	location: z.string().optional(),
	searchUrl: z.string().url().optional(),
});

export const deleteProfileSchema = z.object({
	id: z.string().min(1, "Profile ID is required"),
});
