import { prisma } from "@/libs/db";
import { Router } from "express";

const router = Router();

router.get("", async (req, res)  => {
  try {
    const college = await prisma.college.findMany()
    return res.json(college)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch colleges' });
  }
});

export default router;
