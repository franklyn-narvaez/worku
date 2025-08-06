import { prisma } from "@/libs/db";
import { Router } from "express";
import { registerSchema } from "./schema";
import z from "zod";
import bcrypt from 'bcrypt';

const router = Router();

router.get("", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                createdDate: true,
                status: true,
                college: {
                    select: {
                        id: true,
                        name: true,
                    }
                }

            },
        })
        return res.json(users)
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.post("/register", async (req, res) => {
    try {
        console.log("Registering user with data:", req.body);
        const parseData = registerSchema.safeParse(req.body);
        console.log();

        if (!parseData.success) {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: z.treeifyError(parseData.error).properties //
            });
        }

        const userFound = await prisma.user.findUnique({
            where: {
                email: parseData.data.email
            }
        })

        if (userFound) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        const role = await prisma.role.findFirst({
            where: {
                code: "student"
            }
        })

        if (!role) {
            return res.status(404).json({ error: "Rol no encontrado" });
        }

        const hashedPassword = await bcrypt.hash(parseData.data.password, 10);
        const newUser = await prisma.user.create({
            data: { ...parseData.data, roleId: role.id, password: hashedPassword }
        })

        const { password: _, ...user } = newUser;

        return res.json(user);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({errors: z.treeifyError(error)});
        }
        return res.status(500).json({ error: "Error al registrar el usuario" });
    }
})

export default router;
