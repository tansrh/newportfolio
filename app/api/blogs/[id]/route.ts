import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaClient';
import jwt from 'jsonwebtoken';
import { use } from "react";
import 'dotenv/config';
import { verifyToken } from '../../_utils';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const clientEmail = process.env.CLIENT_EMAIL;
  if (!clientEmail) {
    return NextResponse.json({ success: false, error: 'Client email not configured' }, { status: 500 });
  }
  const user = await prisma.user.findUnique({ where: { email: clientEmail } });
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }
  let id = '';
  const resolvedParams = await params; // Await the params Promise to access `id`
  id = resolvedParams.id;
  // const { id } = use(params);
  if (!id) {
    return NextResponse.json({ success: false, error: 'Blog id required' }, { status: 400 });
  }
  const blog = await prisma.blog.findUnique({
    where: { id },
  });
  if (!blog || blog.userId !== user.id) {
    return NextResponse.json({ success: false, error: 'Blog not found or unauthorized' }, { status: 404 });
  }
  return NextResponse.json({ success: true, blog });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const blogId = (await params).id;
  const { title, content, published, image, subtitle } = await req.json();
  const blog = await prisma.blog.update({
    where: { id: blogId, userId: user.userId },
    data: { title, content, published: !!published, image, subtitle },
  });
  return NextResponse.json({ success: true, blog });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const blogId = (await params).id;
  await prisma.blog.delete({ where: { id: blogId, userId: user.userId } });
  return NextResponse.json({ success: true });
}
