import { prisma } from "@/libs/db";
import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

const router = Router();

const loginSchema = z.object({
    email: z.email("El correo electrónico no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

router.post("/login", async (req, res) => {
    try {
        const parseData = loginSchema.safeParse(req.body);

        if (!parseData.success) {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: z.treeifyError(parseData.error).properties //
            });
        }

        const credentials = parseData.data;

        const userFound = await prisma.user.findUnique({
            where: { email: credentials.email }
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
            include: { permission: true }
        });

        const permissions = userPermissions.map(rp => rp.permission.code);

        const accessToken = jwt.sign({ id: userFound.id, role: userFound.roleId, permissions }, JWT_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ id: userFound.id }, JWT_REFRESH_SECRET, { expiresIn: '1d' });

        const refreshExpires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 7 días

        await prisma.sessions.create({
            data: {
                refreshToken: refreshToken,
                userId: userFound.id,
                expiresAt: refreshExpires
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: refreshExpires
        });

        return res.status(200).json({
            expires: 30 * 60 * 1000,
            access_token: accessToken,
            permissions,
            role: userFound.roleId,
        });

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }

});

router.post("/refresh", async (req, res) => {
    const oldToken = req.cookies.refreshToken;

    if (!oldToken) {
        return res.status(401).json({ message: 'No hay refresh token' });
    }

    try {
        const payload = jwt.verify(oldToken, JWT_REFRESH_SECRET) as { id: string };

        const storedToken = await prisma.sessions.findFirst({
            where: { refreshToken: { 'equals': oldToken } }
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            return res.status(403).json({ message: 'Refresh token inválido o expirado' });
        }

        await prisma.sessions.delete({
            where: { 'id': storedToken.id }
        });

        const userFound = await prisma.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                roleId: true,
            }
        });

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const userPermissions = await prisma.rolePermission.findMany({
            where: { roleId: userFound.roleId },
            include: { permission: true }
        });

        const permissions = userPermissions.map(rp => rp.permission.code);

        const newAccessToken = jwt.sign({ id: payload.id, role: userFound.roleId, permissions }, JWT_SECRET, { expiresIn: '30m' });

        const newRefreshToken = jwt.sign({ id: payload.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await prisma.sessions.create({
            data: {
                refreshToken: newRefreshToken,
                userId: payload.id,
                expiresAt: refreshExpires
            }
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: refreshExpires
        });

        return res.status(200).json({
            access_token: newAccessToken,
            expires: 30 * 60 * 1000
        });

    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
});

router.post("/logout", async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(200).json({ message: "No token to revoke" });
    }

    try {
        await prisma.sessions.deleteMany({
            where: { refreshToken: { 'equals': token } }
        });
    } catch (error) {
        console.warn('Token ya eliminado o inválido');
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return res.status(200).json({ message: "Logout successful" });
});

export default router;
