import request from "supertest";
import express from "express";
import { vi, describe, it, expect, beforeEach } from "vitest";
import router from "../controller";
import { prisma } from "@/libs/db";

vi.mock("@/libs/db", () => ({
    prisma: {
        offer: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        },
    },
}));

vi.mock("@/middlewares/authenticate", () => ({
    authenticate: vi.fn((req: express.Request, res: express.Response, next: express.NextFunction) => next()),
}));

vi.mock("@/middlewares/authorize", () => ({
    authorize: vi.fn(() => (req: express.Request, res: express.Response, next: express.NextFunction) => next()),
}));

const app = express();
app.use(express.json());
app.use("/", router);

describe("Offer Controller", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    //Lista de ofertas
    it("retorna 200 con la lista de ofertas", async () => {
        (prisma.offer.findMany as any).mockResolvedValue([{ id: "1", title: "Test Offer" }]);

        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: "1", title: "Test Offer" }]);
    });

    it("retorna 500 si ocurre un error en GET /", async () => {
        (prisma.offer.findMany as any).mockRejectedValue(new Error("DB Error"));

        const res = await request(app).get("/");
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
    });

    //Crear oferta
    it("crea una oferta correctamente", async () => {
        const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // mañana
        const mockData = {
            title: "Nueva Oferta",
            description: "Descripción completa",
            requirements: "Requisitos claros",
            collegeId: "1",
            facultyId: "1",
            closeDate: futureDate.toISOString(),
        };

        (prisma.offer.create as any).mockResolvedValue({ id: "1", ...mockData });

        const res = await request(app).post("/create").send(mockData);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: "1", ...mockData });
    });

    it("retorna 400 si los datos son inválidos en POST /create", async () => {
        const res = await request(app).post("/create").send({ title: "" });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid data");
    });

    it("retorna 500 si ocurre un error al crear una oferta", async () => {
        (prisma.offer.create as any).mockRejectedValue(new Error("DB Error"));
        const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const mockData = {
            title: "Oferta error",
            description: "Desc",
            requirements: "Req",
            collegeId: "1",
            facultyId: "1",
            closeDate: futureDate.toISOString(),
        };
        const res = await request(app).post("/create").send(mockData);
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Failed to create offer");
    });

    // Obtener oferta por ID
    it("retorna 200 con la oferta por id", async () => {
        (prisma.offer.findUnique as any).mockResolvedValue({ id: "1", title: "Test Offer" });
        const res = await request(app).get("/1");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", "1");
    });

    it("retorna 404 si la oferta no existe", async () => {
        (prisma.offer.findUnique as any).mockResolvedValue(null);
        const res = await request(app).get("/999");
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Oferta no encontrado");
    });

    it("retorna 500 si ocurre un error en GET /:id", async () => {
        (prisma.offer.findUnique as any).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).get("/1");
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Error al obtener la oferta");
    });

    //Actualizar oferta
    it("actualiza una oferta correctamente", async () => {
        const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const mockUpdate = {
            id: "1",
            title: "Título actualizado",
            description: "Descripción actualizada",
            requirements: "Requisitos actualizados",
            collegeId: "1",
            facultyId: "1",
            closeDate: futureDate.toISOString(),
            status: true,
        };

        (prisma.offer.findUnique as any).mockResolvedValue(mockUpdate); // currentOffer
        (prisma.offer.update as any).mockResolvedValue(mockUpdate);

        const res = await request(app).patch("/update").send(mockUpdate);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUpdate);
    });

    it("retorna 404 si la oferta a actualizar no existe", async () => {
        const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const mockUpdate = {
            id: "999",
            title: "X",
            description: "X",
            requirements: "X",
            collegeId: "1",
            facultyId: "1",
            closeDate: futureDate.toISOString(),
            status: true,
        };

        (prisma.offer.findUnique as any).mockResolvedValue(null);

        const res = await request(app).patch("/update").send(mockUpdate);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Oferta no encontrado");
    });

    it("retorna 400 si los datos son inválidos en PATCH /update", async () => {
        const res = await request(app).patch("/update").send({ id: "" });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Datos inválidos");
    });

    it("retorna 500 si ocurre un error al actualizar una oferta", async () => {
        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días después
        const mockData = {
            id: "1",
            title: "Oferta con error",
            description: "Descripción válida",
            requirements: "Requisitos válidos",
            collegeId: "1",
            facultyId: "1",
            closeDate: futureDate.toISOString(), // Fecha futura
            status: true,
        };

        (prisma.offer.findUnique as any).mockResolvedValue(mockData);
        (prisma.offer.update as any).mockRejectedValue(new Error("DB Error"));

        const res = await request(app).patch("/update").send(mockData);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Error al actualizar la oferta");
    });
});
