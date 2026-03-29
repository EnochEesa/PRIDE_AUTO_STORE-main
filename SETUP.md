# Pride Auto Store — Complete Setup Guide

## Project Structure
```
PRIDE_AUTO_STORE/
├── frontend/                    ← Next.js 14 App
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css      ← Tailwind + custom styles
│   │   │   ├── layout.tsx       ← Root layout (Navbar + Footer)
│   │   │   ├── page.tsx         ← Homepage
│   │   │   ├── products/
│   │   │   │   └── page.tsx     ← Product listing (client, with filters)
│   │   │   ├── about/
│   │   │   │   └── page.tsx     ← About page
│   │   │   └── contact/
│   │   │       └── page.tsx     ← Contact page with form
│   │   └── components/
│   │       ├── Navbar.tsx       ← Responsive sticky navbar
│   │       ├── Footer.tsx       ← Full footer with links
│   │       ├── Hero.tsx         ← Full-screen hero with BG image
│   │       ├── TrustBar.tsx     ← 4 trust signals (shipping, warranty...)
│   │       ├── FeaturedProducts.tsx  ← Server component, fetches API
│   │       ├── Categories.tsx   ← 6 category cards grid
│   │       ├── CTABanner.tsx    ← Sale/promo banner
│   │       └── ProductCard.tsx  ← Reusable product card
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── next.config.js           ← Proxies /api/* → localhost:5000
│   └── tsconfig.json
└── backend/                     ← Your Express API
    └── server-fix.ts            ← Fixes "Cannot GET /" error
```

---

## 🚀 Quick Setup (Step by Step)

### 1. Copy all files from the generated code into your repo

### 2. Install frontend dependencies
```bash
cd frontend
npm install
```

> If Tailwind isn't picking up, explicitly install:
```bash
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react
```

### 3. Fix your backend
Open your `backend/server.ts` (or `index.ts`) and add:

```typescript
// Add this BEFORE your existing routes:
app.get("/", (req, res) => {
  res.json({ message: "Pride Auto Store API", status: "running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Also make sure CORS is set up for localhost:3000:
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));
```

### 4. Run both servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Should print: ✅ Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Should print: ✅ Ready on http://localhost:3000
```

### 5. Verify
- `http://localhost:5000/` → Should show JSON (not "Cannot GET /")
- `http://localhost:5000/api/products` → Your products list
- `http://localhost:3000/` → Beautiful homepage ✨
- `http://localhost:3000/products` → Product listing with filters

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Font Display | Bebas Neue |
| Font Body | DM Sans |
| Background | `#0a0a0a` |
| Surface | `#111111` / `#1a1a1a` |
| Accent | `#f97316` (orange-500) |
| Border | `rgba(255,255,255,0.05)` |

---

## 🔧 How the API Connection Works

The `next.config.js` has this proxy rewrite:
```js
rewrites: [{ source: "/api/:path*", destination: "http://localhost:5000/api/:path*" }]
```

So from the frontend, calling `/api/products` automatically goes to `http://localhost:5000/api/products`. No CORS issues, no hardcoded ports.

In `FeaturedProducts.tsx` (server component), the full URL is used directly:
```typescript
fetch("http://localhost:5000/api/products")
```

In `products/page.tsx` (client component), the proxy is used:
```typescript
fetch("/api/products")
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Styles not loading | Run `npm install` again, restart dev server |
| `Cannot GET /` on :5000 | Add root route to backend (see step 3) |
| Products not loading | Check backend is running on port 5000 |
| Images broken | Normal — they fall back to Unsplash placeholders |
| CORS errors | Add `origin: "http://localhost:3000"` to your CORS config |
| Font not loading | Check internet connection (Google Fonts CDN) |
