# OutFlo - Campaign Management & LinkedIn Outreach Platform

A modern full-stack application for managing marketing campaigns and automating LinkedIn outreach with AI-powered personalized messaging.

## 🚀 Features

- **Campaign Management**: Create, edit, and track marketing campaigns
- **AI-Powered Messaging**: Generate personalized LinkedIn messages using Google Gemini AI
- **LinkedIn Profile Scraping**: Automated profile data extraction (Bonus Feature)
- **Real-time Dashboard**: Monitor campaign performance and analytics
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for build tooling

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- Google Gemini AI integration
- Playwright for web scraping

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Bun package manager
- Google Gemini API key

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd outflo
```

### 2. Backend Setup
```bash
cd server
bun install
cp env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/outflo
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
cp env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_BASE_URL=your-api
```

## 🚀 Running the Application

### Start Backend
```bash
cd server
bun run dev
```

### Start Frontend
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📚 API Documentation

API endpoints are documented in the Postman collection located at:
`server/src/docs/OutFlo_API.postman_collection.json`

### Core Endpoints

- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/personalized-message` - Generate AI message
- `POST /api/scraping/scrape` - Scrape LinkedIn profiles (Bonus)

