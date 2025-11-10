import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaClient';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { verifyToken } from '../_utils';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  // Clear tokens for user in DB
  await prisma.user.update({
    where: { id: user.userId },
    data: {
      authToken: null,
      refreshToken: null,
    },
  });
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}
