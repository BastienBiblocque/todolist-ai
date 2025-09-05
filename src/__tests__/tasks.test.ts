import { NextRequest } from 'next/server';
import { GET, POST, PATCH, DELETE } from '@/app/api/tasks/route';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Tasks API', () => {
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  describe('GET /api/tasks', () => {
    it('should return 401 if not authenticated', async () => {
      const request = new NextRequest('http://localhost:3000/api/tasks');
      const response = await GET(request);
      
      expect(response.status).toBe(401);
    });

    it('should return tasks for authenticated user', async () => {
      const userId = 1;
      const tasks = [
        { id: 1, text: 'Test task', done: false, userId },
      ];

      (jwt.verify as jest.Mock).mockReturnValueOnce({ userId });
      (prisma.task.findMany as jest.Mock).mockResolvedValueOnce(tasks);

      const request = new NextRequest('http://localhost:3000/api/tasks', {
        headers: {
          authorization: 'Bearer validtoken',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(tasks);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create new task for authenticated user', async () => {
      const userId = 1;
      const newTask = {
        id: 1,
        text: 'New task',
        done: false,
        userId,
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({ userId });
      (prisma.task.create as jest.Mock).mockResolvedValueOnce(newTask);

      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          authorization: 'Bearer validtoken',
        },
        body: JSON.stringify({ text: 'New task' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(newTask);
    });
  });

  describe('PATCH /api/tasks', () => {
    it('should update task status', async () => {
      const userId = 1;
      const taskId = 1;
      const updatedTask = {
        id: taskId,
        text: 'Test task',
        done: true,
        userId,
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({ userId });
      (prisma.task.update as jest.Mock).mockResolvedValueOnce(updatedTask);

      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'PATCH',
        headers: {
          authorization: 'Bearer validtoken',
        },
        body: JSON.stringify({ id: taskId, done: true }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedTask);
    });
  });
});
