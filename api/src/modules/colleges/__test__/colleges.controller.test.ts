import request from "supertest";
import express from "express";
import { vi, describe, it, expect, beforeEach } from "vitest";
import router from "../controller";
import { prisma } from "@/libs/db";

vi.mock("@/libs/db", () => ({
  prisma: {
    college: {
      findMany: vi.fn(),
    },
    faculty: {
      findMany: vi.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use("/", router);

describe("College Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- COLLEGE TESTS ---
  it("retorna 200 con lista de colleges", async () => {
    const mockColleges = [
      { id: "1", name: "College A" },
      { id: "2", name: "College B" },
    ];
    (prisma.college.findMany as any).mockResolvedValue(mockColleges);

    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockColleges);
  });

  it("retorna 500 si ocurre un error al obtener colleges", async () => {
    (prisma.college.findMany as any).mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch colleges");
  });

  // --- FACULTY TESTS ---
  it("retorna 200 con lista de faculty", async () => {
    const mockFaculty = [
      { id: "1", name: "Faculty A" },
      { id: "2", name: "Faculty B" },
    ];
    (prisma.faculty.findMany as any).mockResolvedValue(mockFaculty);

    const res = await request(app).get("/faculty");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockFaculty);
  });

  it("retorna 500 si ocurre un error al obtener faculty", async () => {
    (prisma.faculty.findMany as any).mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/faculty");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch faculty");
  });
});
