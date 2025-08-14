import { Router } from "express";
import { campaignRoutes } from "./campaign.routes.js";
import { linkedinRoutes } from "./linkedin.routes.js";
import { scrapingRoutes } from "./scraping.routes.js";

const router = Router();

router.use("/campaigns", campaignRoutes);
router.use("/personalized-message", linkedinRoutes);
router.use("/scraping", scrapingRoutes);

export const apiRoutes = router;
