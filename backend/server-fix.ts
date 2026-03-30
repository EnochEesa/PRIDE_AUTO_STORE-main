// ─── Backend Fix (server.ts / index.ts) ──────────────────────────────────────
// Add these routes BEFORE your existing API routes.
// This fixes the "Cannot GET /" error on localhost:5000
//
// PASTE THIS INTO YOUR EXISTING server.ts / index.ts FILE:

import express from "express";
import cors from "cors";

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json());

// ── Root route fix (was causing "Cannot GET /") ──────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Pride Auto Store API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      products: "/api/products",
      health: "/api/health",
    },
  });
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── YOUR EXISTING ROUTES GO HERE ─────────────────────────────────────────────
// e.g. app.use("/api/products", productsRouter);
// e.g. app.use("/api/auth", authRouter);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Pride Auto Store API running on http://localhost:${PORT}`);
});

export default app;
