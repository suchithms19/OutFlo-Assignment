import type { Request, Response } from "express";
import { LinkedInService } from "../services/linkedin.service.js";
import { personalizedMessageSchema } from "../schemas/linkedin.schema.js";

const generatePersonalizedMessage = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const profileData = personalizedMessageSchema.parse(req.body);
		const result =
			await LinkedInService.generatePersonalizedMessage(profileData);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Error generating personalized message";
		res.status(400).json({ message });
	}
};

export const LinkedInController = {
	generatePersonalizedMessage,
};
