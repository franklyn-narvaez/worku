// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    // Crear Roles si no existen
    const admin = await prisma.role.upsert({
        where: { code: "admin01" },
        update: {},
        create: {
            code: "admin01",
            name: "administrador",
        },
    });

    // Crear Role de Estudiante si no existe
    const student = await prisma.role.upsert({
        where: { code: "student" },
        update: {},
        create: {
            code: "student",
            name: "estudiante",
        },
    });

    // Crear Faculty
    const faculty = await prisma.faculty.upsert({
        where: { name: "Facultad de Ingeniería" },
        update: {},
        create: {
            name: "Facultad de Ingeniería",
        },
    });

    // Crear College asociado a Faculty
    await prisma.college.upsert({
        where: { name: "Escuela de Sistemas" },
        update: {},
        create: {
            name: "Escuela de Sistemas",
            facultyId: faculty.id,
        },
    });

    // Crear Usuario Admin si no existe
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.upsert({
        where: { email: "admin01@gmail.com"},
        update: {},
        create: {
            name: "Admin",
            lastName: "01",
            email: "admin01@gmail.com",
            roleId: admin.id,
            password: hashedPassword,
        }
    })
}

main()
    .then(() => {
        console.log("Datos insertados correctamente");
        prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
