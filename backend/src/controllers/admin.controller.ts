import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { env } from '../config/env';
import { logger } from '../config/logger';

// POST /api/admin/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password required.' });
      return;
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.comparePassword(password))) {
      res.status(401).json({ success: false, error: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign({ id: admin._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    res.json({
      success: true,
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    logger.error('admin login error:', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// POST /api/admin/seed  (run once to create first admin — disable after use)
export const seedAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    if (env.NODE_ENV === 'production') {
      res.status(403).json({ success: false, error: 'Forbidden in production.' });
      return;
    }

    const existing = await Admin.findOne({ email: 'admin@prideautostore.in' });
    if (existing) {
      res.json({ success: true, message: 'Admin already exists.' });
      return;
    }

    await Admin.create({
      email: 'admin@prideautostore.in',
      password: 'PrideAdmin@2024',
      name: 'Pride Admin',
    });

    res.status(201).json({ success: true, message: 'Admin created. Change password immediately!' });
  } catch (error) {
    logger.error('seedAdmin error:', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};
