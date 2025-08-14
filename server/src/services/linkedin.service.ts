import { getGeminiModel } from "../config/gemini.js";
import type {
	LinkedInProfileData,
	PersonalizedMessageResponse,
} from "../interfaces/linkedin.interface.js";

interface RetryConfig {
	max_retries: number;
	initial_delay_ms: number;
	max_delay_ms: number;
	backoff_multiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
	max_retries: 3,
	initial_delay_ms: 1000,
	max_delay_ms: 10000,
	backoff_multiplier: 2,
};


const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};


const executeWithRetry = async <T>(
	operation: () => Promise<T>,
	config: RetryConfig = DEFAULT_RETRY_CONFIG,
): Promise<T> => {
	let lastError: Error = new Error("Unknown error");
	let delay = config.initial_delay_ms;

	for (let attempt = 0; attempt <= config.max_retries; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			
			if (attempt === config.max_retries) {
				break;
			}

			console.warn(
				`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`,
				lastError.message,
			);

			await sleep(delay);
			
			delay = Math.min(delay * config.backoff_multiplier, config.max_delay_ms);
		}
	}

	throw lastError;
};

const generatePersonalizedMessage = async (
	profileData: LinkedInProfileData,
): Promise<PersonalizedMessageResponse> => {
	return executeWithRetry(async () => {
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

		// Validate that we got a meaningful response
		if (!message || message.length < 10) {
			throw new Error("Generated message is too short or empty");
		}

		return { message };
	}).catch((error) => {
		console.error("Error generating personalized message after retries:", error);
		throw new Error("Failed to generate personalized message after multiple attempts");
	});
};

export const LinkedInService = {
	generatePersonalizedMessage,
};
