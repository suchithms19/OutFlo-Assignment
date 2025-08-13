import type { Document } from "mongoose";

export interface CampaignData {
	name: string;
	description: string;
	status: "active" | "inactive" | "deleted";
	leads: string[];
	account_ids: string[];
}

export interface Campaign extends CampaignData, Document {
	_id: string;
	created_at: Date;
	updated_at: Date;
}

export interface CreateCampaignRequest {
	name: string;
	description: string;
	leads?: string[];
	account_ids?: string[];
}

export interface UpdateCampaignRequest {
	name?: string;
	description?: string;
	status?: "active" | "inactive";
	leads?: string[];
	account_ids?: string[];
}
