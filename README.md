# 🚗 Pride Auto Store

> Production-ready full-stack website for **Pride Auto Store** — a premier automobile spare parts shop in Coimbatore, Tamil Nadu, India.

[![CI](https://github.com/EnochEesa/PRIDE_AUTO_STORE/actions/workflows/ci.yml/badge.svg)](https://github.com/EnochEesa/PRIDE_AUTO_STORE/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌐 Live Demo
- **Frontend:** [prideautostore.vercel.app](https://prideautostore.vercel.app) *(coming soon)*
- **API:** [pride-auto-api.onrender.com](https://pride-auto-api.onrender.com) *(coming soon)*

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas (free tier) |
| Auth | JWT + bcrypt |
| Image CDN | Cloudinary |
| Hosting | Vercel (frontend) + Render (backend) |
| CI/CD | GitHub Actions |
| Containerisation | Docker + Docker Compose |
| Live Chat | Tawk.to |

---

## 🗂️ Project Structure

```
PRIDE_AUTO_STORE/
├── frontend/               # Next.js 14 App Router
│   ├── src/app/            # Pages: Home, About, Products, Contact, Cart
│   ├── src/components/     # Navbar, Hero, Footer, ProductCard, etc.
│   └── src/context/        # AuthContext, CartContext
├── backend/                # Node.js + Express REST API
│   └── src/
│       ├── config/         # DB, logger, env validation
│       ├── controllers/    # Products, Inquiries, Admin
│       ├── middleware/      # Auth, rate limiter
│       ├── models/         # Mongoose schemas (Product, Inquiry, Admin)
│       └── routes/         # API routes
├── .github/workflows/      # CI/CD pipeline
└── docker-compose.yml      # Local dev orchestration
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Git
- MongoDB Atlas account (free) or local MongoDB

### 1. Clone the repo
```bash
git clone https://github.com/EnochEesa/PRIDE_AUTO_STORE.git
cd PRIDE_AUTO_STORE
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env        # Fill in your values
npm install
npm run dev                  # Runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env.local  # Fill in your values
npm install
npm run dev                  # Runs on http://localhost:3000
```

### 4. Or run with Docker
```bash
cp backend/.env.example backend/.env   # Fill in values
docker compose up --build
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | 64-char random string for JWT signing |
| `FRONTEND_URL` | Your Vercel URL (for CORS) |
| `EMAIL_USER` | Gmail address for notifications |
| `EMAIL_PASS` | Gmail App Password (not your real password) |
| `ADMIN_EMAIL` | Where to receive inquiry notifications |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Your Render API URL |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| GET | `/api/products` | — | List products (filterable) |
| GET | `/api/products/:slug` | — | Get single product |
| POST | `/api/products` | Admin JWT | Create product |
| PUT | `/api/products/:id` | Admin JWT | Update product |
| DELETE | `/api/products/:id` | Admin JWT | Delete product |
| POST | `/api/inquiries` | — | Submit inquiry |
| GET | `/api/inquiries` | Admin JWT | List inquiries |
| POST | `/api/admin/login` | — | Admin login |

---

## 🚢 Deployment

### Free-tier stack (₹0/month)
1. **MongoDB Atlas** → cloud.mongodb.com → Free M0 cluster (Mumbai)
2. **Render** → render.com → Web Service → connect GitHub repo → `/backend`
3. **Vercel** → vercel.com → Import repo → root dir: `frontend`

See [SETUP.md](SETUP.md) for step-by-step deployment instructions.

---

## 🔒 Security Features
- Helmet.js security headers
- CORS whitelisting
- Rate limiting (100 req/15min global, 5 inquiries/hour)
- express-mongo-sanitize (NoSQL injection protection)
- JWT authentication for admin routes
- bcrypt password hashing (12 rounds)
- Input validation on all POST routes
- Environment secrets via GitHub Secrets

---

## 📍 Business Info
- **Name:** Pride Auto Store
- **Address:** 9/23, Grey Town, Opposite Nehru Stadium Road, Coimbatore – 641014
- **Phone:** 0422-4392481
- **Hours:** Mon–Sat, 10:00 AM – 8:00 PM
- **Instagram:** [@fiat_padmini_](https://www.instagram.com/fiat_padmini_/)

---

## 📄 License
MIT © 2024 Pride Auto Store
