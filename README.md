# Food Connect 🍴

> **Food Connect** is a full-stack recipe app where users can browse official recipes, create and share their own, and get AI-powered cooking help.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Installation](#installation)
- [External Setup](#external-setup)
  - [Firebase Configuration](#firebase-configuration)
  - [OpenAI Configuration](#openai-configuration)
- [How to Use](#how-to-use)
- [API Info](#api-info)
- [Feature Status](#feature-status)
- [Credits](#credits)
- [Project Resources](#project-resources)

---

## Project Description

Food Connect is a full-stack web application built with **React**, **Express**, and **Firebase** that brings recipes and community together in one place. The platform enables users to:

- **Browse official recipes**: Search and filter thousands of recipes from DummyJSON by cuisine, meal type, cook time, and rating
- **Create and share**: Submit your own recipes for admin review and share them with the community
- **Get AI cooking help**: Chat with an AI assistant on any recipe page for tips, substitutions, and guidance
- **Manage your collection**: Save recipes and revisit your created and saved recipes from one place
- **Admin moderation**: Approve or reject user-submitted recipes through a dedicated admin panel

---

## Features

### Core Functionality

**User Authentication & Profiles**
- Register, sign in, and sign out via Firebase Authentication
- Protected routes for authenticated users only

**Recipe Browsing**
- Browse official recipes powered by the DummyJSON API
- Search by keyword, filter by cuisine, meal type, cook time, and rating
- Paginated results for smooth browsing

**Recipe Detail**
- Full recipe info: ingredients, instructions, and nutrition
- AI cooking assistant chatbot on every recipe page
- Save recipes directly from the detail page

**User Recipes**
- Create and submit recipes for admin review
- My Recipes page to toggle between saved and created recipes
- Edit or delete your own created recipes, remove saved ones

**Admin Panel**
- Dedicated admin account with access to a review queue
- Approve or reject user-submitted recipes before they go live

**Design & UX**
- Fully responsive design
- Clean UI built with Material UI and a custom dark teal / yellow theme

---

## Installation

### Prerequisites

- Node.js v18+
- npm or yarn
- Git
- A Firebase project with Firestore and Authentication enabled
- An OpenAI API key

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/serenren13/recipeApp.git
   cd recipeApp
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Return to root directory**
   ```bash
   cd ..
   ```

---

## External Setup

### Firebase Configuration

1. **Create a Firebase Project**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enable **Firestore** and **Authentication** (Email/Password provider)

2. **Get Firebase Credentials**
   - Go to Project Settings → General → Your apps → Web app
   - Register an app to receive your Firebase config object

3. **Store Credentials**
   - Add each value to your frontend `.env` file (see Environment Variables below)

### OpenAI Configuration

1. **Create an OpenAI Account**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Log in or create an account

2. **Generate an API Key**
   - Go to API Keys → Create new secret key
   - Copy and store it securely — it won't be shown again

3. **Store Credentials**
   - Add the key to your backend `.env` file (see Environment Variables below)

### Environment Variables

#### Backend (`backend/.env`)
```
OPENAI_API_KEY=your_openai_api_key
```

#### Frontend (`frontend/.env`)

> **Note:** All frontend environment variables must be prefixed with `VITE_` or Vite will silently ignore them.

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

---

## How to Use

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:5001`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on `http://localhost:5173`

3. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Register or sign in to explore the app

---

## API Info

- **DummyJSON Recipes:** `https://dummyjson.com/recipes` — official recipe data source
- **Backend API:** runs on `http://localhost:5001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes/official` | Browse recipes — supports `?q=`, `?tag=`, `?mealType=` |
| GET | `/api/recipes/official/tags` | Get all tags |
| GET | `/api/recipes/official/cuisines` | Get cuisine tags |
| GET | `/api/recipes/official/:id` | Get a single recipe by ID |
| POST | `/api/ai/chat` | AI cooking assistant |

> **Note:** `/tags` and `/cuisines` are listed before `/:id` intentionally — Express matches routes top-to-bottom, so literal paths must be registered first.

---

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| **User Authentication** | ✅ Complete | Firebase Email/Password auth |
| **Protected Routes** | ✅ Complete | Auth-gated pages |
| **Browse Official Recipes** | ✅ Complete | Powered by DummyJSON API |
| **Search & Filters** | ✅ Complete | Cuisine, meal type, cook time, rating |
| **Pagination** | ✅ Complete | Paginated recipe results |
| **Recipe Detail Page** | ✅ Complete | Ingredients, instructions, nutrition |
| **AI Cooking Assistant** | ✅ Complete | GPT-4o-mini chatbot per recipe |
| **Save Recipes** | ✅ Complete | Save to Firebase, view in My Recipes |
| **Create Recipe** | ✅ Complete | Submit for admin review |
| **My Recipes Page** | ✅ Complete | Toggle saved vs. created, edit/delete |
| **Admin Panel** | ✅ Complete | Approve or reject submitted recipes |

---

## Credits

**Development Team**
- Built as part of Launch's Bootcamp — Week 3 Group Project
- Danny Zhang, Lina Gougil, Sohan Dadana, and Serenity Phillips

**Technologies & Libraries**
- [DummyJSON](https://dummyjson.com/) — Recipe API
- [Firebase](https://firebase.google.com/) — Auth + Firestore
- [OpenAI API](https://platform.openai.com/docs) — AI cooking assistant
- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [Material UI](https://mui.com/)
- [Vite](https://vitejs.dev/)

**Design Resources**
- [Figma Mockups](https://www.figma.com/design/Za6iEGnW9MDB1Zy5SDiOcm/Week3-Project)

---

## Project Resources

- [GitHub Repo](https://github.com/serenren13/recipeApp)
- [Trello Board](#) *(add link)*
- [Full Assignment Details](#) *(add link)*

---

## License

This project is part of the Launch Bootcamp and is provided as-is for educational and demonstration purposes.
