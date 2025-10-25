import request from "supertest";
import express from "express";
import { vi, describe, it, expect, beforeEach } from "vitest";
import router from "../controller";
import { prisma } from "@/libs/db";

vi.mock("@/libs/db", () => ({
    prisma: {
        role: {
            findMany: vi.fn(),
        },
    },
}));

const app = express();
app.use(express.json());
app.use("/", router);

describe("Roles Controller", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("retorna 200 y la lista de roles", async () => {
        const mockRoles = [
            { id: "1", name: "Administrador" },
            { id: "2", name: "Estudiante" },
        ];

        (prisma.role.findMany as any).mockResolvedValue(mockRoles);
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRoles);
        expect(prisma.role.findMany).toHaveBeenCalledTimes(1);
    });

    it("retorna 500 si ocurre un error al obtener los roles", async () => {
        (prisma.role.findMany as any).mockRejectedValue(new Error("DB Error"));
        const res = await request(app).get("/");
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Failed to fetch roles");
    });
});
