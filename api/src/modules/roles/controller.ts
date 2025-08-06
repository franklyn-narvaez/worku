import { prisma } from "@/libs/db";
import { Router } from "express";

const router = Router();

router.get("", async (req, res)  => {
  try {
    const roles = await prisma.role.findMany()
    return res.json(roles)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

export default router;
