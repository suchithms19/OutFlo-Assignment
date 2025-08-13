import puppeteer, { type Browser, type Page } from "puppeteer";
import path from "node:path";
import { ProfileModel } from "../models/profile.model.js";
import type {
	LinkedInProfileData,
	ScrapingResponse,
	ProfileSearchQuery,
	LinkedInProfile,
} from "../interfaces/profile.interface.js";

// Declare DOM globals used inside page.evaluate to satisfy TypeScript without DOM lib
// These are only used within the browser context
declare const window: any;
declare const document: any;

class LinkedInScrapingService {
	private browser: Browser | null = null;
	private sessionCookie: string | null = null;

	// Initialize browser with settings and LinkedIn session
	private async initBrowser(): Promise<Browser> {
		if (this.browser) {
			return this.browser;
		}

		const userDataDir = path.resolve(".puppeteer_profile");
		this.browser = await puppeteer.launch({
			headless: false,
			slowMo: 50,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--no-first-run",
				"--no-zygote",
				"--window-size=1366,768",
				`--user-data-dir=${userDataDir}`,
			],
		});

		return this.browser;
	}

	// Setup page with LinkedIn authentication
	private async setupPage(page: Page): Promise<void> {
		// Use a stable desktop user agent to avoid mobile/auth walls
		const desktopUserAgent =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
		await page.setUserAgent(desktopUserAgent);
		await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
		page.setDefaultNavigationTimeout(90_000);
		page.setDefaultTimeout(60_000);

		// Light stealth: hide webdriver and add common hints
		await page.evaluateOnNewDocument(() => {
			Object.defineProperty(navigator, "webdriver", { get: () => undefined });
			// @ts-ignore
			navigator.chrome = { runtime: {} };
			// @ts-ignore
			Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
			// @ts-ignore
			Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
		});

		// Set viewport to common desktop resolution
		await page.setViewport({ width: 1366, height: 768 });

		// Always land on LinkedIn root first before setting cookies
		try {
			await page.goto("https://www.linkedin.com/", { waitUntil: "domcontentloaded", timeout: 30000 });
		} catch {}

		// Set LinkedIn session cookie if available
		if (this.sessionCookie) {
			const cookieBase = {
				name: "li_at" as const,
				value: this.sessionCookie,
				path: "/",
				httpOnly: true,
				secure: true,
				sameSite: "None" as const,
			};
			await page.setCookie({ ...cookieBase, domain: ".linkedin.com" });
			await page.setCookie({ ...cookieBase, domain: ".www.linkedin.com" });
		}
		// Do not block resources; LinkedIn relies on dynamic assets
	}

	private async goto_with_retries(page: Page, url: string): Promise<boolean> {
		for (let attempt = 1; attempt <= 3; attempt++) {
			try {
				await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
				await this.randomDelay(1000, 2000);
				const current = page.url();
				if (
					current.includes("/authwall") ||
					current.includes("/checkpoint/") ||
					current.includes("/login")
				) {
					// Try once to land on root and back
					await page.goto("https://www.linkedin.com/", { waitUntil: "domcontentloaded", timeout: 60_000 });
					await this.randomDelay(1000, 2000);
					continue;
				}
				return true;
			} catch (err) {
				if (attempt === 3) return false;
				await this.randomDelay(1500, 3000);
			}
		}
		return false;
	}

	private async clear_linkedin_cookies(page: Page): Promise<void> {
		try {
			const cookies = await page.cookies("https://www.linkedin.com/");
			const del = cookies
				.filter((c) => c.name.toLowerCase() === "li_at")
				.map((c) => ({ name: c.name, url: "https://www.linkedin.com/" }));
			if (del.length > 0) {
				await page.deleteCookie(...del);
			}
		} catch {}
	}

	// Add random delays to mimic human behavior
	private async randomDelay(min = 2000, max = 5000): Promise<void> {
		const delay = Math.floor(Math.random() * (max - min + 1)) + min;
		await new Promise((resolve) => setTimeout(resolve, delay));
	}

	// Set LinkedIn session cookie
	setSessionCookie(cookie: string): void {
		this.sessionCookie = cookie;
	}

	// Check if user is properly authenticated
	private async checkAuthentication(page: Page): Promise<boolean> {
		try {
			try {
				await page.goto("https://www.linkedin.com/feed/", {
					waitUntil: "domcontentloaded",
					timeout: 30000,
				});
			} catch {
				// Fallback to root if feed causes redirect loops
				await page.goto("https://www.linkedin.com/", {
					waitUntil: "domcontentloaded",
					timeout: 30000,
				});
			}

			const currentUrl = page.url();
			const isAuthenticated =
				!currentUrl.includes("/login") &&
				!currentUrl.includes("/uas/") &&
				!currentUrl.includes("/authwall");

			if (!isAuthenticated) {
				console.log("Not authenticated. Current URL:", currentUrl);
			}

			return isAuthenticated;
		} catch (error) {
			console.error("Error checking authentication:", error);
			return false;
		}
	}

	private async promptLogin(page: Page): Promise<boolean> {
		try {
			// Clear any bad cookies that might cause login/feed redirect loops
			await this.clear_linkedin_cookies(page);
			await page.goto("https://www.linkedin.com/login", {
				waitUntil: "domcontentloaded",
				timeout: 30000,
			});
			console.log("Please complete LinkedIn login in the opened browser window.");

			const start = Date.now();
			const timeoutMs = 120_000; // 2 minutes
			while (Date.now() - start < timeoutMs) {
				await this.randomDelay(1000, 2000);
				const url = page.url();
				if (url.includes("/feed")) {
					return true;
				}
			}
			return false;
		} catch (error) {
			console.error("Login prompt failed:", error);
			return false;
		}
	}

	// Scrape individual profile data
	private async scrapeProfileData(page: Page, profileUrl: string): Promise<LinkedInProfileData | null> {
		try {
			console.log(`Scraping profile: ${profileUrl}`);
			const ok = await this.goto_with_retries(page, profileUrl);
			if (!ok) {
				console.log("Failed to navigate to profile after retries");
				return null;
			}

			await this.randomDelay(2000, 4000);
			// Nudge scroll to trigger content
			await page.evaluate(() => {
				window?.scrollBy?.(0, 250);
			});

			// Wait for profile content to load
			try {
				await page.waitForSelector("h1, .text-heading-xlarge, .pv-text-details__left-panel h1", { timeout: 15000 });
			} catch (error) {
				console.log("Profile page may not have loaded properly");
				return null;
			}

			// Extract profile data using multiple selector strategies
			const profileData = await page.evaluate(() => {
				// Helper function to get text content safely
				const getTextContent = (selector: string): string => {
					const element = document.querySelector(selector as any) as any;
					return element?.textContent?.trim() || "";
				};

				// Multiple strategies for name extraction
				const name = 
					getTextContent('h1.text-heading-xlarge') ||
					getTextContent('h1.top-card-layout__title') ||
					getTextContent('h1[data-generated-suggestion-target]') ||
					getTextContent('.pv-text-details__left-panel h1') ||
					getTextContent('.ph5 h1') ||
					"";

				// Multiple strategies for job title
				const jobTitle = 
					getTextContent('.text-body-medium.break-words') ||
					getTextContent('.top-card-layout__headline') ||
					getTextContent('.pv-text-details__left-panel .text-body-medium') ||
					getTextContent('.ph5 .text-body-medium') ||
					"";

				// Multiple strategies for location
				const location = 
					getTextContent('.text-body-small.inline.t-black--light.break-words') ||
					getTextContent('.top-card__subline-item') ||
					getTextContent('.pv-text-details__left-panel .pb2 .text-body-small') ||
					"";

				// Extract company from job title or experience section
				let company = "";
				const jobTitleText = jobTitle.toLowerCase();
				if (jobTitleText.includes(" at ")) {
					company = jobTitle.split(" at ")[1]?.trim() || "";
				} else if (jobTitleText.includes(" @ ")) {
					company = jobTitle.split(" @ ")[1]?.trim() || "";
				} else {
					// Try to get from experience section
					company = getTextContent('.experience-item__title') ||
						getTextContent('.pv-entity__secondary-title') ||
						"";
				}

				return {
					full_name: name,
					job_title: jobTitle,
					company: company || "Not specified",
					location: location || "Not specified",
					profile_url: window.location.href,
				};
			});

			// Validate that we got essential data
			if (profileData.full_name && profileData.full_name.length > 0) {
				return profileData;
			} else {
				console.log("Could not extract essential profile data");
				return null;
			}
		} catch (error) {
			console.error(`Error scraping profile ${profileUrl}:`, error);
			return null;
		}
	}

	// Extract profile URLs from search results
	private async extractProfileUrls(page: Page): Promise<string[]> {
		return await page.evaluate(() => {
			const profileLinks: string[] = [];
			
			// Multiple selectors for profile links
			const selectors = [
				'a[href*="/in/"]',
				'.reusable-search__result-container a[href*="/in/"]',
				'.search-result__wrapper a[href*="/in/"]',
				'.entity-result__title-text a[href*="/in/"]',
			];

			for (const selector of selectors) {
				const links = document.querySelectorAll(selector as any) as any;
				links.forEach((link: any) => {
					const href = (link as any).getAttribute?.("href") as string | null || ((link as any).href as string | undefined);
					if (typeof href === 'string' && href.includes('/in/') && !profileLinks.includes(href)) {
						// Clean the URL (remove query parameters)
						const cleanUrl = href.split('?')[0];
						if (cleanUrl) profileLinks.push(cleanUrl);
					}
				});
			}

			return profileLinks;
		});
	}

	// Main scraping function
	async scrapeLinkedInProfiles(
		searchUrl: string,
		maxProfiles = 20,
		sessionCookie?: string,
	): Promise<ScrapingResponse> {
		let page: Page | null = null;

		try {
			if (sessionCookie) {
				this.setSessionCookie(sessionCookie);
			}

			if (!this.sessionCookie) {
				return {
					success: false,
					profiles_count: 0,
					profiles: [],
					message: "LinkedIn session cookie (li_at) is required. Please provide it in the request body as 'session_cookie'.",
				};
			}

			const browser = await this.initBrowser();
			page = await browser.newPage();
			await this.setupPage(page);


			// Check authentication; if failed, try interactive login
			let isAuthenticated = await this.checkAuthentication(page);
			if (!isAuthenticated) {
				// if session cookie was provided but invalid, clear and try manual login
				await this.clear_linkedin_cookies(page);
				const logged_in = await this.promptLogin(page);
				if (!logged_in) {
					return {
						success: false,
						profiles_count: 0,
						profiles: [],
						message:
							"Authentication failed. Provide a valid 'session_cookie' or log in within 2 minutes in the opened browser.",
					};
				}
				isAuthenticated = true;
			}

			console.log("Authentication successful. Starting to scrape profiles...");

			// Navigate to search URL
			await page.goto(searchUrl, {
				waitUntil: "networkidle2",
				timeout: 30000,
			});
			await this.randomDelay(3000, 5000);

			const allProfileUrls: string[] = [];
			let currentPage = 1;
			const maxPages = Math.ceil(maxProfiles / 10);

			// Extract profile URLs from search results
			while (allProfileUrls.length < maxProfiles && currentPage <= maxPages) {
				console.log(`Extracting URLs from page ${currentPage}...`);

				try {
					// Wait for search results
					await page.waitForSelector('[data-chameleon-result-urn]', { timeout: 15000 });
				} catch (error) {
					console.log("No search results found on this page");
					break;
				}

				// Extract profile URLs from current page
				const pageUrls = await this.extractProfileUrls(page);
				allProfileUrls.push(...pageUrls);

				console.log(`Found ${pageUrls.length} profile URLs on page ${currentPage}`);

				// Try to go to next page
				if (allProfileUrls.length < maxProfiles && currentPage < maxPages) {
					try {
						const nextButton = await page.$('button[aria-label="Next"]:not([disabled])');
						if (nextButton) {
							await nextButton.click();
							await this.randomDelay(4000, 7000);
							currentPage++;
						} else {
							console.log("No more pages available");
							break;
						}
					} catch (error) {
						console.log("Error navigating to next page:", error);
						break;
					}
				} else {
					break;
				}
			}

			// Limit URLs to requested number
			const limitedUrls = allProfileUrls.slice(0, maxProfiles);
			console.log(`Total profile URLs found: ${limitedUrls.length}`);

			// Scrape individual profiles
			const scrapedProfiles: LinkedInProfileData[] = [];
			for (let i = 0; i < limitedUrls.length; i++) {
				const profileUrl = limitedUrls[i]!;
				console.log(`Scraping profile ${i + 1}/${limitedUrls.length}: ${profileUrl}`);

				const profileData = await this.scrapeProfileData(page, profileUrl);
				if (profileData) {
					scrapedProfiles.push(profileData);
				}

				// Add delay between profiles
				if (i < limitedUrls.length - 1) {
					await this.randomDelay(5000, 10000);
				}
			}

			// Save to database
			const savedProfiles = await this.saveProfilesToDatabase(scrapedProfiles);

			return {
				success: true,
				profiles_count: savedProfiles.length,
				profiles: savedProfiles,
				message: `Successfully scraped and saved ${savedProfiles.length} profiles`,
			};
		} catch (error) {
			console.error("Error during scraping:", error);
			return {
				success: false,
				profiles_count: 0,
				profiles: [],
				message: `Scraping failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		} finally {
			if (page) {
				await page.close();
			}
		}
	}

	// Save profiles to database with duplicate handling
	private async saveProfilesToDatabase(
		profiles: LinkedInProfileData[],
	): Promise<LinkedInProfileData[]> {
		const savedProfiles: LinkedInProfileData[] = [];

		for (const profile of profiles) {
			try {
				// Check if profile already exists
				const existingProfile = await ProfileModel.findOne({
					profile_url: profile.profile_url,
				});

				if (existingProfile) {
					console.log(`Profile already exists: ${profile.full_name}`);
					savedProfiles.push({
						full_name: existingProfile.full_name,
						job_title: existingProfile.job_title,
						company: existingProfile.company,
						location: existingProfile.location,
						profile_url: existingProfile.profile_url,
						summary: existingProfile.summary,
					});
				} else {
					// Save new profile
					const newProfile = new ProfileModel({
						...profile,
						scraped_at: new Date(),
					});
					const saved = await newProfile.save();
					console.log(`Saved new profile: ${profile.full_name}`);
					savedProfiles.push({
						full_name: saved.full_name,
						job_title: saved.job_title,
						company: saved.company,
						location: saved.location,
						profile_url: saved.profile_url,
						summary: saved.summary,
					});
				}
			} catch (error) {
				console.error(`Error saving profile ${profile.full_name}:`, error);
			}
		}

		return savedProfiles;
	}

	// Search profiles in database
	async searchProfiles(query: ProfileSearchQuery): Promise<LinkedInProfile[]> {
		const filter: any = {};

		if (query.full_name) {
			filter.$text = { $search: query.full_name };
		}

		if (query.company) {
			filter.company = { $regex: query.company, $options: "i" };
		}

		if (query.job_title) {
			filter.job_title = { $regex: query.job_title, $options: "i" };
		}

		if (query.location) {
			filter.location = { $regex: query.location, $options: "i" };
		}

		return await ProfileModel.find(filter)
			.sort({ scraped_at: -1 })
			.limit(query.limit || 20)
			.skip(query.offset || 0);
	}

	// Get all profiles with pagination
	async getAllProfiles(
		limit = 20,
		offset = 0,
	): Promise<{ profiles: LinkedInProfile[]; total: number }> {
		const profiles = await ProfileModel.find()
			.sort({ scraped_at: -1 })
			.limit(limit)
			.skip(offset);

		const total = await ProfileModel.countDocuments();

		return { profiles, total };
	}

	// Close browser when done
	async closeBrowser(): Promise<void> {
		if (this.browser) {
			await this.browser.close();
			this.browser = null;
		}
	}
}

export const ScrapingService = new LinkedInScrapingService();