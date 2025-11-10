import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { prisma } from '@/utils/prismaClient';
import { verifyToken } from '../_utils';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';



export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skip = searchParams.get('skip');
  const take = searchParams.get('take');
  const searchKey = searchParams.get('search');

  // Get user by email from env
  const clientEmail = process.env.CLIENT_EMAIL;
  if (!clientEmail) {
    return NextResponse.json({ success: false, error: 'Client email not configured' }, { status: 500 });
  }
  const user = await prisma.user.findUnique({ where: { email: clientEmail } });
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }
  let blogs: any[] = [];
  let total = 0;
  if (searchKey) {
    // Search mode
    const allBlogs = await prisma.blog.findMany({ where: { userId: user.id } });
    const processedKey = searchKey.toLowerCase().replace(/\s+/g, '');
    blogs = allBlogs.filter(blog =>
      blog.title && (blog.title.toLowerCase().replace(/\s+/g, '').includes(processedKey) || blog.subtitle?.toLowerCase().replace(/\s+/g, '').includes(processedKey))
    );
    total = blogs.length;
  } else {
    // Pagination mode
    const nSkip = Number(skip) || 0;
    const nTake = Number(take) || 10;
    blogs = await prisma.blog.findMany({
      where: { userId: user.id },
      skip: nSkip,
      take: nTake,
      orderBy: { createdAt: 'desc' },
    });
    total = await prisma.blog.count({ where: { userId: user.id } });
  }
  const res = NextResponse.json({ success: true, blogs, total });
  return res;
}

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const { title, content, published, subtitle, image } = await req.json();
  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      published: !!published,
      subtitle,
      image,
      userId: user.userId,
    },
  });
  const res = NextResponse.json({ success: true, blog });
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
  const { id, title, content, published, image, subtitle } = await req.json();
  const blog = await prisma.blog.update({
    where: { id, userId: user.userId },
    data: { title, content, published: !!published, image, subtitle },
  });
  const res = NextResponse.json({ success: true, blog });
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
  const { id } = await req.json();
  await prisma.blog.delete({ where: { id, userId: user.userId } });
  const res = NextResponse.json({ success: true });
  if ((req as any).newAuthToken && (req as any).newRefreshToken) {
    res.headers.set('authorization', `Bearer ${(req as any).newAuthToken}`);
    res.headers.set('x-refresh-token', (req as any).newRefreshToken);
  }
  return res;
}
