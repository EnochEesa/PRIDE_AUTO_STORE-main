import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';
import { logger } from '../config/logger';
import { sendInquiryEmail } from '../utils/sendEmail';

// POST /api/inquiries
export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, message, productRef } = req.body;

    if (!name || !phone || !message) {
      res.status(400).json({ success: false, error: 'Name, phone and message are required.' });
      return;
    }

    const inquiry = await Inquiry.create({ name, phone, email, message, productRef });

    // Send email notification (non-blocking)
    sendInquiryEmail({ name, phone, email, message, productRef }).catch((err) =>
      logger.warn('Email notification failed (non-critical):', err)
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! We will contact you shortly.',
      data: { id: inquiry._id },
    });
  } catch (error) {
    logger.error('createInquiry error:', error);
    res.status(500).json({ success: false, error: 'Server error. Please call us directly.' });
  }
};

// GET /api/inquiries  (admin only)
export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const pageNum  = Math.max(parseInt(page as string, 10), 1);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Inquiry.countDocuments(filter),
    ]);

    res.json({ success: true, data: inquiries, pagination: { page: pageNum, total } });
  } catch (error) {
    logger.error('getInquiries error:', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// PATCH /api/inquiries/:id/status  (admin only)
export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!inquiry) {
      res.status(404).json({ success: false, error: 'Inquiry not found.' });
      return;
    }
    res.json({ success: true, data: inquiry });
  } catch (error) {
    logger.error('updateInquiryStatus error:', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};
