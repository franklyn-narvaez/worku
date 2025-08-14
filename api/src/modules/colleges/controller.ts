import { prisma } from "@/libs/db";
import { Router } from "express";

const router = Router();

router.get("", async (req, res)  => {
  try {
    const college = await prisma.college.findMany()
    return res.status(200).json(college)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch colleges' });
  }
});

router.get("/faculty", async (req, res)  => {
  try {
    const faculty = await prisma.faculty.findMany()
    return res.status(200).json(faculty)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

export default router;
