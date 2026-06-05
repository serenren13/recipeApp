# Food Connect 🍴

> **Food Connect** is a full-stack recipe app where users can browse official recipes,
> create and share their own, and get AI-powered cooking help.

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

Food Connect is a full-stack web application built with **React**, **Express**, and
**Firebase** that brings recipes and community together in one place. The platform
enables users to:

- **Browse official recipes**: Search and filter thousands of recipes from DummyJSON
  by cuisine, meal type, cook time, and rating
- **Create and share**: Submit your own recipes for admin review and share them with
  the community
- **Get AI cooking help**: Chat with an AI assistant on any recipe page for tips,
  substitutions, and guidance
- **Manage your collection**: Save recipes and revisit your created and saved recipes
  from one place
- **Admin moderation**: Approve or reject user-submitted recipes through a dedicated
  admin panel

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
