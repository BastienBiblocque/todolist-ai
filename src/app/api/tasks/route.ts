import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

interface JwtPayload {
  userId: number;
}

async function getUserIdFromToken(request: Request): Promise<number | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({ 
    where: { userId },
    orderBy: { createdAt: 'desc' } 
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const { text } = await request.json();
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid task' }, { status: 400 });
  }
  const newTask = await prisma.task.create({
    data: {
      text,
      user: {
        connect: { id: userId }
      }
    }
  });
  return NextResponse.json(newTask);
}

export async function PATCH(request: Request) {
  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const { id, done } = await request.json();
  try {
    const updated = await prisma.task.update({
      where: { 
        id,
        userId // S'assure que la tâche appartient à l'utilisateur
      },
      data: { done: !!done },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Tâche non trouvée ou non autorisée' }, 
      { status: 404 }
    );
  }
}

export async function DELETE(request: Request) {
  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const { id } = await request.json();
  try {
    await prisma.task.delete({
      where: { 
        id,
        userId // S'assure que la tâche appartient à l'utilisateur
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Tâche non trouvée ou non autorisée' }, 
      { status: 404 }
    );
  }
}
