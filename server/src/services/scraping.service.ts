// @ts-ignore - playwright types are included with the package
import { chromium, type Browser, type Page } from "playwright";
import { LinkedInProfileModel } from "../models/linkedinProfile.model.js";
import type {
	LinkedInProfile,
	LinkedInProfileData,
	ScrapingResponse,
	GetProfilesRequest,
	GetProfilesResponse,
} from "../interfaces/scraping.interface.js";

const scrapeLinkedInProfiles = async (
	searchUrl: string,
	numProfiles: number,
): Promise<ScrapingResponse> => {

	console.log("Starting LinkedIn scraper...");

	const browser: Browser = await chromium.launch({
		headless: false, 
		slowMo: 150, 
		args: ["--disable-blink-features=AutomationControlled", "--no-sandbox"],
	});

	const context = await browser.newContext({
		viewport: { width: 1280, height: 720 },
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
	});

	await context.route("**/*.{png,jpg,jpeg,svg,gif,webp,woff,woff2}", (route: any) =>
		route.abort(),
	);

	const page: Page = await context.newPage();
	const scrapedProfiles: LinkedInProfileData[] = [];

	try {
		console.log("Navigating to LinkedIn login page...");
		await page.goto("https://www.linkedin.com/login", {
			waitUntil: "domcontentloaded",
			timeout: 30000,
		});
		await page.waitForTimeout(3000 + Math.random() * 2000); 

		console.log("Please log in manually within 60 seconds...");
		try {
			await Promise.race([
				page.waitForSelector(".global-nav__me", { timeout: 60000 }),
				page.waitForSelector(".search-global-typeahead__input", {
					timeout: 60000,
				}),
			]);
			console.log("Logged in successfully!");
			await page.waitForTimeout(2000 + Math.random() * 3000); 
		} catch (err) {
			console.warn(
				"Login selector not found. Proceeding, but scraping may fail if not logged in.",
			);
		}

		console.log(`Navigating to search URL: ${searchUrl}`);

		let searchResultsLoaded = false;
		for (let attempt = 1; attempt <= 3; attempt++) {
			console.log(`Attempt ${attempt}: Loading search results...`);
			try {
				await page.goto(searchUrl, {
					waitUntil: "domcontentloaded",
					timeout: 30000,
				});

				await Promise.race([
					page.waitForSelector(".reusable-search__result-container", {
						timeout: 30000,
					}),
					page.waitForSelector(".search-results-container", { timeout: 30000 }),
					page.waitForSelector(".entity-result", { timeout: 30000 }),
					page.waitForSelector('a[href*="/in/"]', { timeout: 30000 }),
				]);
				console.log("Search results loaded successfully!");
				searchResultsLoaded = true;
				break;
			} catch (err) {
				console.error(`Attempt ${attempt} failed:`, err);
				if (attempt < 3) {
					console.log("Retrying after 5 seconds...");
					await page.waitForTimeout(5000);
				}
			}
		}

		if (!searchResultsLoaded) {
			throw new Error("Failed to load search results after 3 attempts");
		}

		let profileLinks: string[] = [];
		const uniqueFinalUrls = new Set<string>();
		console.log("Attempting to extract profile links...");

		let currentPage = 1;
		const maxPages = 5; 

		while (profileLinks.length < numProfiles && currentPage <= maxPages) {
			console.log(`Processing search results page ${currentPage}...`);

			const pageSearchUrl = `${searchUrl}${
				searchUrl.includes("?") ? "&" : "?"
			}page=${currentPage}`;
			console.log(`Navigating to: ${pageSearchUrl}`);
			await page.goto(pageSearchUrl, {
				waitUntil: "domcontentloaded",
				timeout: 30000,
			});

			try {
				await Promise.race([
					page.waitForSelector(".reusable-search__result-container", {
						timeout: 30000,
					}),
					page.waitForSelector(".search-results-container", { timeout: 30000 }),
					page.waitForSelector(".entity-result", { timeout: 30000 }),
					page.waitForSelector('a[href*="/in/"]', { timeout: 30000 }),
				]);
				console.log(`Search results loaded for page ${currentPage}`);
			} catch (err) {
				console.error(
					`Failed to load search results for page ${currentPage}:`,
					err,
				);
				break;
			}

			console.log(`Scrolling page ${currentPage} to load more results...`);
			let previousHeight = await page.evaluate(() => document.body.scrollHeight);
			for (let i = 0; i < 3; i++) {
				await page.evaluate(() =>
					window.scrollTo(0, document.body.scrollHeight),
				);
				await page.waitForTimeout(3000 + Math.random() * 3000); 
				const newHeight = await page.evaluate(
					() => document.body.scrollHeight,
				);
				if (newHeight === previousHeight) break; 
				previousHeight = newHeight;
			}

			const potentialLinks = await page.$$eval(
				'a[href*="/in/"], a.app-aware-link[href*="/in/"], a.search-result__result-link[href*="/in/"], .entity-result__title-link[href*="/in/"], .entity-result__title-text a[href*="/in/"], .reusable-search__result-container a[href*="/in/"]',
				(links: any[]) =>
					links
						.map((link: any) => link.getAttribute("href"))
						.filter(
							(href: any): href is string =>
								!!href &&
								href.includes("/in/") &&
								!href.includes("/company/") &&
								!href.match(/\/in\/ACo[A-Za-z0-9_-]{10,}/),
						),
			);
			console.log(
				`Found ${potentialLinks.length} potential links on page ${currentPage}:`,
				potentialLinks,
			);

			for (const link of potentialLinks) {
				if (profileLinks.length >= numProfiles) break;

				try {
					console.log(`Checking URL: ${link}`);
					await page.goto(link, {
						waitUntil: "domcontentloaded",
						timeout: 30000,
					});
					const finalUrl = page.url().split("?")[0]?.replace(/\/$/, "") || "";
					console.log(`Final URL after redirect: ${finalUrl}`);

					if (finalUrl.match(/\/in\/ACo[A-Za-z0-9_-]{10,}/)) {
						console.log(`Skipping member ID URL: ${finalUrl}`);
						continue;
					}
					if (uniqueFinalUrls.has(finalUrl)) {
						console.log(`Skipping duplicate final URL: ${finalUrl}`);
						continue;
					}

					uniqueFinalUrls.add(finalUrl);
					profileLinks.push(finalUrl);
					console.log(`Added unique profile link: ${finalUrl}`);

					await page.waitForTimeout(3000 + Math.random() * 4000);
				} catch (err) {
					console.error(`Failed to check URL ${link}:`, err);
					continue;
				}
			}

			console.log(
				`Total unique profile links after page ${currentPage}: ${profileLinks.length}`,
			);
			currentPage++;
			await page.waitForTimeout(5000 + Math.random() * 5000); 
		}

		await page.goto(searchUrl, {
			waitUntil: "domcontentloaded",
			timeout: 30000,
		});
		await page.waitForTimeout(3000 + Math.random() * 3000); 
		if (profileLinks.length === 0) {
			throw new Error("No unique profile links found after checking redirects");
		}

		console.log(
			`Scraping ${profileLinks.length} unique profile links:`,
			profileLinks,
		);

		const scrapedUrls = new Set<string>();

		for (let i = 0; i < Math.min(profileLinks.length, numProfiles); i++) {
			let profileUrl = profileLinks[i];
			if (!profileUrl) continue;
			console.log(`[${i + 1}/${numProfiles}] Scraping: ${profileUrl}`);

			try {
				let profileLoaded = false;
				for (let attempt = 1; attempt <= 3; attempt++) {
					console.log(`Attempt ${attempt}: Loading profile page...`);
					try {
						await page.goto(profileUrl, {
							waitUntil: "domcontentloaded",
							timeout: 30000,
						});

						const finalUrl = page.url().split("?")[0]?.replace(/\/$/, "") || "";
						if (finalUrl !== profileUrl) {
							console.log(`Redirect detected: ${profileUrl} -> ${finalUrl}`);
							profileUrl = finalUrl;
						}

						if (profileUrl && scrapedUrls.has(profileUrl)) {
							console.log(`Profile ${profileUrl} already scraped, skipping...`);
							break;
						}

						try {
							await page.waitForSelector("h1", { timeout: 30000 });
							console.log("Profile name (h1) found!");
							profileLoaded = true;
							break;
						} catch (err) {
							console.warn(
								"Selector wait failed, attempting to scrape without waiting...",
							);
							profileLoaded = true;
							break;
						}
					} catch (err) {
						console.error(`Attempt ${attempt} failed to load profile:`, err);
						if (attempt < 3) {
							console.log("Retrying after 5–10 seconds...");
							await page.waitForTimeout(5000 + Math.random() * 5000);
						}
					}
				}

				if (!profileLoaded) {
					throw new Error("Failed to load profile page after 3 retries");
				}

				if (!profileUrl || scrapedUrls.has(profileUrl)) {
					continue;
				}

				scrapedUrls.add(profileUrl);

				await page.evaluate(() => {
					window.scrollBy(0, 500); 
				});
				await page.waitForTimeout(2000 + Math.random() * 3000); 

				await page.waitForTimeout(3000 + Math.random() * 4000); 

				const profileData = await page.evaluate(() => {
					// Name
					const nameElement =
						document.querySelector("h1") ||
						document.querySelector(".pv-text-details__left-column h1");
					const name = nameElement?.textContent?.trim() || "Unknown";

					// Job Title
					const jobTitleElement =
						document.querySelector(".pv-text-details__title") ||
						document.querySelector(".text-body-medium") ||
						document.querySelector(".top-card-layout__headline") ||
						document.querySelector('div[class*="headline"]');
					const jobTitle = jobTitleElement?.textContent?.trim() || "Unknown";

					// Company
					const companyElement =
						document.querySelector(
							'span.t-14.t-normal:not([class*="pvs-entity__caption-wrapper"]):not([class*="location"])',
						) ||
						document.querySelector(
							'div[class*="pv-entity"] span:not([class*="pvs-entity__caption-wrapper"])',
						) ||
						document.querySelector(".pv-entity__company-details span") ||
						document.querySelector('div[class*="experience"] span');
					let company = companyElement?.textContent?.trim() || "Unknown";
					if (company && company.includes("·")) {
						company = company.split("·")[0]?.trim() || "Unknown";
					}
					company = [...new Set(company.split(/(?=[A-Z])/))]
						.join("")
						.replace(/(.)\1+/g, "$1")
						.trim();

					// Location
					const locationElement =
						document.querySelector(
							"span.text-body-small.inline.t-black--light.break-words",
						) ||
						document.querySelector(
							'div[class*="pv-text-details"] span:not([class*="distance-badge"]):last-child',
						) ||
						document.querySelector(
							'.top-card-layout__entity-info span:not([class*="distance-badge"]):last-child',
						) ||
						document.querySelector('span[class*="location"]');
					const location = locationElement?.textContent?.trim() || "Unknown";

					return { name, jobTitle, company, location };
				});

				console.log("Scraped data:", profileData);
				console.log("Profile URL to save:", profileUrl);

				if (!profileUrl || profileUrl.trim() === '') {
					console.error("❌ Invalid profileUrl, skipping save:", profileUrl);
					continue;
				}

				const profileDataToSave: LinkedInProfileData = {
					name: profileData.name,
					jobTitle: profileData.jobTitle,
					company: profileData.company,
					location: profileData.location,
					profileUrl: profileUrl.trim(),
					scrapedAt: new Date(),
				};

				try {
					const existingProfile = await LinkedInProfileModel.findOne({
						profileUrl: profileUrl.trim(),
					});

					if (!existingProfile) {
						const profile = new LinkedInProfileModel(profileDataToSave);
						await profile.save();
						scrapedProfiles.push(profileDataToSave);
						console.log(`✅ Saved profile: ${profileData.name}`);
					} else {
						console.log(
							`Profile ${profileUrl.trim()} already exists in database, skipping save`,
						);
						scrapedProfiles.push(profileDataToSave);
					}
				} catch (saveError) {
					console.error("Failed to save profile:", saveError);
				}

				await page.waitForTimeout(5000 + Math.random() * 5000);
			} catch (profileError) {
				console.error(`❌ Failed to scrape profile ${profileUrl}:`, profileError);
				continue;
			}
		}

		console.log("🎉 Scraping completed successfully!");

		return {
			message: "LinkedIn profiles scraped successfully",
			profilesScraped: scrapedProfiles.length,
			profiles: scrapedProfiles,
		};
	} catch (error) {
		console.error("💥 Error during scraping:", error);
		throw error;
	} finally {
		console.log("Cleaning up...");
		await browser.close();
		console.log("Scraper finished.");
	}
};

