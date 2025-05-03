# 💬 Saved Quotes App

A production-ready fullstack application to manage saved quotes for products, built with **Next.js** (Frontend, plain CSS) and a **Node.js/Express** backend (Backend, REST API).

---

## 📁 Project Structure

```
quote-management/
│
├── frontend/   # Next.js frontend (React, plain CSS)
├── backend/    # Node.js/Express backend (REST API)
└── README.md   # This file
```

---

## 🚀 End-to-End Setup & Usage

### 1. Clone the Repository

```bash
git clone <repo-url>
cd quote-management
```

### 2. Environment Setup

- **Backend:**
  - Copy `.env.example` to `.env` in the `backend/` folder and set your environment variables (DB connection, JWT secret, etc).
- **Frontend:**
  - If needed, set up environment variables in `frontend/.env.local` (for API URLs, etc).

### 3. Install Dependencies

**Install separately for each part:**

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 4. Run the Application (Development)

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

### 5. Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## ✨ Application Features

### Frontend (Next.js, Plain CSS)
- List view of all saved quotes
- Form to add new quotes (with multiple products per quote)
- Responsive, modern UI
- Authentication (JWT)

### Backend (Node.js/Express)
- REST API for quotes
- PostgreSQL (via Sequelize)
- Quote versioning/history
- Quote expiry logic (14 days, extendable)
- Authentication & authorization
- Modular, clean architecture (Controllers, Services, Repositories)
- Validation (Joi/Zod)
- Error handling
- Soft deletion

---

## 🧹 Remove Unnecessary Files
All legacy files have been moved into `frontend/` or `backend/` for a clean, production-ready structure. Only these two folders and this README should remain at the root (plus your `.git` folder).

---

## 🛠️ Troubleshooting
- Make sure ports 3000 (frontend) and 3001 (backend) are free.
- Check `.env` files for correct configuration.
- For detailed logs, check the terminal output of both servers.

---

## 📣 Contributing
Feel free to fork and open PRs for improvements or bugfixes!

---

## 📄 License
MIT
- Edit existing quotes
- Delete quotes
- Styled with Tailwind CSS

### 🛠️ Backend (Node.js + Express)

- RESTful API with basic CRUD operations
- In-memory data storage (no database)
- JWT authentication stub (placeholder)
- Modular Express setup

---

## 🗂 Project Structure

```plaintext
saved-quotes-app/
├── components/              # Reusable React components
│   └── QuoteForm.tsx
├── pages/                   # Next.js routing
│   ├── _app.tsx
│   ├── index.tsx
│   └── quotes/
│       ├── [id].tsx         # Edit/View quote page
│       └── new.tsx          # Add new quote
├── server/                  # Express backend
│   └── index.js
├── styles/
│   └── globals.css          # Tailwind + global styles
├── types/                   # TypeScript types
│   └── index.ts
├── utils/                   # API interaction helpers
│   └── api.ts
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🧪 Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Auth**: JWT (stub only for now)
- **Storage**: In-memory (no database)

---
