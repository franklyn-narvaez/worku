import bcrypt from 'bcrypt';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { prisma } from '@/libs/db';
import { sendEmail, generatePasswordResetEmailHTML } from '@/libs/email';

const JWT_SECRET = process.env.JWT_SECRET || 'access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

const router = Router();

const loginSchema = z.object({
	email: z.email('El correo electrónico no es válido'),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const forgotPasswordSchema = z.object({
	email: z.email('El correo electrónico no es válido'),
});

const resetPasswordSchema = z.object({
	token: z.string().min(1, 'Token requerido'),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
	passwordConfirm: z.string().min(6, 'La confirmación de contraseña es requerida'),
}).refine(data => data.password === data.passwordConfirm, {
	message: 'Las contraseñas no coinciden',
	path: ['passwordConfirm'],
});

// Helper function to generate secure random token
function generateResetToken(): string {
	return randomBytes(32).toString('hex');
}

// Hash token for secure storage (SHA-256)
function hashResetToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

router.post('/login', async (req, res) => {
	try {
		const parseData = loginSchema.safeParse(req.body);

		if (!parseData.success) {
			return res.status(400).json({
				message: 'Datos inválidos',
				errors: z.treeifyError(parseData.error).properties, //
			});
		}

		const credentials = parseData.data;

		const userFound = await prisma.user.findUnique({
			where: { email: credentials.email },
			include: { role: true },
		});

		if (!userFound) {
			return res.status(401).json({ message: 'Usuario o contraseña no válidos' });
		}

		const matchPassword = await bcrypt.compare(credentials.password, userFound.password);

		if (!matchPassword) {
			return res.status(401).json({ message: 'Usuario o contraseña no válidos' });
		}

		const userPermissions = await prisma.rolePermission.findMany({
			where: { roleId: userFound.roleId },
			include: { permission: true },
		});

		const permissions = userPermissions.map(rp => rp.permission.code);
		const role =
			userFound.role ??
			(await prisma.role.findUnique({
				where: { id: userFound.roleId },
				select: { id: true, name: true },
			}));

		if (!role) {
			return res.status(500).json({ message: 'Rol del usuario no encontrado' });
		}

		const accessToken = jwt.sign({ id: userFound.id, role: userFound.roleId, permissions }, JWT_SECRET, {
			expiresIn: '30m',
		});
		const refreshToken = jwt.sign({ id: userFound.id }, JWT_REFRESH_SECRET, { expiresIn: '1d' });

		const refreshExpires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 día

		await prisma.sessions.create({
			data: {
				refreshToken: refreshToken,
				userId: userFound.id,
				expiresAt: refreshExpires,
			},
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			expires: refreshExpires,
		});

		return res.status(200).json({
			expires: 30 * 60 * 1000,
			access_token: accessToken,
			permissions,
			role: {
				id: role.id,
				name: role.name,
			},
		});
	} catch (error) {
		console.error('Error en el login:', error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
});

router.post('/refresh', async (req, res) => {
	const oldToken = req.cookies.refreshToken;

	if (!oldToken) {
		return res.status(401).json({ message: 'No hay refresh token' });
	}

	try {
		const payload = jwt.verify(oldToken, JWT_REFRESH_SECRET) as { id: string };

		const storedToken = await prisma.sessions.findFirst({
			where: { refreshToken: { equals: oldToken } },
		});

		if (!storedToken || storedToken.expiresAt < new Date()) {
			return res.status(403).json({ message: 'Refresh token inválido o expirado' });
		}

		await prisma.sessions.delete({
			where: { id: storedToken.id },
		});

		const userFound = await prisma.user.findUnique({
			where: { id: payload.id },
			select: {
				id: true,
				roleId: true,
			},
		});

		if (!userFound) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}

		const userPermissions = await prisma.rolePermission.findMany({
			where: { roleId: userFound.roleId },
			include: { permission: true },
		});

		const permissions = userPermissions.map(rp => rp.permission.code);

		const newAccessToken = jwt.sign({ id: payload.id, role: userFound.roleId, permissions }, JWT_SECRET, {
			expiresIn: '30m',
		});

		const newRefreshToken = jwt.sign({ id: payload.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

		const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		await prisma.sessions.create({
			data: {
				refreshToken: newRefreshToken,
				userId: payload.id,
				expiresAt: refreshExpires,
			},
		});

		res.cookie('refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			expires: refreshExpires,
		});

		return res.status(200).json({
			access_token: newAccessToken,
			expires: 30 * 60 * 1000,
		});
	} catch (_error) {
		return res.status(403).json({ message: 'Token inválido' });
	}
});

router.post('/logout', async (req, res) => {
	const token = req.cookies.refreshToken;

	if (!token) {
		return res.status(200).json({ message: 'No token to revoke' });
	}

	try {
		await prisma.sessions.deleteMany({
			where: { refreshToken: { equals: token } },
		});
	} catch (_error) {
		console.warn('Token ya eliminado o inválido');
	}

	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
	});

	return res.status(200).json({ message: 'Logout successful' });
});

router.post('/forgot-password', async (req, res) => {
	try {
		const parseData = forgotPasswordSchema.safeParse(req.body);

		if (!parseData.success) {
			return res.status(400).json({
				message: 'Datos inválidos',
				errors: z.treeifyError(parseData.error).properties,
			});
		}

		const { email } = parseData.data;

		const user = await prisma.user.findUnique({
			where: { email },
		});

		// For security: always return success even if user doesn't exist
		if (!user) {
			return res.status(200).json({
				message: 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña',
			});
		}

		// Delete any existing valid reset tokens for this user
		await prisma.passwordReset.deleteMany({
			where: {
				userId: user.id,
				usedAt: null,
				expiresAt: {
					gt: new Date(),
				},
			},
		});

		// Generate new reset token (valid for 1 hour)
		const resetToken = generateResetToken();
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

		await prisma.passwordReset.create({
			data: {
				userId: user.id,
				token: hashResetToken(resetToken),
				expiresAt,
			},
		});

		// Send email with reset link
		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
		const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

		const emailHTML = generatePasswordResetEmailHTML(resetLink, user.name);

		await sendEmail({
			to: user.email,
			subject: 'Recupera tu contraseña - Worku',
			html: emailHTML,
			text: `Usa este enlace para restablecer tu contraseña: ${resetLink}`,
		});

		// For development: also log the reset link
		if (process.env.NODE_ENV !== 'production') {
			console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
			console.log(`[DEV] Reset link: ${resetLink}`);
		}

		return res.status(200).json({
			message: 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña',
		});
	} catch (error) {
		console.error('Error en forgot-password:', error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
});

router.post('/reset-password', async (req, res) => {
	try {
		const parseData = resetPasswordSchema.safeParse(req.body);

		if (!parseData.success) {
			return res.status(400).json({
				message: 'Datos inválidos',
				errors: z.treeifyError(parseData.error).properties,
			});
		}

		const { token, password } = parseData.data;

		// Compute hash of provided token and find the record
		const tokenHash = hashResetToken(token);
		const resetRecord = await prisma.passwordReset.findUnique({
			where: { token: tokenHash },
			include: { user: true },
		});

		// Check if token exists
		if (!resetRecord) {
			return res.status(400).json({
				message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado',
			});
		}

		// Timing-safe compare of hashes
		try {
			const a = Buffer.from(resetRecord.token, 'hex');
			const b = Buffer.from(tokenHash, 'hex');
			if (a.length !== b.length || !timingSafeEqual(a, b)) {
				return res.status(400).json({
					message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado',
				});
			}
		} catch (e) {
			return res.status(400).json({
				message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado',
			});
		}

		// Check used/expired
		if (resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
			return res.status(400).json({
				message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado',
			});
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Perform updates atomically inside a transaction
		try {
			await prisma.$transaction(async (tx) => {
				// re-read the reset record inside the transaction to avoid race conditions
				const rr = await tx.passwordReset.findUnique({ where: { id: resetRecord.id } });
				if (!rr || rr.usedAt || rr.expiresAt < new Date()) {
					const err: any = new Error('Token inválido o expirado');
					err.code = 'TOKEN_INVALID';
					throw err;
				}

				await tx.user.update({
					where: { id: resetRecord.userId },
					data: { password: hashedPassword },
				});

				await tx.passwordReset.update({
					where: { id: resetRecord.id },
					data: { usedAt: new Date() },
				});

				await tx.sessions.deleteMany({
					where: { userId: resetRecord.userId },
				});
			});
		} catch (e: any) {
			if (e?.code === 'TOKEN_INVALID') {
				return res.status(400).json({ message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado' });
			}
			throw e;
		}

		return res.status(200).json({
			message: 'Contraseña actualizada exitosamente. Por favor inicia sesión con tu nueva contraseña',
		});
	} catch (error) {
		console.error('Error en reset-password:', error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
});

router.post('/validate-reset-token', async (req, res) => {
	try {
		const { token } = req.body;

		if (!token) {
			return res.status(400).json({ message: 'Token requerido' });
		}

		const tokenHash = hashResetToken(token);
		const resetRecord = await prisma.passwordReset.findUnique({
			where: { token: tokenHash },
		});

		// Check if token is valid and not expired
		if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
			return res.status(400).json({
				message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado',
				isValid: false,
			});
		}

		return res.status(200).json({
			message: 'Token válido',
			isValid: true,
		});
	} catch (error) {
		console.error('Error validating reset token:', error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
});

export default router;