const getAllProfiles = async (
	request: GetProfilesRequest,
): Promise<GetProfilesResponse> => {
	const { page = 1, limit = 10, company, location } = request;
	const skip = (page - 1) * limit;

	const filter: any = {};
	if (company) {
		filter.company = { $regex: company, $options: "i" };
	}
	if (location) {
		filter.location = { $regex: location, $options: "i" };
	}

	const total = await LinkedInProfileModel.countDocuments(filter);

	const profiles = await LinkedInProfileModel.find(filter)
		.sort({ created_at: -1 })
		.skip(skip)
		.limit(limit);

	const pages = Math.ceil(total / limit);

	return {
		profiles,
		total,
		page,
		pages,
		limit,
	};
};

const getProfileById = async (id: string): Promise<LinkedInProfile | null> => {
	return await LinkedInProfileModel.findById(id);
};

const deleteProfile = async (id: string): Promise<LinkedInProfile | null> => {
	return await LinkedInProfileModel.findByIdAndDelete(id);
};

const deleteAllProfiles = async (): Promise<{ deletedCount: number }> => {
	const result = await LinkedInProfileModel.deleteMany({});
	return { deletedCount: result.deletedCount || 0 };
};

const cleanupInvalidProfiles = async (): Promise<{ deletedCount: number }> => {
	const result = await LinkedInProfileModel.deleteMany({
		$or: [
			{ profileUrl: null },
			{ profileUrl: "" },
			{ profileUrl: { $exists: false } }
		]
	});
	return { deletedCount: result.deletedCount || 0 };
};

export const ScrapingService = {
	scrapeLinkedInProfiles,
	getAllProfiles,
	getProfileById,
	deleteProfile,
	deleteAllProfiles,
	cleanupInvalidProfiles,
};
