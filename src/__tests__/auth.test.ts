import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/route';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('Auth API', () => {
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  describe('POST /api/auth', () => {
    it('should return 400 if email or password is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Email et mot de passe requis.');
    });

    describe('Login', () => {
      it('should return 401 for invalid credentials', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

        const request = new NextRequest('http://localhost:3000/api/auth', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@test.com',
            password: 'password',
            action: 'login',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Identifiants invalides.');
      });

      it('should return token for valid credentials', async () => {
        const user = {
          id: 1,
          email: 'test@test.com',
          password: 'hashedPassword',
        };

        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(user);
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

        const request = new NextRequest('http://localhost:3000/api/auth', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@test.com',
            password: 'password',
            action: 'login',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.token).toBeDefined();
      });
    });
  });
});
