import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/utils/sendEmail';
import 'dotenv/config';
import { prisma } from '@/utils/prismaClient';

function generateOTP(length = 6) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

// Get allowed emails from .env (comma-separated)
const allowedEmails = (process.env.ALLOWED_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
  }
  // Check if email is allowed
  if (!allowedEmails.includes(email) || process.env.CLIENT_EMAIL !== email) {
    return NextResponse.json({ success: false, error: 'Email not allowed.' }, { status: 403 });
  }

  // Check if user exists
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Create user if not present
    user = await prisma.user.create({ data: { email } });
  }

  // If OTP is present and not expired, return error
  if (user.otp && user.otpCreatedAt && user.otpExpires) {
    const now = new Date();
    if (now < user.otpExpires) {
      return NextResponse.json({ success: false, error: 'OTP already sent. Please wait before requesting a new one.' }, { status: 429 });
    }
  }

  // Generate OTP and expiry
  const otp = generateOTP();
  const otpCreatedAt = new Date();
  const otpExpires = new Date(otpCreatedAt.getTime() + 10 * 60 * 1000); // 10 minutes

  // Update user with new OTP and times
  await prisma.user.update({
    where: { email },
    data: { otp, otpCreatedAt, otpExpires }
  });

  // Send OTP email
  try {
    await sendEmail({
      to: email,
      subject: 'Your Login OTP',
      templateName: 'login.html',
      replacements: { OTP: otp }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
  }
}
