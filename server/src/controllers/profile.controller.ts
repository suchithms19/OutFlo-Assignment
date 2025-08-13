import type { Request, Response } from "express";
import { ScrapingService } from "../services/scraping.service.js";
import { ProfileService } from "../services/profile.service.js";
import {
	scrapingRequestSchema,
	profileSearchSchema,
} from "../schemas/profile.schema.js";

const scrapeProfiles = async (req: Request, res: Response): Promise<void> => {
	try {
		const { search_url, max_profiles, session_cookie } = scrapingRequestSchema.parse(req.body);

		console.log(`Starting scraping for URL: ${search_url}`);
		console.log(`Max profiles to scrape: ${max_profiles}`);

		const result = await ScrapingService.scrapeLinkedInProfiles(
			search_url,
			max_profiles,
			session_cookie,
		);

		if (result.success) {
			res.status(200).json(result);
		} else {
			res.status(400).json(result);
		}
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error during scraping";
		console.error("Scraping error:", error);
		res.status(500).json({
			success: false,
			profiles_count: 0,
			profiles: [],
			message,
		});
	}
};

const getAllProfiles = async (req: Request, res: Response): Promise<void> => {
	try {
		const limit = Number.parseInt(req.query.limit as string) || 20;
		const offset = Number.parseInt(req.query.offset as string) || 0;

		const result = await ProfileService.getAllProfiles(limit, offset);
		res.json({
			success: true,
			data: result.profiles,
			pagination: {
				total: result.total,
				limit,
				offset,
				pages: Math.ceil(result.total / limit),
			},
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching profiles";
		res.status(500).json({ success: false, message });
	}
};

const searchProfiles = async (req: Request, res: Response): Promise<void> => {
	try {
		const query = profileSearchSchema.parse(req.query);
		const profiles = await ProfileService.searchProfiles(query);

		res.json({
			success: true,
			data: profiles,
			count: profiles.length,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error searching profiles";
		res.status(400).json({ success: false, message });
	}
};

const getProfileById = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const profile = await ProfileService.getProfileById(id);

		if (!profile) {
			res.status(404).json({
				success: false,
				message: "Profile not found",
			});
			return;
		}

		res.json({
			success: true,
			data: profile,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching profile";
		res.status(500).json({ success: false, message });
	}
};

const deleteProfile = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const profile = await ProfileService.deleteProfile(id);

		if (!profile) {
			res.status(404).json({
				success: false,
				message: "Profile not found",
			});
			return;
		}

		res.json({
			success: true,
			message: "Profile deleted successfully",
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error deleting profile";
		res.status(500).json({ success: false, message });
	}
};

const getProfileStats = async (_req: Request, res: Response): Promise<void> => {
	try {
		const stats = await ProfileService.getProfileStats();
		res.json({
			success: true,
			data: stats,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching stats";
		res.status(500).json({ success: false, message });
	}
};

// Cleanup browser resources
const cleanup = async (_req: Request, res: Response): Promise<void> => {
	try {
		await ScrapingService.closeBrowser();
		res.json({
			success: true,
			message: "Browser resources cleaned up successfully",
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error during cleanup";
		res.status(500).json({ success: false, message });
	}
};

export const ProfileController = {
	scrapeProfiles,
	getAllProfiles,
	searchProfiles,
	getProfileById,
	deleteProfile,
	getProfileStats,
	cleanup,
};
