import { prisma } from "@/libs/db";
import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorize";
import { Router } from "express";
import path from "path";

const router = Router();

router.get(
    "/profiles/review",
    authenticate,
authorize(["review_profiles"]),
    async (req, res) => {
        try {
            const profiles = await prisma.studentProfile.findMany({
                where: {
                    status: "SUBMITTED",
                },
                include: {
                    user: {
                        select: {
                            email: true,
                            role: true,
                        },
                    },
                },
            });

            console.log(profiles);

            if (profiles.length === 0) {
                return res.status(404).json({ message: "No hay perfiles para revisión." });
            }

            const profilesWithUrls = profiles.map((profile) => ({
                ...profile,
                Photo: profile.Photo
                    ? `${req.protocol}://${req.get("host")}/uploads/profile/${path.basename(profile.Photo)}`
                    : null,
                Grades: profile.Grades
                    ? `${req.protocol}://${req.get("host")}/uploads/grades/${path.basename(profile.Grades)}`
                    : null,
            }));

            return res.status(200).json(profilesWithUrls);
        } catch (error) {
            console.error("Error al obtener perfiles para revisión:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
);

router.get(
    "/:id/profile",
    authenticate,
    authorize(["review_profiles"]),
    async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: "Falta el ID del usuario" });
            }

            const profile = await prisma.studentProfile.findUnique({
                where: { id },
                include: {
                    educations: true,
                    trainings: true,
                    languages: true,
                    systems: true,
                    workExperiences: true,
                    availabilities: true,
                },
            });

            if (!profile) {
                return res.status(404).json({ message: "Perfil no encontrado" });
            }
            const status = String(profile.status);
            if (status !== "SUBMITTED") {
                return res.status(403).json({ message: "Este perfil no está en revisión." });
            }

            const profileWithUrls = {
                ...profile,
                Photo: profile.Photo
                    ? `${req.protocol}://${req.get("host")}/uploads/profile/${path.basename(profile.Photo)}`
                    : null,
                Grades: profile.Grades
                    ? `${req.protocol}://${req.get("host")}/uploads/grades/${path.basename(profile.Grades)}`
                    : null,
            };

            return res.status(200).json(profileWithUrls);
        } catch (error) {
            console.error("Error fetching profile:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
);

router.patch(
    "/:id/status",
    authenticate,
    authorize(["review_profiles"]),
    async (req, res) => {
        const { id } = req.params;
        const { status, comment } = req.body;

        const validStatuses = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Estado inválido." });
        }

        try {
            if (!id) {
                return res.status(400).json({ error: "ID de perfil no proporcionado." });
            }

            const profile = await prisma.studentProfile.findUnique({ where: { id } });

            if (!profile) {
                return res.status(404).json({ error: "Perfil no encontrado." });
            }

            if (["APPROVED", "REJECTED"].includes(profile.status)) {
                return res.status(400).json({
                    error: "El perfil ya ha sido revisado y no puede modificarse.",
                });
            }

            if (status === "REJECTED" && (!comment || comment.trim() === "")) {
                return res.status(400).json({ error: "Debe ingresar un comentario al rechazar el perfil" });
            }

            const updateData: any = {
                status,
                rejectComment: status === "REJECTED" ? comment.trim() : null,
            };

            if (["APPROVED", "REJECTED"].includes(status)) {
                updateData.reviewedAt = new Date();
            }

            const updated = await prisma.studentProfile.update({
                where: { id },
                data: updateData,
            });

            return res.status(200).json(updated);
        } catch (error) {
            console.error("Error al actualizar estado del perfil:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    }
);

router.get(
    "/profiles/history",
    authenticate,
    authorize(["review_profiles"]),
    async (req, res) => {
        try {
            const profiles = await prisma.studentProfile.findMany({
                where: {
                    status: {
                        in: ["APPROVED", "REJECTED"],
                    },
                },
                include: {
                    user: {
                        select: {
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: { reviewedAt: "desc" },
            });

            if (profiles.length === 0) {
                return res.status(404).json({ message: "No hay perfiles revisados." });
            }

            const profilesWithUrls = profiles.map((profile) => ({
                ...profile,
                Photo: profile.Photo
                    ? `${req.protocol}://${req.get("host")}/uploads/profile/${path.basename(profile.Photo)}`
                    : null,
                Grades: profile.Grades
                    ? `${req.protocol}://${req.get("host")}/uploads/grades/${path.basename(profile.Grades)}`
                    : null,
            }));

            return res.status(200).json(profilesWithUrls);
        } catch (error) {
            console.error("Error al obtener historial de perfiles revisados:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
);

router.get(
    "/:id/profile/history",
    authenticate,
    authorize(["review_profiles"]),
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Falta el ID del perfil." });
            }

            const profile = await prisma.studentProfile.findUnique({
                where: { id },
                include: {
                    educations: true,
                    trainings: true,
                    languages: true,
                    systems: true,
                    workExperiences: true,
                    availabilities: true,
                    user: {
                        select: { email: true },
                    },
                },
            });

            if (!profile) {
                return res.status(404).json({ message: "Perfil no encontrado." });
            }

            if (!["APPROVED", "REJECTED"].includes(profile.status)) {
                return res.status(403).json({ message: "El perfil no ha sido revisado aún." });
            }

            const profileWithUrls = {
                ...profile,
                Photo: profile.Photo
                    ? `${req.protocol}://${req.get("host")}/uploads/profile/${path.basename(profile.Photo)}`
                    : null,
                Grades: profile.Grades
                    ? `${req.protocol}://${req.get("host")}/uploads/grades/${path.basename(profile.Grades)}`
                    : null,
            };

            return res.status(200).json(profileWithUrls);
        } catch (error) {
            console.error("Error al obtener perfil histórico:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    }
);

export default router;
