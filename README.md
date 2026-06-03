# Food Connect 🍴

A full-stack recipe app where users can browse official recipes, create and share their own, and get AI-powered cooking help.

## Team
- Danny Zhang
- Lina Gougil
- Sohan Dadana
- Serenity Phillips

## Tech Stack
- **Frontend:** React + Vite, Material UI
- **Backend:** Express / Node.js
- **Database:** Firebase Firestore
- **Recipe API:** DummyJSON
- **AI:** OpenAI GPT-4o-mini

## Features
- Browse official recipes with search, filters (cuisine, meal type, cook time, rating), and pagination
- User authentication (register, sign in, sign out)
- Recipe detail page with ingredients, instructions, and nutrition info
- AI cooking assistant chatbot on each recipe page
- Create and submit recipes for admin review
- Admin panel to approve or reject user-submitted recipes
- My Recipes page to view saved and created recipes
- Protected routes for authenticated users

## Setup Instructions

### Prerequisites
- Node.js v18+
- Firebase project with Firestore and Authentication enabled
- OpenAI API key

### Installation

**Clone the repo:**
```bash
git clone https://github.com/serenren13/recipeApp.git
cd recipeApp
```

**Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```
OPENAI_API_KEY=your_openai_api_key
```

```bash
npm start
```

**Frontend:**
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
npm run dev
```

## API Info
- **DummyJSON Recipes:** `https://dummyjson.com/recipes` — provides official recipe data
- **Backend API:** runs on `http://localhost:5001`
  - `GET /api/recipes/official` — browse recipes with optional `?q=`, `?tag=`, `?mealType=`
  - `GET /api/recipes/official/:id` — get single recipe
  - `GET /api/recipes/official/tags` — get all tags
  - `GET /api/recipes/official/cuisines` — get cuisine tags
  - `POST /api/ai/chat` — AI cooking assistant

## Git Workflow
- Feature branches + PRs with review before merging
- Conventional Commits format
- Rebase over merge when updating feature branches