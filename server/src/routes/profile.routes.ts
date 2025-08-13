import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller.js";

const router = Router();

// Scraping routes
router.post("/scrape", ProfileController.scrapeProfiles);
router.post("/cleanup", ProfileController.cleanup);

// Profile management routes
router.get("/", ProfileController.getAllProfiles);
router.get("/search", ProfileController.searchProfiles);
router.get("/stats", ProfileController.getProfileStats);
router.get("/:id", ProfileController.getProfileById);
router.delete("/:id", ProfileController.deleteProfile);

export const profileRoutes = router;
