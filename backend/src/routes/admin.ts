import { Router } from 'express';
import { login, seedAdmin } from '../controllers/admin.controller';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/seed',  seedAdmin);   // Disable this route after first use!

export default router;
