import request from "supertest";
import express from "express";
import { vi, describe, it, expect, beforeEach } from "vitest";
import router from "../controller";
import { prisma } from "@/libs/db";

vi.mock("@/middlewares/authenticate", () => ({
    authenticate: (req: any, res: any, next: any) => {
        req.user = { id: "user123", role: "student" };
        next();
    },
}));

vi.mock("@/middlewares/authorize", () => ({
    authorize: () => (req: any, res: any, next: any) => next(),
}));

vi.mock("@/middlewares/upload", () => ({
    upload: {
        fields: () => (req: any, res: any, next: any) => {
            req.files = {
                photo: [{ path: "mock/photo.jpg" }],
                grades: [{ path: "mock/grades.pdf" }],
            };
            next();
        },
    },
}));

vi.mock("@/utils/PrismaHelper", () => ({
    buildNestedCreate: vi.fn((items: any[]) => (items ? { create: items } : undefined)),
}));

vi.mock("../schemas/ProfileSchema", () => ({
    ProfileSchema: {
        safeParse: vi.fn(() => ({ success: true, data: {} })),
    },
}));

vi.mock("@/libs/db", () => ({
    prisma: {
        offer: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
        application: {
            create: vi.fn(),
            findMany: vi.fn(),
        },
        studentProfile: {
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}));

const app = express();
app.use(express.json());
app.use("/", router);

describe("Offers Controller", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ✅ GET / - obtener ofertas
    it("retorna 200 y lista de ofertas formateadas", async () => {
        (prisma.offer.findMany as any).mockResolvedValue([
            {
                id: "1",
                title: "Monitor de programación",
                requirements: "Conocimientos en React",
                description: "Apoyo en cursos",
                createdAt: "2025-10-01",
                updatedAt: "2025-10-02",
                closeDate: "2025-12-01",
                status: true,
                college: { id: "1", name: "Ingeniería" },
                faculty: { id: "2", name: "Sistemas" },
                Application: [{ status: "pending", interviewDate: null, attendedInterview: false }],
            },
        ]);

        const res = await request(app).get("/");

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("userApplicationStatus", "pending");
        expect(prisma.offer.findMany).toHaveBeenCalled();
    });

    it("retorna 500 si falla la consulta", async () => {
        (prisma.offer.findMany as any).mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/");
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Failed to fetch offers");
    });

    // ✅ POST /:offerId/apply
    it("retorna 400 si falta el ID en la aplicación", async () => {
        const res = await request(app).post("/apply");
        expect(res.status).toBe(404); // ruta inválida (sin :offerId)
    });

    it("retorna 404 si la oferta no existe", async () => {
        (prisma.offer.findUnique as any).mockResolvedValue(null);
        const res = await request(app).post("/123/apply");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Oferta no encontrada");
    });

    it("crea aplicación correctamente", async () => {
        (prisma.offer.findUnique as any).mockResolvedValue({ id: "1" });
        (prisma.application.create as any).mockResolvedValue({
            id: "app1",
            userId: "user123",
            offerId: "1",
        });

        const res = await request(app).post("/1/apply");
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id", "app1");
    });

    it("retorna 400 si ya aplicó", async () => {
        (prisma.offer.findUnique as any).mockResolvedValue({ id: "1" });
        const err: any = new Error("Duplicate");
        err.code = "P2002";
        (prisma.application.create as any).mockRejectedValue(err);

        const res = await request(app).post("/1/apply");
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Ya has aplicado a esta oferta");
    });

    it("retorna 500 si ocurre otro error", async () => {
        (prisma.offer.findUnique as any).mockResolvedValue({ id: "1" });
        (prisma.application.create as any).mockRejectedValue(new Error("Unexpected"));
        const res = await request(app).post("/1/apply");
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error al aplicar a la oferta");
    });

    // ✅ GET /applications
    it("retorna lista de aplicaciones", async () => {
        (prisma.application.findMany as any).mockResolvedValue([
            { id: "app1", offer: { id: "1", title: "Monitor", Application: [{ status: "pending" }] } },
        ]);

        const res = await request(app).get("/applications");
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("id", "app1");
    });

    it("retorna 500 si hay error", async () => {
        (prisma.application.findMany as any).mockRejectedValue(new Error("Error"));
        const res = await request(app).get("/applications");
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error al obtener las aplicaciones");
    });

    // ✅ GET /view-profile
    it("retorna perfil con URLs", async () => {
        (prisma.studentProfile.findUnique as any).mockResolvedValue({
            id: "p1",
            userId: "user123",
            Photo: "uploads/profile/photo.jpg",
            Grades: "uploads/grades/grades.pdf",
        });

        const res = await request(app).get("/view-profile");
        expect(res.status).toBe(200);
        expect(res.body.Photo).toContain("http://");
    });

    it("retorna 404 si no existe", async () => {
        (prisma.studentProfile.findUnique as any).mockResolvedValue(null);
        const res = await request(app).get("/view-profile");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Perfil no encontrado");
    });

    it("retorna 500 si hay error", async () => {
        (prisma.studentProfile.findUnique as any).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).get("/view-profile");
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error interno del servidor");
    });

    // ✅ PATCH /update-profile
    it("actualiza perfil exitosamente", async () => {
        (prisma.studentProfile.update as any).mockResolvedValue({
            id: "p1",
            userId: "user123",
        });

        const res = await request(app)
            .patch("/update-profile")
            .send({
                profileData: JSON.stringify({
                    educations: [],
                    trainings: [],
                    languages: [],
                    systems: [],
                    workExperiences: [],
                    availabilities: [],
                }),
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", "p1");
    });

    it("retorna 500 si ocurre error", async () => {
        (prisma.studentProfile.update as any).mockRejectedValue(new Error("Error DB"));
        const res = await request(app)
            .patch("/update-profile")
            .send({
                profileData: JSON.stringify({
                    educations: [],
                    trainings: [],
                    languages: [],
                    systems: [],
                    workExperiences: [],
                    availabilities: [],
                }),
            });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error interno del servidor");
    });

    // ✅ PATCH /profile
    it("Crea perfil exitosamente", async () => {
        (prisma.studentProfile.create as any).mockResolvedValue({
            id: "p1",
            userId: "user123",
        });

        const res = await request(app)
            .post("/profile")
            .send({
                profileData: JSON.stringify({
                    educations: [],
                    trainings: [],
                    languages: [],
                    systems: [],
                    workExperiences: [],
                    availabilities: [],
                }),
            });

        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty("id", "p1");
    });

    it("Retorna 400 si no se suben archivos obligatorios", async () => {
        const res = await request(app)
            .post("/profile")
            .field("profileData", JSON.stringify({
                educations: [],
                trainings: [],
                languages: [],
                systems: [],
                workExperiences: [],
                availabilities: [],
            }));

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Datos del perfil invalidos");
    });

    it("profile retorna 500 si ocurre error", async () => {
        (prisma.studentProfile.create as any).mockRejectedValue(new Error("Error DB"));
        const res = await request(app)
            .post("/profile")
            .send({
                profileData: JSON.stringify({
                    educations: [],
                    trainings: [],
                    languages: [],
                    systems: [],
                    workExperiences: [],
                    availabilities: [],
                }),
            });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Error interno del servidor");
    });
});
