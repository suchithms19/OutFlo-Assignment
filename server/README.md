# OutFlo Campaign Management API

A backend API for managing campaigns and generating personalized LinkedIn messages using Google Gemini AI.

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create `.env` file with:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/outflo
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Start the server:
```bash
bun run dev
```

## API Endpoints

### Campaign Management

- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Soft delete campaign

### LinkedIn Message Generation

- `POST /api/personalized-message` - Generate personalized message

### LinkedIn Profile Scraping (Bonus Feature)

- `POST /api/profiles/scrape` - Scrape LinkedIn profiles from search URL
- `GET /api/profiles` - Get all scraped profiles with pagination
- `GET /api/profiles/search` - Search profiles by company, job title, etc.
- `GET /api/profiles/stats` - Get profile statistics
- `GET /api/profiles/:id` - Get specific profile by ID
- `DELETE /api/profiles/:id` - Delete profile
- `POST /api/profiles/cleanup` - Cleanup browser resources

## Example Usage

### Scrape LinkedIn Profiles
```json
POST /api/profiles/scrape
{
  "search_url": "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER&sid=z%40k&titleFreeText=Founder",
  "max_profiles": 20,
  "session_cookie": "your_linkedin_li_at_cookie_value"
}
```

### Search Scraped Profiles
```json
GET /api/profiles/search?company=TechCorp&job_title=Engineer&limit=10
```

## Important Notes for LinkedIn Scraping

### How to Get Your LinkedIn Session Cookie (li_at):

1. **Log into LinkedIn** in your browser
2. **Open Developer Tools** (F12 or Right-click → Inspect)
3. **Go to Application tab** → Storage → Cookies → https://www.linkedin.com
4. **Find the `li_at` cookie** and copy its value
5. **Use this value** as the `session_cookie` in your API requests

### Important Guidelines:

1. **Authentication Required**: LinkedIn session cookie (`li_at`) is mandatory for scraping
2. **Rate Limiting**: Built-in delays (2-10 seconds) to avoid detection
3. **Local Use Only**: Designed for local development and testing
4. **Compliance**: Ensure you comply with LinkedIn's Terms of Service
5. **Browser Cleanup**: Use the cleanup endpoint to close browser instances
6. **Cookie Security**: Keep your session cookie secure and don't share it

## Technical Implementation

- **Puppeteer**: For web scraping with stealth settings
- **MongoDB**: Stores scraped profiles with duplicate detection
- **Rate Limiting**: Built-in delays and human-like behavior simulation
- **Error Handling**: Comprehensive error handling for network issues and page changes

