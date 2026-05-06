import bcrypt from 'bcrypt';
import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/libs/db';
import router from '../controller';

vi.mock('@/libs/db', () => ({
	prisma: {
		user: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			findFirst: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
		},
		role: {
			findFirst: vi.fn(),
		},
	},
}));

vi.mock('bcrypt', () => ({
	default: { hash: vi.fn().mockResolvedValue('hashed_password') },
}));

vi.mock('@/middlewares/authenticate', () => ({
	authenticate: vi.fn((req: any, _res: any, next: any) => {
		req.user = { id: 'user123', role: 'admin' };
		next();
	}),
}));

vi.mock('@/middlewares/authorize', () => ({
	authorize: vi.fn(() => (req: any, _res: any, next: any) => next()),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('User Controller', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const userFindManyMock = vi.mocked(prisma.user.findMany);
	const userFindUniqueMock = vi.mocked(prisma.user.findUnique);
	const userCreateMock = vi.mocked(prisma.user.create);
	const userUpdateMock = vi.mocked(prisma.user.update);
	const roleFindFirstMock = vi.mocked(prisma.role.findFirst);

	// 🔹 GET /
	it('retorna 200 con la lista de usuarios', async () => {
		userFindManyMock.mockResolvedValue([{ id: '1', name: 'John', email: 'john@test.com' } as never]);

		const res = await request(app).get('/');

		expect(res.status).toBe(200);
		expect(res.body).toEqual([{ id: '1', name: 'John', email: 'john@test.com' }]);
	});

	it('retorna 500 si ocurre un error en GET /', async () => {
		userFindManyMock.mockRejectedValue(new Error('DB Error'));

		const res = await request(app).get('/');
		expect(res.status).toBe(500);
		expect(res.body).toHaveProperty('error', 'Failed to fetch users');
	});

	// 🔹 POST /register
	it('registra un usuario nuevo correctamente', async () => {
		const mockData = {
			name: 'Franklin',
			lastName: 'Narvaez',
			email: 'franklin@test.com',
			password: '123456',
			collegeId: '1',
		};

		userFindUniqueMock.mockResolvedValue(null);
		roleFindFirstMock.mockResolvedValue({ id: 'r1', code: 'student' } as never);
		userCreateMock.mockResolvedValue({
			id: '1',
			...mockData,
			password: 'hashed_password',
			roleId: 'r1',
		} as never);

		const res = await request(app).post('/register').send(mockData);

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('id');
		expect(bcrypt.hash).toHaveBeenCalledWith(mockData.password, 10);
	});

	it('retorna 400 si los datos son inválidos', async () => {
		const res = await request(app).post('/register').send({ name: '', email: 'bad', password: '' });

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('message', 'Datos inválidos');
	});

	it('retorna 400 si el email ya existe en POST /register', async () => {
		userFindUniqueMock.mockResolvedValue({ id: '1', email: 'test@test.com' } as never);

		const res = await request(app).post('/register').send({
			name: 'X',
			lastName: 'Test',
			email: 'test@test.com',
			password: '123456',
			collegeId: '1',
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('error', 'El usuario ya existe');
	});

	it("retorna 404 si no encuentra el rol 'student' en POST /register", async () => {
		userFindUniqueMock.mockResolvedValue(null);
		roleFindFirstMock.mockResolvedValue(null);

		const res = await request(app).post('/register').send({
			name: 'X',
			lastName: 'Test',
			email: 'x@test.com',
			password: '123456',
			collegeId: '1',
		});

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('error', 'Rol no encontrado');
	});

	it('retorna 500 si ocurre un error al registrar el usuario', async () => {
		userFindUniqueMock.mockRejectedValue(new Error('DB Error'));

		const res = await request(app).post('/register').send({
			name: 'X',
			lastName: 'Test',
			email: 'x@test.com',
			password: '123456',
			collegeId: '1',
		});

		expect(res.status).toBe(500);
		expect(res.body).toHaveProperty('error', 'Error al registrar el usuario');
	});

	// 🔹 POST /create
	it('crea un usuario con permisos correctamente', async () => {
		const mockData = {
			name: 'Admin',
			lastName: 'User',
			email: 'admin@test.com',
			password: '123456',
			collegeId: '1',
			roleId: '2',
		};

		userFindUniqueMock.mockResolvedValue(null);
		userCreateMock.mockResolvedValue({
			id: '2',
			...mockData,
			password: 'hashed_password',
		} as never);

		const res = await request(app).post('/create').send(mockData);

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('id', '2');
	});

	it('retorna 400 si el usuario ya existe en POST /create', async () => {
		userFindUniqueMock.mockResolvedValue({ id: '2', email: 'admin@test.com' } as never);

		const res = await request(app).post('/create').send({
			name: 'Admin',
			lastName: 'User',
			email: 'admin@test.com',
			password: '123456',
			collegeId: '1',
			roleId: '2',
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('error', 'El usuario ya existe');
	});

	it('retorna 500 si ocurre un error en POST /create', async () => {
		userFindUniqueMock.mockResolvedValue(null);
		userCreateMock.mockRejectedValue(new Error('DB Error'));

		const res = await request(app).post('/create').send({
			name: 'Admin',
			lastName: 'User',
			email: 'admin@test.com',
			password: '123456',
			collegeId: '1',
			roleId: '2',
		});

		expect(res.status).toBe(500);
		expect(res.body).toHaveProperty('error', 'Error al registrar el usuario');
	});

	// 🔹 GET /:id
	it('retorna 200 con un usuario por id', async () => {
		userFindUniqueMock.mockResolvedValue({ id: '1', name: 'User' } as never);

		const res = await request(app).get('/1');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('id', '1');
	});

	it('retorna 404 si no encuentra al usuario', async () => {
		userFindUniqueMock.mockResolvedValue(null);

		const res = await request(app).get('/999');
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
	});

	it('retorna 500 si ocurre un error al obtener el usuario', async () => {
		userFindUniqueMock.mockRejectedValue(new Error('DB Error'));

		const res = await request(app).get('/1');
		expect(res.status).toBe(500);
		expect(res.body).toHaveProperty('error', 'Error al obtener el usuario');
	});

	// 🔹 PATCH /update
	it('actualiza un usuario correctamente', async () => {
		const mockUpdate = {
			id: 'user123',
			name: 'NuevoNombre',
			lastName: 'Actualizado',
			email: 'nuevo@test.com',
			collegeId: '1',
			roleId: '2',
			status: 'ACTIVE',
		};

		userFindUniqueMock
			.mockResolvedValueOnce({ id: 'user123', email: 'viejo@test.com' } as never)
			.mockResolvedValueOnce(null);

		userUpdateMock.mockResolvedValue(mockUpdate as never);

		const res = await request(app).patch('/update').send(mockUpdate);

		expect(res.status).toBe(200);
		expect(res.body).toEqual(mockUpdate);
	});

	it('retorna 404 si el usuario a actualizar no existe', async () => {
		userFindUniqueMock.mockResolvedValue(null);

		const res = await request(app).patch('/update').send({
			id: 'user123',
			name: 'NuevoNombre',
			lastName: 'Actualizado',
			email: 'nuevo@test.com',
			collegeId: '1',
			roleId: '2',
			status: 'ACTIVE',
		});

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
	});

	it('retorna 400 si los datos son inválidos en PATCH /update', async () => {
		const res = await request(app).patch('/update').send({ id: '' });

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('message', 'Datos inválidos');
	});

	it('retorna 500 si ocurre un error al actualizar el usuario', async () => {
		userFindUniqueMock.mockResolvedValueOnce({ id: '1', email: 'old@test.com' } as never).mockResolvedValueOnce(null);
		userUpdateMock.mockRejectedValue(new Error('DB Error'));

		const res = await request(app).patch('/update').send({
			id: 'user123',
			name: 'NuevoNombre',
			lastName: 'Actualizado',
			email: 'nuevo@test.com',
			collegeId: '1',
			roleId: '2',
			status: 'ACTIVE',
		});
		expect(res.status).toBe(500);
		expect(res.body).toHaveProperty('error', 'Error al registrar el usuario');
	});
});
