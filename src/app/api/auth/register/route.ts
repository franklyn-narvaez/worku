import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { prisma } from "@/libs/db";
import { registerSchema } from "../../../../../schemas/register";
import { z } from "zod";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = registerSchema.parse(body);

        const userFound = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (userFound) {
            return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 });
        }

        const role = await prisma.role.findFirst({
            where: {
                code: "student"
            }
        })

        if (!role) {
            return NextResponse.json({ error: "Rol no encontrado" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await prisma.user.create({
            data: { ...data, roleId: role.id, password: hashedPassword }
        })

        const { password: _, ...user } = newUser;

        return NextResponse.json(user);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Error al registrar el usuario" }, { status: 500 });
    }
}