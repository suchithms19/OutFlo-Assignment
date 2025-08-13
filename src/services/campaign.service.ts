import { CampaignModel } from "../models/campaign.model.js";
import type {
	Campaign,
	CreateCampaignRequest,
	UpdateCampaignRequest,
} from "../interfaces/campaign.interface.js";

const getAllCampaigns = async (): Promise<Campaign[]> => {
	return await CampaignModel.find({ status: { $ne: "deleted" } }).sort({
		created_at: -1,
	});
};

const getCampaignById = async (id: string): Promise<Campaign | null> => {
	return await CampaignModel.findOne({ _id: id, status: { $ne: "deleted" } });
};

const createCampaign = async (
	campaignData: CreateCampaignRequest,
): Promise<Campaign> => {
	const campaign = new CampaignModel({
		name: campaignData.name,
		description: campaignData.description,
		leads: campaignData.leads || [],
		account_ids: campaignData.account_ids || [],
		status: "active",
	});
	return await campaign.save();
};

const updateCampaign = async (
	id: string,
	updateData: UpdateCampaignRequest,
): Promise<Campaign | null> => {
	return await CampaignModel.findOneAndUpdate(
		{ _id: id, status: { $ne: "deleted" } },
		{ $set: updateData },
		{ new: true, runValidators: true },
	);
};

const deleteCampaign = async (id: string): Promise<Campaign | null> => {
	return await CampaignModel.findOneAndUpdate(
		{ _id: id, status: { $ne: "deleted" } },
		{ $set: { status: "deleted" } },
		{ new: true },
	);
};

export const CampaignService = {
	getAllCampaigns,
	getCampaignById,
	createCampaign,
	updateCampaign,
	deleteCampaign,
};
