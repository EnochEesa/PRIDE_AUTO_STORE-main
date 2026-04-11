import dotenv from 'dotenv';
dotenv.config();

const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

export const env = {
  NODE_ENV:      process.env.NODE_ENV || 'development',
  PORT:          Number.parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI:   required('MONGODB_URI'),
  JWT_SECRET:    required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL:  process.env.FRONTEND_URL || 'http://localhost:3000',
  EMAIL_USER:    process.env.EMAIL_USER || '',
  EMAIL_PASS:    process.env.EMAIL_PASS || '',
  ADMIN_EMAIL:   process.env.ADMIN_EMAIL || '',
  ADMIN_SEED_EMAIL: process.env.ADMIN_SEED_EMAIL || 'admin@prideautostore.in',
  ADMIN_NAME:    process.env.ADMIN_NAME || 'Pride Admin',
  ADMIN_SEED_PASSWORD: process.env.ADMIN_SEED_PASSWORD || '',
  GOOGLE_CLIENT_ID:    process.env.GOOGLE_CLIENT_ID || '',
};
