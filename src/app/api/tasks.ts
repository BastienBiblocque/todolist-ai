import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid task' }, { status: 400 });
  }
  const newTask = await prisma.task.create({ data: { text } });
  return NextResponse.json(newTask);
}

export async function PATCH(request: Request) {
  const { id, done } = await request.json();
  const updated = await prisma.task.update({
    where: { id },
    data: { done: !!done },
  });
  return NextResponse.json(updated);
}
