import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import { prisma } from '@/libs/db';
import router from '../controller';

vi.mock('@/libs/db', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
		},
		role: {
			findUnique: vi.fn(),
		},
		rolePermission: {
			findMany: vi.fn(),
		},
		sessions: {
			create: vi.fn(),
			delete: vi.fn(),
			deleteMany: vi.fn(),
			findFirst: vi.fn(),
		},
	},
}));

vi.mock('bcrypt', () => {
	const compareMock = vi.fn() as unknown as MockedFunction<(a: string, b: string) => Promise<boolean>>;
	return {
		default: {
			compare: compareMock,
		},
	};
});

vi.mock('jsonwebtoken', () => {
	const signMock = vi.fn() as unknown as MockedFunction<(payload: any, secret: string, options?: any) => string>;
	const verifyMock = vi.fn() as unknown as MockedFunction<(token: string, secret: string, options?: any) => any>;
	return {
		default: {
			sign: signMock,
			verify: verifyMock,
		},
	};
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/', router);

const userFindUniqueMock = vi.mocked(prisma.user.findUnique);
const rolePermissionFindManyMock = vi.mocked(prisma.rolePermission.findMany);
const roleFindUniqueMock = vi.mocked(prisma.role.findUnique);
const sessionsCreateMock = vi.mocked(prisma.sessions.create);
const sessionsFindFirstMock = vi.mocked(prisma.sessions.findFirst);
const sessionsDeleteManyMock = vi.mocked(prisma.sessions.deleteMany);
// Cast the mocked functions to the same signature as the real implementations
const bcryptCompareMock = bcrypt.compare as unknown as MockedFunction<typeof bcrypt.compare>;
const jwtSignMock = jwt.sign as unknown as MockedFunction<typeof jwt.sign>;
const jwtVerifyMock = jwt.verify as unknown as MockedFunction<typeof jwt.verify>;

describe('Auth Controller', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	// --- LOGIN TESTS ---
	it('retorna 400 si los datos son inválidos', async () => {
		const res = await request(app).post('/login').send({ email: 'not-an-email', password: '123' });

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('message', 'Datos inválidos');
	});

	it('retorna 401 si el usuario no existe', async () => {
		userFindUniqueMock.mockResolvedValue(null);

		const res = await request(app).post('/login').send({ email: 'test@email.com', password: '123456' });

		expect(res.status).toBe(401);
		expect(res.body.message).toBe('Usuario o contraseña no válidos');
	});

	it('retorna 401 si la contraseña no coincide', async () => {
		userFindUniqueMock.mockResolvedValue({
			id: '1',
			email: 'test@email.com',
			password: 'hashed',
			roleId: 'student',
		} as never);

		(bcryptCompareMock as any).mockResolvedValue(false);

		const res = await request(app).post('/login').send({ email: 'test@email.com', password: 'wrongpass' });

		expect(res.status).toBe(401);
		expect(res.body.message).toBe('Usuario o contraseña no válidos');
	});

	it('retorna tokens y permisos válidos si el login es exitoso', async () => {
		userFindUniqueMock.mockResolvedValue({
			id: '1',
			email: 'test@email.com',
			password: 'hashed',
			roleId: 'admin',
		} as never);

		(bcryptCompareMock as any).mockResolvedValue(true);
		roleFindUniqueMock.mockResolvedValue({ id: 'admin', name: 'Administrador' } as never);
		rolePermissionFindManyMock.mockResolvedValue([
			{ permission: { code: 'READ' } },
			{ permission: { code: 'WRITE' } },
		] as never);

		(jwtSignMock as any).mockReturnValue('token123');
		sessionsCreateMock.mockResolvedValue({} as never);

		const res = await request(app).post('/login').send({ email: 'test@email.com', password: '123456' });

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('access_token', 'token123');
		expect(res.body.permissions).toContain('READ');
	});

	// --- REFRESH TESTS ---
	it('retorna 401 si no hay refreshToken', async () => {
		const res = await request(app).post('/refresh');
		expect(res.status).toBe(401);
		expect(res.body.message).toBe('No hay refresh token');
	});

	it('retorna 403 si el token no es válido', async () => {
		jwtVerifyMock.mockImplementation(() => {
			throw new Error('Invalid token');
		});

		const res = await request(app).post('/refresh').set('Cookie', 'refreshToken=invalidToken');

		expect(res.status).toBe(403);
		expect(res.body.message).toBe('Token inválido');
	});

	it('genera nuevos tokens si el refresh es exitoso', async () => {
		jwtVerifyMock.mockReturnValue({ id: '1' } as never);

		sessionsFindFirstMock.mockResolvedValue({
			id: '10',
			refreshToken: 'oldToken',
			expiresAt: new Date(Date.now() + 10000),
		} as never);

		userFindUniqueMock.mockResolvedValue({
			id: '1',
			roleId: 'admin',
		} as never);

		rolePermissionFindManyMock.mockResolvedValue([{ permission: { code: 'READ' } }] as never);

		(jwtSignMock as any).mockReturnValue('newAccessToken');
		sessionsCreateMock.mockResolvedValue({} as never);

		const res = await request(app).post('/refresh').set('Cookie', 'refreshToken=validToken');

		expect(res.status).toBe(200);
		expect(res.body.access_token).toBe('newAccessToken');
	});

	// --- LOGOUT TESTS ---
	it('devuelve 200 aunque no haya token', async () => {
		const res = await request(app).post('/logout');
		expect(res.status).toBe(200);
		expect(res.body.message).toBe('No token to revoke');
	});

	it('borra el token y devuelve 200', async () => {
		sessionsDeleteManyMock.mockResolvedValue({ count: 1 } as never);

		const res = await request(app).post('/logout').set('Cookie', 'refreshToken=someToken');

		expect(res.status).toBe(200);
		expect(res.body.message).toBe('Logout successful');
	});
});
