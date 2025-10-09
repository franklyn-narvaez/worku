import { prisma } from "@/libs/db";
import { Router } from "express";
import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorize";
import z from "zod";
import { buildNestedCreate } from "@/utils/PrismaHelper";
import { ProfileSchema } from "./schemas/ProfileSchema";
import path from "path";
import { upload } from "@/middlewares/upload";

interface MulterRequest extends Request {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

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
	upload.fields([
		{ name: 'photo', maxCount: 1 },
		{ name: 'grades', maxCount: 1 }
	]),
	async (req, res) => {
		try {
			console.log("req.files:", req.files);
			console.log("req.body:", req.body);

			const files = req.files as { [fieldname: string]: Express.Multer.File[] };

			if (!files ||
				!files['photo'] || files['photo'].length === 0 ||
				!files['grades'] || files['grades'].length === 0) {
				return res.status(400).json({
					message: "La imagen y el certificado de notas son obligatorios",
				});
			}

			const photoFile = files['photo'][0];
			const gradesFile = files['grades'][0];

			if (!photoFile || !gradesFile) {
				return res.status(400).json({
					message: "Error al procesar los archivos subidos",
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

			parsedRequestData.photo = photoFile.path;
			parsedRequestData.grades = gradesFile.path;

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
				grades,
				...basicData
			} = parsedProfile.data;

			const createData: any = {
				...basicData,
				Photo: photo,
				Grades: grades,
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

			const profileWithUrls = {
				...profile,
				Photo: profile.Photo ? `${req.protocol}://${req.get('host')}/uploads/profile/${path.basename(profile.Photo)}` : null,
				Grades: profile.Grades ? `${req.protocol}://${req.get('host')}/uploads/grades/${path.basename(profile.Grades)}` : null
			};

			return res.status(200).json(profileWithUrls);
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
	upload.fields([
		{ name: 'photo', maxCount: 1 },
		{ name: 'grades', maxCount: 1 }
	]),
	async (req, res) => {
		try {
			let parsedData;

			const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

			if (files && (files['photo'] || files['grades'])) {
				parsedData = JSON.parse(req.body.profileData);

				if (files['photo'] && files['photo'].length > 0) {
					const photoFile = files['photo'][0];
					if (photoFile) {
						parsedData.photo = photoFile.path;
					}
				}

				if (files['grades'] && files['grades'].length > 0) {
					const gradesFile = files['grades'][0];
					if (gradesFile) {
						parsedData.grades = gradesFile.path;
					}
				}
			} else {
				parsedData = req.body;
			}

			const parsed = ProfileSchema.safeParse(parsedData);

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
				photo,
				grades,
				...basicData
			} = parsed.data;

			const updateData: any = {
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
			};

			if (photo) {
				updateData.Photo = photo;
			}
			if (grades) {
				updateData.Grades = grades;
			}

			const updatedProfile = await prisma.studentProfile.update({
				where: { userId: req.user.id },
				data: updateData,
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
