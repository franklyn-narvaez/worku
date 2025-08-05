import { prisma } from "@/libs/db";
import { Router } from "express";

const router = Router();

router.get("", async (req, res)  => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        createdDate: true,
        status: true,
      },
    })
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
