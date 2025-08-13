import { Router } from "express";
import { LinkedInController } from "../controllers/linkedin.controller.js";

const router = Router();

router.post("/", LinkedInController.generatePersonalizedMessage);

export const linkedinRoutes = router;
