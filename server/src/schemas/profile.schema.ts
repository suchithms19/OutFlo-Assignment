import { z } from "zod";

export const scrapingRequestSchema = z.object({
	search_url: z.string().url("Invalid LinkedIn search URL"),
	max_profiles: z.number().min(1).max(50).optional().default(20),
	session_cookie: z.string().min(1, "LinkedIn session cookie (li_at) is required").optional(),
});

export const profileSearchSchema = z.object({
	full_name: z.string().optional(),
	company: z.string().optional(),
	job_title: z.string().optional(),
	location: z.string().optional(),
	limit: z.number().min(1).max(100).optional().default(20),
	offset: z.number().min(0).optional().default(0),
});
