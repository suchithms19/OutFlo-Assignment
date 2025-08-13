import mongoose, { Schema } from "mongoose";
import type { LinkedInProfile } from "../interfaces/profile.interface.js";

const profileSchema = new Schema<LinkedInProfile>(
	{
		full_name: {
			type: String,
			required: true,
			trim: true,
		},
		job_title: {
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
		profile_url: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		summary: {
			type: String,
			trim: true,
		},
		scraped_at: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	},
);

// Indexes for better query performance
profileSchema.index({ full_name: "text", company: "text", job_title: "text" });
profileSchema.index({ company: 1 });
profileSchema.index({ job_title: 1 });
profileSchema.index({ location: 1 });
profileSchema.index({ scraped_at: -1 });
profileSchema.index({ profile_url: 1 }, { unique: true });

export const ProfileModel = mongoose.model<LinkedInProfile>(
	"Profile",
	profileSchema,
);
