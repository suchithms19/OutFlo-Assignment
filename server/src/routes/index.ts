import { Router } from "express";
import { campaignRoutes } from "./campaign.routes.js";
import { linkedinRoutes } from "./linkedin.routes.js";

const router = Router();

router.use("/campaigns", campaignRoutes);
router.use("/personalized-message", linkedinRoutes);

export const apiRoutes = router;
