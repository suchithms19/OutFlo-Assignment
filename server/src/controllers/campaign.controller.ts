import type { Request, Response } from "express";
import { CampaignService } from "../services/campaign.service.js";
import {
	createCampaignSchema,
	updateCampaignSchema,
	campaignParamsSchema,
} from "../schemas/campaign.schema.js";

const getAllCampaigns = async (_req: Request, res: Response): Promise<void> => {
	try {
		const campaigns = await CampaignService.getAllCampaigns();
		res.json(campaigns);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching campaigns";
		res.status(500).json({ message });
	}
};

const getCampaignById = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = campaignParamsSchema.parse(req.params);
		const campaign = await CampaignService.getCampaignById(id);

		if (!campaign) {
			res.status(404).json({ message: "Campaign not found" });
			return;
		}

		res.json(campaign);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching campaign";
		res.status(500).json({ message });
	}
};

const createCampaign = async (req: Request, res: Response): Promise<void> => {
	try {
		const campaignData = createCampaignSchema.parse(req.body);
		const campaign = await CampaignService.createCampaign(campaignData);
		res.status(201).json(campaign);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error creating campaign";
		res.status(400).json({ message });
	}
};

const updateCampaign = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = campaignParamsSchema.parse(req.params);
		const updateData = updateCampaignSchema.parse(req.body);

		const campaign = await CampaignService.updateCampaign(id, updateData);

		if (!campaign) {
			res.status(404).json({ message: "Campaign not found" });
			return;
		}

		res.json(campaign);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error updating campaign";
		res.status(400).json({ message });
	}
};

const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = campaignParamsSchema.parse(req.params);
		const campaign = await CampaignService.deleteCampaign(id);

		if (!campaign) {
			res.status(404).json({ message: "Campaign not found" });
			return;
		}

		res.json({ message: "Campaign deleted successfully" });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error deleting campaign";
		res.status(500).json({ message });
	}
};

export const CampaignController = {
	getAllCampaigns,
	getCampaignById,
	createCampaign,
	updateCampaign,
	deleteCampaign,
};
