import { getGeminiModel } from "../config/gemini.js";
import type {
	LinkedInProfileData,
	PersonalizedMessageResponse,
} from "../interfaces/linkedin.interface.js";

const generatePersonalizedMessage = async (
	profileData: LinkedInProfileData,
): Promise<PersonalizedMessageResponse> => {
	try {
		const model = getGeminiModel();

		const prompt = `Write a concise (<300 characters) LinkedIn connection request for the person below:

Name: ${profileData.name}
Job Title: ${profileData.job_title}
Company: ${profileData.company}
Location: ${profileData.location}
Summary: ${profileData.summary}

The message should:
1. Feel personal and relevant to their role/company
2. Highlight briefly how Outflo (campaign management + outreach automation) can help improve outreach/sales
3. Be friendly, natural, and non-salesy
4. End with a light call to connect or learn more

Return ONLY the message text, no quotes, no extra formatting.`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const message = response.text().trim();

		return { message };
	} catch (error) {
		console.error("Error generating personalized message:", error);
		throw new Error("Failed to generate personalized message");
	}
};

export const LinkedInService = {
	generatePersonalizedMessage,
};
