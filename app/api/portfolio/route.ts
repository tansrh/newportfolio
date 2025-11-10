import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { prisma } from '@/utils/prismaClient';
import { verifyToken } from '../_utils';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(req: NextRequest) {
  const clientEmail = process.env.CLIENT_EMAIL;
  if (!clientEmail) {
    return NextResponse.json({ success: false, error: 'Client email not configured' }, { status: 500 });
  }

  const userRecord = await prisma.user.findUnique({ where: { email: clientEmail } });
  const res = NextResponse.json({ success: true, portfolio: userRecord?.portfolio || null });

  // Attach new tokens if refreshed
  if ((req as any).newAuthToken && (req as any).newRefreshToken) {
    res.headers.set('authorization', `Bearer ${(req as any).newAuthToken}`);
    res.headers.set('x-refresh-token', (req as any).newRefreshToken);
  }
  return res;
}

export async function PUT(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const portfolio = await req.json();
  const updatedUser = await prisma.user.update({
    where: { id: user.userId },
    data: { portfolio },
  });
  const res = NextResponse.json({ success: true, portfolio: updatedUser.portfolio });
  if ((req as any).newAuthToken && (req as any).newRefreshToken) {
    res.headers.set('authorization', `Bearer ${(req as any).newAuthToken}`);
    res.headers.set('x-refresh-token', (req as any).newRefreshToken);
  }
  return res;
}

export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  await prisma.user.update({
    where: { id: user.userId },
    data: { portfolio: {} },
  });
  const res = NextResponse.json({ success: true });
  if ((req as any).newAuthToken && (req as any).newRefreshToken) {
    res.headers.set('authorization', `Bearer ${(req as any).newAuthToken}`);
    res.headers.set('x-refresh-token', (req as any).newRefreshToken);
  }
  return res;
}
