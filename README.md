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

