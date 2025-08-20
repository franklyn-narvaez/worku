import { prisma } from "@/libs/db";
import { Router } from "express";
import { CreateSchema } from "./createSchema";
import z from "zod";
import { UpdateSchema } from "./updateSchema";

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

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const offer = await prisma.offer.findUnique({
            where: { id },
            include: {
                college: true,
            }
        });

        if (!offer) {
            return res.status(404).json({ error: "Oferta no encontrado" });
        }

        return res.status(200).json(offer);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener la oferta" });
    }
});

router.patch("/update", async (req, res) => {
    try {
        const parseData = UpdateSchema.safeParse(req.body);

        if (!parseData.success) {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: z.treeifyError(parseData.error).properties //
            });
        }

        // Buscar al usuario que se va a actualizar
        const currentOffer = await prisma.offer.findUnique({
            where: { id: parseData.data.id }
        });

        if (!currentOffer) {
            return res.status(404).json({ error: "Oferta no encontrado" });
        }
        const updatedOffer = await prisma.offer.update({
            where: { id: parseData.data.id },
            data: {
                title: parseData.data.title,
                description: parseData.data.description,
                requirements: parseData.data.requirements,
                collegeId: parseData.data.collegeId,
                facultyId: parseData.data.facultyId,
                closeDate: parseData.data.closeDate,
                status: parseData.data.status ?? currentOffer.status, // Mantener el estado actual si no se proporciona uno nuevo
            },
        });
        return res.status(200).json(updatedOffer);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({errors: z.treeifyError(error)});
        }
        return res.status(500).json({ error: "Error al actualizar la oferta" });
    }
})

export default router;