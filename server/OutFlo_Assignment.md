
## Assignment Overview
The task will test your ability to:

- Perform **CRUD** operations in the backend.
- Use **AI tools** for the frontend.
- Implement **web scraping**.

### You will build a campaign management system that allows users to:
1. **Create, Update, Delete, and View Campaigns** via REST APIs.  
2. **Generate personalized outreach messages** from LinkedIn profile data.  
3. **Develop a Simple UI** for managing campaigns and generating messages.

---

## Backend (Node.js + Express + TypeScript + MongoDB/SQL)

### 1. Campaign CRUD APIs
- API routes to manage campaigns in MongoDB.
- Status updates allowed: **ACTIVE** or **INACTIVE**.
- Deleted campaigns remain in DB but hidden.

### 2. LinkedIn Personalized Message API
- Accept profile data: `name`, `job_title`, `company`, `location`, `summary`.
- Use AI API (OpenAI, Claude, DeepSeek, LlamaIndex).
- Return generated outreach message.

---

### API Specifications

#### Campaign fields
- `name`
- `description`
- `status` (Active, Inactive, Deleted)
- `leads` (Array of LinkedIn URLs)
- `accountIDs` (Array of MongoDB ObjectIDs)

#### Campaign APIs

| Method | Endpoint           | Description                               |
|--------|--------------------|-------------------------------------------|
| GET    | `/campaigns`       | Fetch all campaigns (excluding DELETED)   |
| GET    | `/campaigns/:id`   | Fetch a single campaign by ID              |
| POST   | `/campaigns`       | Create a new campaign                      |
| PUT    | `/campaigns/:id`   | Update campaign details                    |
| DELETE | `/campaigns/:id`   | Soft delete (status = DELETED)             |

**Example Campaign**
```json
{
  "name": "Campaign 1",
  "description": "this is a campaign to find leads",
  "status": "active",
  "leads": [
    "https://linkedin.com/in/profile-1",
    "https://linkedin.com/in/profile-2",
    "https://linkedin.com/in/profile-3"
  ],
  "accountIDs": ["123", "456"]
}
```

---

#### LinkedIn Message API
| Method | Endpoint                  | Description                                |
|--------|---------------------------|--------------------------------------------|
| POST   | `/personalized-message`    | Takes LinkedIn profile data & returns message |

**Example Payload:**
```json
{
  "name": "John Doe",
  "job_title": "Software Engineer",
  "company": "TechCorp",
  "location": "San Francisco, CA",
  "summary": "Experienced in AI & ML..."
}
```

**Example Response:**
```json
{
  "message": "Hey John, I see you are working as a Software Engineer at TechCorp. Outflo can help automate your outreach to increase meetings & sales. Let's connect!"
}
```

---

## Frontend (React + TypeScript)

1. **Campaign Management UI**
   - Dashboard listing campaigns.
   - Forms to create/edit/delete.
   - Toggle ACTIVE/INACTIVE.

2. **LinkedIn Message Generator UI**
   - Form to input profile fields.
   - Display AI-generated message.
   - Editable sample input for testing.

💡 **Tip:** You can use V0.dev, Lovable, or Bolt for rapid UI development.  
No paid features allowed.

---

## Evaluation Criteria
- Backend: REST API design, Express, MongoDB modeling.
- Frontend: TypeScript, API integration, responsive design, AI message generation.
- Deployment: Render / Vercel / Netlify.

---

## Deliverables
1. **GitHub Repository** – Public, named `OutFlo-Assignment`.
2. **Deployment Link** – Fully working on Vercel/Render/Netlify.

Submit via provided Google Form:  
[Submit Assignment](https://docs.google.com/forms/d/e/1FAIpQLSdD5M-54NPpPqxM0utNXPoAY0-HNGE0tXtrE0iQOlF_-0tLnQ/viewform)

---

## Bonus Task – LinkedIn Profile Scraping & UI Integration

**Objective:**  
Scrape LinkedIn profiles from a search URL, store in MongoDB, integrate into UI.

**Steps:**
1. **Local Scraping**
   - Scrape at least 20 profiles from given search URL.
   - Extract: Name, Job Title, Company, Location, Profile URL.
   - Respect LinkedIn rate limits.

2. **Tech Stack**
   - Playwright, Selenium, Puppeteer, free APIs, or other.

3. **Deployment**
   - Scraping runs locally with your LinkedIn account.

4. **UI Integration**
   - Store scraped data in MongoDB.
   - UI: Search leads via LinkedIn URL, fetch stored profiles, display results.

5. **Submission**
   - Loom video showing scraping & UI.
   - Code in GitHub repo.

---

