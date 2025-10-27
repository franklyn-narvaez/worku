import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { vi, describe, it, expect, beforeEach } from "vitest";
import router from "../controller";
import { prisma } from "@/libs/db";

vi.mock("@/libs/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    rolePermission: {
      findMany: vi.fn(),
    },
    sessions: {
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/", router);

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- LOGIN TESTS ---
  it("retorna 400 si los datos son inválidos", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "not-an-email", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Datos inválidos");
  });

  it("retorna 401 si el usuario no existe", async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);

    const res = await request(app)
      .post("/login")
      .send({ email: "test@email.com", password: "123456" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Usuario o contraseña no válidos");
  });

  it("retorna 401 si la contraseña no coincide", async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      id: "1",
      email: "test@email.com",
      password: "hashed",
      roleId: "student",
    });

    (bcrypt.compare as any).mockResolvedValue(false);

    const res = await request(app)
      .post("/login")
      .send({ email: "test@email.com", password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Usuario o contraseña no válidos");
  });

  it("retorna tokens y permisos válidos si el login es exitoso", async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      id: "1",
      email: "test@email.com",
      password: "hashed",
      roleId: "admin",
    });

    (bcrypt.compare as any).mockResolvedValue(true);
    (prisma.rolePermission.findMany as any).mockResolvedValue([
      { permission: { code: "READ" } },
      { permission: { code: "WRITE" } },
    ]);

    (jwt.sign as any).mockReturnValue("token123");
    (prisma.sessions.create as any).mockResolvedValue({});

    const res = await request(app)
      .post("/login")
      .send({ email: "test@email.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token", "token123");
    expect(res.body.permissions).toContain("READ");
  });

  // --- REFRESH TESTS ---
  it("retorna 401 si no hay refreshToken", async () => {
    const res = await request(app).post("/refresh");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No hay refresh token");
  });

  it("retorna 403 si el token no es válido", async () => {
    (jwt.verify as any).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app)
      .post("/refresh")
      .set("Cookie", "refreshToken=invalidToken");

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Token inválido");
  });

  it("genera nuevos tokens si el refresh es exitoso", async () => {
    (jwt.verify as any).mockReturnValue({ id: "1" });

    (prisma.sessions.findFirst as any).mockResolvedValue({
      id: "10",
      refreshToken: "oldToken",
      expiresAt: new Date(Date.now() + 10000),
    });

    (prisma.user.findUnique as any).mockResolvedValue({
      id: "1",
      roleId: "admin",
    });

    (prisma.rolePermission.findMany as any).mockResolvedValue([
      { permission: { code: "READ" } },
    ]);

    (jwt.sign as any).mockReturnValue("newAccessToken");
    (prisma.sessions.create as any).mockResolvedValue({});

    const res = await request(app)
      .post("/refresh")
      .set("Cookie", "refreshToken=validToken");

    expect(res.status).toBe(200);
    expect(res.body.access_token).toBe("newAccessToken");
  });

  // --- LOGOUT TESTS ---
  it("devuelve 200 aunque no haya token", async () => {
    const res = await request(app).post("/logout");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("No token to revoke");
  });

  it("borra el token y devuelve 200", async () => {
    (prisma.sessions.deleteMany as any).mockResolvedValue({ count: 1 });

    const res = await request(app)
      .post("/logout")
      .set("Cookie", "refreshToken=someToken");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logout successful");
  });
});
