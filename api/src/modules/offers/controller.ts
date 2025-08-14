import { prisma } from "@/libs/db";
import { Router } from "express";
import { CreateSchema } from "./createSchema";
import z from "zod";

const router = Router();

router.get("", async (req, res) => {
    try {
        const offers = await prisma.offer.findMany({
            select: {
                id: true,
                title: true,
                requirements: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                closeDate: true,
                status: true,
                college: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
        });
        return res.status(200).json(offers);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

router.post("/create", async (req, res) => {
    try {
        const parseData = CreateSchema.safeParse(req.body);
        
        if (!parseData.success) {
            return res.status(400).json({
                message: 'Invalid data',
                errors: z.treeifyError(parseData.error).properties
            });
        }
        const newOffer = await prisma.offer.create({
            data: {...parseData.data },
        });

        return res.status(201).json(newOffer);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create offer' });
    }
});

export default router;