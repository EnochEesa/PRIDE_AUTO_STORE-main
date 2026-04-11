import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { globalLimiter } from './middleware/rateLimiter';
import { requestLogger } from './config/logger';
import productsRouter  from './routes/products';
import inquiriesRouter from './routes/inquiries';
import adminRouter     from './routes/admin';
import authRouter      from './routes/auth';
import healthRouter    from './routes/health';
import { env } from './config/env';

const app = express();
app.disable('x-powered-by');

// ── Trust proxy (needed for rate limiter on Render/Railway) ──────────────────
app.set('trust proxy', 1);

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [env.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true,
}));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── NoSQL injection protection ────────────────────────────────────────────────
app.use(mongoSanitize());

// ── Global rate limiter ──────────────────────────────────────────────────────
app.use(globalLimiter);

// ── Request logger ───────────────────────────────────────────────────────────
app.use(requestLogger);

// ── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'Pride Auto Store API',
    version: '2.0.0',
    status: 'running',
    docs: {
      products:  'GET  /api/products',
      product:   'GET  /api/products/:slug',
      inquiries: 'POST /api/inquiries',
      health:    'GET  /api/health',
    },
  });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/products',   productsRouter);
app.use('/api/inquiries',  inquiriesRouter);
app.use('/api/admin',      adminRouter);
app.use('/api/auth',       authRouter);
app.use('/api/health',     healthRouter);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

export default app;
