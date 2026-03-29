import { Router } from 'express';
import { createInquiry, getInquiries, updateInquiryStatus } from '../controllers/inquiries.controller';
import { protect } from '../middleware/auth';
import { inquiryLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/',               inquiryLimiter, createInquiry);
router.get('/',                protect, getInquiries);
router.patch('/:id/status',    protect, updateInquiryStatus);

export default router;
