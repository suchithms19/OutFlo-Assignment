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

		const prompt = `Generate a personalized LinkedIn outreach message for the following person:
    
Name: ${profileData.name}
Job Title: ${profileData.job_title}
Company: ${profileData.company}
Location: ${profileData.location}
Summary: ${profileData.summary}

Create a professional, engaging outreach message for Outflo (a campaign management and outreach automation platform). The message should:
1. Be personalized based on their role and company
2. Mention how Outflo can help with their outreach and sales process
3. Be concise (under 300 characters for LinkedIn)
4. Sound natural and not overly salesy
5. Include a call to connect or learn more

Return only the message text without any additional formatting or quotes.`;

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
