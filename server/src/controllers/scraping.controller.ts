import type { Request, Response } from "express";
import { ScrapingService } from "../services/scraping.service.js";
import {
	scrapingRequestSchema,
	getProfilesQuerySchema,
	deleteProfileSchema,
} from "../schemas/scraping.schema.js";

const scrapeProfiles = async (req: Request, res: Response): Promise<void> => {
	try {
		const { searchUrl, numProfiles } = scrapingRequestSchema.parse(req.body);
		
		console.log(`Starting scraping process for ${numProfiles} profiles from: ${searchUrl}`);
		
		const result = await ScrapingService.scrapeLinkedInProfiles(
			searchUrl,
			numProfiles,
		);
		
		res.status(200).json(result);
	} catch (error) {
		console.error("Scraping error:", error);
		const message =
			error instanceof Error ? error.message : "Error scraping LinkedIn profiles";
		res.status(500).json({ message });
	}
};

const getAllProfiles = async (req: Request, res: Response): Promise<void> => {
	try {
		const queryParams = getProfilesQuerySchema.parse(req.query);
		const result = await ScrapingService.getAllProfiles(queryParams);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching profiles";
		res.status(500).json({ message });
	}
};

const getProfileById = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = deleteProfileSchema.parse(req.params);
		const profile = await ScrapingService.getProfileById(id);

		if (!profile) {
			res.status(404).json({ message: "Profile not found" });
			return;
		}

		res.json(profile);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching profile";
		res.status(500).json({ message });
	}
};

const deleteProfile = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = deleteProfileSchema.parse(req.params);
		const profile = await ScrapingService.deleteProfile(id);

		if (!profile) {
			res.status(404).json({ message: "Profile not found" });
			return;
		}

		res.json({ message: "Profile deleted successfully" });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error deleting profile";
		res.status(500).json({ message });
	}
};

const deleteAllProfiles = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = await ScrapingService.deleteAllProfiles();
		res.json({
			message: `Successfully deleted ${result.deletedCount} profiles`,
			deletedCount: result.deletedCount,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error deleting all profiles";
		res.status(500).json({ message });
	}
};

const cleanupInvalidProfiles = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = await ScrapingService.cleanupInvalidProfiles();
		res.json({
			message: `Successfully cleaned up ${result.deletedCount} invalid profiles`,
			deletedCount: result.deletedCount,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error cleaning up invalid profiles";
		res.status(500).json({ message });
	}
};

export const ScrapingController = {
	scrapeProfiles,
	getAllProfiles,
	getProfileById,
	deleteProfile,
	deleteAllProfiles,
	cleanupInvalidProfiles,
};
