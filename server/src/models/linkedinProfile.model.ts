import mongoose, { Schema } from "mongoose";
import type { LinkedInProfile } from "../interfaces/scraping.interface";

const linkedinProfileSchema = new Schema<LinkedInProfile>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		jobTitle: {
			type: String,
			required: true,
			trim: true,
		},
		company: {
			type: String,
			required: true,
			trim: true,
		},
		location: {
			type: String,
			required: true,
			trim: true,
		},
		profileUrl: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		summary: {
			type: String,
			trim: true,
		},
		scrapedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	},
);

linkedinProfileSchema.index({ company: 1 });
linkedinProfileSchema.index({ scrapedAt: -1 });
linkedinProfileSchema.index({ created_at: -1 });

export const LinkedInProfileModel = mongoose.model<LinkedInProfile>(
	"LinkedInProfile",
	linkedinProfileSchema,
);
