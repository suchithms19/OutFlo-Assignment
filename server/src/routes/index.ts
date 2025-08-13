import { Router } from "express";
import { campaignRoutes } from "./campaign.routes.js";
import { linkedinRoutes } from "./linkedin.routes.js";
import { profileRoutes } from "./profile.routes.js";

const router = Router();

router.use("/campaigns", campaignRoutes);
router.use("/personalized-message", linkedinRoutes);
router.use("/profiles", profileRoutes);

export const apiRoutes = router;
