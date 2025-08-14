import { Router } from "express";
import { ScrapingController } from "../controllers/scraping.controller.js";

const router = Router();

// Scraping endpoint (currently disabled - returns message about Playwright removal)
router.post("/scrape", ScrapingController.scrapeProfiles);

// Profile management endpoints
router.get("/profiles", ScrapingController.getAllProfiles);
router.get("/profiles/:id", ScrapingController.getProfileById);
router.delete("/profiles/:id", ScrapingController.deleteProfile);
router.delete("/profiles", ScrapingController.deleteAllProfiles);
router.post("/cleanup", ScrapingController.cleanupInvalidProfiles);

export const scrapingRoutes = router;