import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { prisma } from '@/utils/prismaClient';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
export function verifyToken(req: NextRequest): { userId: string; email: string } | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    if (decoded.email != process.env.CLIENT_EMAIL) {
      return null;
    }
    return decoded;
  } catch (err: any) {
    // If token expired, try refresh token
    if (err.name === 'TokenExpiredError') {
      const refreshToken = req.headers.get('x-refresh-token');
      if (!refreshToken) return null;
      try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; email: string };
        if (decoded.email != process.env.CLIENT_EMAIL) {
          return null;
        }
        // Issue new tokens
        const newAuthToken = jwt.sign({ userId: decoded.userId, email: decoded.email }, JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ userId: decoded.userId, email: decoded.email }, JWT_SECRET, { expiresIn: '7d' });
        // Update user tokens in DB
        prisma.user.update({
          where: { id: decoded.userId },
          data: { authToken: newAuthToken, refreshToken: newRefreshToken },
        });
        // Attach new tokens to response headers (handled in route)
        (req as any).newAuthToken = newAuthToken;
        (req as any).newRefreshToken = newRefreshToken;
        return decoded;
      } catch {
        return null;
      }
    }
    return null;
  }
}