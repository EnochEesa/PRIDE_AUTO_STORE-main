import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const router = express.Router();
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

/**
 * Handle Google authentication
 * POST /api/auth/google
 */
router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, error: 'ID Token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(401).json({ success: false, error: 'Invalid Google token' });
    }

    // Generate local JWT
    const token = jwt.sign(
      { 
        id: payload.sub, 
        email: payload.email, 
        name: payload.name, 
        role: 'customer' 
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        _id: payload.sub,
        name: payload.name,
        email: payload.email,
        token,
        role: 'customer',
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ success: false, error: 'Authentication failed' });
  }
});

export default router;
