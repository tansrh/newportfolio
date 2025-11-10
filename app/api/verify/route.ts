import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { prisma } from '@/utils/prismaClient';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json({ success: false, error: 'Email and OTP are required.' }, { status: 400 });
  }

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
  }

  // Check OTP and expiry
  if (!user.otp || !user.otpExpires || user.otp !== otp) {
    return NextResponse.json({ success: false, error: 'Invalid OTP.' }, { status: 401 });
  }
  if (new Date() > user.otpExpires) {
    return NextResponse.json({ success: false, error: 'OTP expired.' }, { status: 401 });
  }

  // Generate auth and refresh tokens
  const authToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  // Update user with tokens and clear OTP
  await prisma.user.update({
    where: { email },
    data: {
      authToken,
      refreshToken,
      otp: null,
      otpCreatedAt: null,
      otpExpires: null,
    },
  });

  return NextResponse.json({ success: true, authToken, refreshToken });
}
