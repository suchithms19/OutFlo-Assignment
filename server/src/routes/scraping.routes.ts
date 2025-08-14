import { Router } from "express";
import { ScrapingController } from "../controllers/scraping.controller.js";

const router = Router();

router.post("/scrape", ScrapingController.scrapeProfiles);
router.get("/profiles", ScrapingController.getAllProfiles);
router.get("/profiles/:id", ScrapingController.getProfileById);
router.delete("/profiles/:id", ScrapingController.deleteProfile);
router.delete("/profiles", ScrapingController.deleteAllProfiles);
router.post("/cleanup", ScrapingController.cleanupInvalidProfiles);

export const scrapingRoutes = router;
