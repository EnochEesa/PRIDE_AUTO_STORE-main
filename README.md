# 🚗 Pride Auto Store

> Production-ready full-stack e-commerce platform for **Pride Auto Store** — a premier automobile spare parts supplier.

[![CI](https://github.com/EnochEesa/PRIDE_AUTO_STORE/actions/workflows/ci.yml/badge.svg)](https://github.com/EnochEesa/PRIDE_AUTO_STORE/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌐 Live Demo
- **Frontend / Customer Portal:** [pride-auto-store.vercel.app](https://pride-auto-store.vercel.app) *(live)*
- **API Backend:** [pride-auto-api.onrender.com](https://pride-auto-api.onrender.com) *(live)*

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas (free tier) |
| Auth & Security | JWT Auth, Google Auth Library, Snyk SAST |
| Containerisation | Docker, Docker Compose |
| Orchestration | Kubernetes (K8s) deployment manifests |
| CI/CD | GitHub Actions, Trivy Image Scanning |

---

## 🗂️ Project Structure

```text
PRIDE_AUTO_STORE/
├── frontend/               # Next.js 15 App Router React frontend
├── backend/                # Node.js + Express REST API
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       └── routes/
├── k8s-*.yaml              # Kubernetes Deployment & Service Manifests
├── docker-compose.yml      # Local dev orchestration
└── .github/workflows/      # Automated deployment & CI pipelines
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Docker Desktop (optional for local infra)
- MongoDB Atlas URI

### Standard Local Run
1. **Clone the repo**
   ```bash
   git clone https://github.com/EnochEesa/PRIDE_AUTO_STORE-main.git
   cd PRIDE_AUTO_STORE-main
   ```

2. **Backend Services**
   ```bash
   cd backend
   cp .env.example .env        # Set your MongoDB URI
   npm install
   npm run dev                  # http://localhost:5000
   ```

3. **Frontend Application**
   ```bash
   cd frontend
   cp .env.example .env.local  # Set your API endpoints
   npm install
   npm run dev                  # http://localhost:3000
   ```

### Docker Compose Run
```bash
docker compose up --build
```

---

## 🚢 Infrastructure & Deployment

The infrastructure has been heavily hardened and configured for scalable container orchestration.

### Kubernetes Deployment
Production workloads are configured via Kubernetes manifests enforcing high-UID non-root security contexts (`runAsUser: 10000`) for immutable production environments.

To deploy to an existing cluster:
```bash
kubectl apply -f k8s-backend.yaml
kubectl apply -f k8s-frontend.yaml
kubectl apply -f k8s-pdb.yaml
```

### Automated CI/CD
Deployments are handled autonomously by GitHub Actions (`.github/workflows/deploy.yml`):
1. **Source Tracking:** Changes pushed to `main` trigger the pipeline.
2. **Container Build & Registry:** Images are built and strictly versioned to GHCR.
3. **Vulnerability Scanning:** Aquasecurity Trivy scans images for HIGH/CRITICAL CVEs before release.
4. **Platform Webhooks:** Successful builds ping Vercel & Render via Webhook secrets for zero-downtime cutovers.

---

## 🔒 Security Posture & Standards

Security is implemented natively throughout the SDLC:
- **Application Routing:** Helmet.js & CORS whitelisting prevent execution attacks.
- **Data Sanitization:** `express-mongo-sanitize` guarantees absolute query safety.
- **Code Hardening:** Automated Snyk SAST testing governs hardcoded tokens, secret sprawl, and package constraints globally.
- **Orchestration Checks:** Pod definitions explicitly drop all capabilities and govern root-access limits.

---

## 📍 Business Info
- **Name:** Pride Auto Store
- **Location:** Coimbatore, Tamil Nadu, India
- **Socials:** [@fiat_padmini_](https://www.instagram.com/fiat_padmini_/)

---

## 📄 License
MIT © Pride Auto Store
