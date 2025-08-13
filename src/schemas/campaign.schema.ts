import { z } from "zod";

export const createCampaignSchema = z.object({
	name: z.string().min(1, "Campaign name is required"),
	description: z.string().min(1, "Campaign description is required"),
	leads: z.array(z.string().url("Invalid LinkedIn URL")).optional().default([]),
	account_ids: z.array(z.string()).optional().default([]),
});

export const updateCampaignSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	status: z.enum(["active", "inactive"]).optional(),
	leads: z.array(z.string().url("Invalid LinkedIn URL")).optional(),
	account_ids: z.array(z.string()).optional(),
});

export const campaignParamsSchema = z.object({
	id: z.string().min(1, "Campaign ID is required"),
});
