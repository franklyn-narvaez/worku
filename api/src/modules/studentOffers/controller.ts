import { prisma } from "@/libs/db";
import { Router } from "express";
import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorize";
import z from "zod";
import { buildNestedCreate } from "@/utils/PrismaHelper";
import { uploadPhoto } from "@/middlewares/upload";
import { ProfileSchema } from "./schemas/ProfileSchema";

const router = Router();

router.get("", authenticate, authorize(["view_offer"]), async (req, res) => {
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
					},
				},
				faculty: {
					select: {
						id: true,
						name: true,
					},
				},
				Application: {
					where: {
						userId: req.user.id,
					},
					select: {
						status: true,
					},
				},
			},
		});
		const formattedOffers = offers.map((offer) => ({
			...offer,
			userApplicationStatus: offer.Application[0]?.status || null,
			Application: undefined,
		}));

		return res.status(200).json(formattedOffers);
	} catch (error) {
		return res.status(500).json({ error: "Failed to fetch offers" });
	}
});

router.post("/:offerId/apply", authenticate, async (req, res) => {
	const { offerId } = req.params;
	const userId = req.user.id; // Obtenido desde el token

	if (!offerId) {
		return res.status(400).json({ error: "ID de oferta inválido" });
	}

	try {
		const offer = await prisma.offer.findUnique({ where: { id: offerId } });
		if (!offer) {
			return res.status(404).json({ error: "Oferta no encontrada" });
		}

		const application = await prisma.application.create({
			data: {
				userId,
				offerId,
			},
		});

		return res.status(201).json(application);
	} catch (error) {
		if ((error as any)?.code === "P2002") {
			return res.status(400).json({ error: "Ya has aplicado a esta oferta" });
		}
		return res.status(500).json({ error: "Error al aplicar a la oferta" });
	}
});

router.get("/applications", authenticate, async (req, res) => {
	try {
		const applications = await prisma.application.findMany({
			where: {
				userId: req.user.id,
			},
			include: {
				offer: {
					select: {
						id: true,
						title: true,
						description: true,
						closeDate: true,
					},
				},
			},
		});

		return res.status(200).json(applications);
	} catch (error) {
		console.error("Error fetching applications:", error);
		return res.status(500).json({ error: "Error al obtener las aplicaciones" });
	}
});

router.post(
	"/profile",
	authenticate,
	authorize(["create_profile"]),
	uploadPhoto.single('photo'),
	async (req, res) => {
		try {
  		console.log("req.file:", req.file);
  		console.log("req.body:", req.body);


			if (!req.file) {
				return res.status(400).json({
					message: "La imagen es obligatoria",
				});
			}

			let parsedRequestData;
			try {
				parsedRequestData = JSON.parse(req.body.profileData);
			} catch (error) {
				return res.status(400).json({
					message: "Datos del perfil inválidos",
				});
			}

			parsedRequestData.photo = req.file.path;

			const parsedProfile = ProfileSchema.safeParse(parsedRequestData);

			if (!parsedProfile.success) {
				console.log("Validation errors:", parsedProfile.error);
				return res.status(400).json({
					message: "Datos inválidos",
					errors: parsedProfile.error.format(),
				});
			}

			const {
				educations,
				trainings,
				languages,
				systems,
				workExperiences,
				availabilities,
				photo,
				...basicData
			} = parsedProfile.data;

			const createData: any = {
				...basicData,
				Photo: photo,
				isComplete: true,
				user: { connect: { id: req.user.id } },
			};

			const nestedRelations = {
				educations,
				trainings,
				languages,
				systems,
				workExperiences,
				availabilities,
			};

			for (const [key, value] of Object.entries(nestedRelations)) {
				const nested = buildNestedCreate(value as any[]);
				if (nested) createData[key] = nested;
			}

			const profileData = await prisma.studentProfile.create({
				data: createData,
				include: {
					educations: true,
					trainings: true,
					languages: true,
					systems: true,
					workExperiences: true,
					availabilities: true,
				},
			});

			return res.status(201).json({
				message: "Perfil creado exitosamente",
				data: profileData,
			});
		} catch (error) {
			console.error("Error creando perfil:", error);
			return res.status(500).json({ error: "Error interno del servidor" });
		}
	},
);

router.get(
	"/view-profile",
	authenticate,
	authorize(["update_profile"]),
	async (req, res) => {
		try {
			const profile = await prisma.studentProfile.findUnique({
				where: { userId: req.user.id },
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

			return res.status(200).json(profile);
		} catch (error) {
			console.error("Error fetching profile:", error);
			return res.status(500).json({ error: "Error interno del servidor" });
		}
	},
);

router.patch(
	"/update-profile",
	authenticate,
	authorize(["update_profile"]),
	async (req, res) => {
		try {
			const parsed = ProfileSchema.safeParse(req.body);

			if (!parsed.success) {
				return res.status(400).json({
					message: "Datos inválidos",
					errors: parsed.error.format(),
				});
			}

			const {
				educations,
				trainings,
				languages,
				systems,
				workExperiences,
				availabilities,
				...basicData
			} = parsed.data;

			const updatedProfile = await prisma.studentProfile.update({
				where: { userId: req.user.id },
				data: {
					...basicData,
					isComplete: true,
					educations: {
						deleteMany: {},
						create: educations,
					},
					trainings: {
						deleteMany: {},
						create: trainings ?? [],
					},
					languages: {
						deleteMany: {},
						create: languages ?? [],
					},
					systems: {
						deleteMany: {},
						create: systems ?? [],
					},
					workExperiences: {
						deleteMany: {},
						create: workExperiences ?? [],
					},
					availabilities: {
						deleteMany: {},
						create: availabilities ?? [],
					},
				},
				include: {
					educations: true,
					trainings: true,
					languages: true,
					systems: true,
					workExperiences: true,
					availabilities: true,
				},
			});

			res.status(200).json(updatedProfile);
		} catch (error) {
			console.error("Error actualizando perfil:", error);
			res.status(500).json({ error: "Error interno del servidor" });
		}
	},
);

export default router;
