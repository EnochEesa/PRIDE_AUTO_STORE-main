import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface InquiryEmailData {
  name: string;
  phone: string;
  email?: string;
  message: string;
  productRef?: string;
}

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
  });

export const sendInquiryEmail = async (data: InquiryEmailData): Promise<void> => {
  if (!env.EMAIL_USER || !env.EMAIL_PASS || !env.ADMIN_EMAIL) return;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Pride Auto Store" <${env.EMAIL_USER}>`,
    to: env.ADMIN_EMAIL,
    subject: `New Inquiry from ${data.name}`,
    html: `
      <h2>New Customer Inquiry — Pride Auto Store</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${data.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${data.phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${data.email || 'Not provided'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Product</td><td style="padding:8px;border:1px solid #ddd">${data.productRef || 'General inquiry'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${data.message}</td></tr>
      </table>
      <p style="margin-top:16px;color:#666">Received at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
    `,
  });
};
