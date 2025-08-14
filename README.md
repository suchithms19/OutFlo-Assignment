# OutFlo - Campaign Management & LinkedIn Outreach Platform

A modern full-stack application for managing marketing campaigns and automating LinkedIn outreach with AI-powered personalized messaging.

## 🚀 Features

- **Campaign Management**: Create, edit, and track marketing campaigns
- **AI-Powered Messaging**: Generate personalized LinkedIn messages using Google Gemini AI
- **LinkedIn Profile Scraping**: Automated profile data extraction 
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
API_BASE_URL=your-api
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

