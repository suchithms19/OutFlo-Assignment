import mongoose, { Schema } from "mongoose";
import type { Campaign } from "../interfaces/campaign.interface.js";

const campaignSchema = new Schema<Campaign>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["active", "inactive", "deleted"],
			default: "active",
		},
		leads: [
			{
				type: String,
				trim: true,
			},
		],
		account_ids: [
			{
				type: String,
				trim: true,
			},
		],
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	},
);

campaignSchema.index({ status: 1 });
campaignSchema.index({ created_at: -1 });

export const CampaignModel = mongoose.model<Campaign>(
	"Campaign",
	campaignSchema,
);
