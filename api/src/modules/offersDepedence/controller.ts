import { Router } from 'express';
import path from 'path';
import z from 'zod';
import { prisma } from '@/libs/db';
import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';
import { CreateSchema } from './createSchema';
import { UpdateSchema } from './updateSchema';

const router = Router();

router.get('', authenticate, authorize(['view_list_offer_dependence']), async (req, res) => {
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
				_count: {
					select: {
						Application: true,
					},
				},
			},
		});
		return res.status(200).json(offers);
	} catch (error) {
		return res.status(500).json({ error: 'Failed to fetch offers' });
	}
});

router.post('/create', authenticate, authorize(['create_offer_dependence']), async (req, res) => {
	try {
		const parseData = CreateSchema.safeParse(req.body);

		if (!parseData.success) {
			return res.status(400).json({
				message: 'Invalid data',
				errors: z.treeifyError(parseData.error).properties,
			});
		}
		const newOffer = await prisma.offer.create({
			data: { ...parseData.data },
		});

		return res.status(201).json(newOffer);
	} catch (error) {
		return res.status(500).json({ error: 'Failed to create offer' });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const offer = await prisma.offer.findUnique({
			where: { id },
			include: {
				college: true,
			},
		});

		if (!offer) {
			return res.status(404).json({ error: 'Oferta no encontrado' });
		}

		return res.status(200).json(offer);
	} catch (error) {
		return res.status(500).json({ error: 'Error al obtener la oferta' });
	}
});

router.patch('/update', authenticate, authorize(['update_offer_dependence']), async (req, res) => {
	try {
		const parseData = UpdateSchema.safeParse(req.body);

		if (!parseData.success) {
			return res.status(400).json({
				message: 'Datos inválidos',
				errors: z.treeifyError(parseData.error).properties, //
			});
		}

		// Buscar al usuario que se va a actualizar
		const currentOffer = await prisma.offer.findUnique({
			where: { id: parseData.data.id },
		});

		if (!currentOffer) {
			return res.status(404).json({ error: 'Oferta no encontrado' });
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
			return res.status(400).json({ errors: z.treeifyError(error) });
		}
		return res.status(500).json({ error: 'Error al actualizar la oferta' });
	}
});

router.get('/:id/applicants', authenticate, authorize(['view_applications_dependence']), async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'ID de oferta no proporcionado' });
	}

	try {
		const offer = await prisma.offer.findUnique({
			where: { id },
			select: { id: true, title: true },
		});

		if (!offer) {
			return res.status(404).json({ error: 'Oferta no encontrada' });
		}

		const applications = await prisma.application.findMany({
			where: { offerId: id as string },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						lastName: true,
						email: true,
						college: {
							select: {
								id: true,
								name: true,
								faculty: { select: { id: true, name: true } },
							},
						},
					},
				},
			},
			orderBy: { appliedAt: 'desc' },
		});

		// Mapear para devolver solo información relevante
		const applicants = applications.map(app => ({
			applicationId: app.id,
			status: app.status,
			appliedAt: app.appliedAt,
			interviewDate: app.interviewDate,
			attendedInterview: app.attendedInterview,
			user: app.user,
		}));

		return res.status(200).json({
			offer,
			applicants,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Error al obtener los usuarios de la oferta' });
	}
});

router.patch('/:id/status', authenticate, authorize(['view_applications_dependence']), async (req, res) => {
	const { id } = req.params;
	const { status, interviewDate, attendedInterview } = req.body;

	const validStatuses = ['UNDER_REVIEW', 'CALLED_FOR_INTERVIEW', 'APPROVED', 'REJECTED'];

	if (!validStatuses.includes(status)) {
		return res.status(400).json({ error: 'Estado inválido' });
	}

	try {
		if (!id) {
			return res.status(400).json({ error: 'ID de aplicación no proporcionado' });
		}

		const application = await prisma.application.findUnique({
			where: { id },
		});

		if (!application) {
			return res.status(404).json({ error: 'Aplicación no encontrada' });
		}

		// 🔒 Validaciones de flujo
		if (application.status === 'SENT' && status !== 'UNDER_REVIEW') {
			return res.status(400).json({ error: 'Debe pasar primero por revisión' });
		}

		if (application.status === 'UNDER_REVIEW' && status === 'APPROVED') {
			return res.status(400).json({ error: 'Debe pasar por entrevista antes de aprobar' });
		}

		if (status === 'CALLED_FOR_INTERVIEW' && !interviewDate) {
			return res.status(400).json({ error: 'Debe incluir una fecha de entrevista' });
		}

		// 🔸 Si se intenta marcar asistencia a entrevista
		if (typeof attendedInterview === 'boolean') {
			if (!application.interviewDate) {
				return res.status(400).json({ error: 'No se puede marcar asistencia sin fecha de entrevista' });
			}

			const now = new Date();
			const interview = new Date(application.interviewDate);

			if (interview > now) {
				return res.status(400).json({ error: 'No puedes marcar asistencia antes de la fecha de entrevista' });
			}
		}

		// 🔸 Si se aprueba o rechaza antes de la entrevista
		if ((status === 'APPROVED' || status === 'REJECTED') && application.interviewDate) {
			const now = new Date();
			const interview = new Date(application.interviewDate);
			if (interview > now) {
				return res.status(400).json({
					error: 'No se puede aprobar o rechazar antes de la fecha de la entrevista',
				});
			}
		}

		const updated = await prisma.application.update({
			where: { id },
			data: {
				status,
				interviewDate: status === 'CALLED_FOR_INTERVIEW' ? new Date(interviewDate) : application.interviewDate,
				attendedInterview: typeof attendedInterview === 'boolean' ? attendedInterview : application.attendedInterview,
			},
		});

		return res.status(200).json(updated);
	} catch (error) {
		console.error('Error al actualizar aplicación:', error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
});

router.get('/:id/details', authenticate, authorize(['view_applications_dependence']), async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'ID de oferta no proporcionado' });
	}

	try {
		const offer = await prisma.offer.findUnique({
			where: { id: id as string },
			select: {
				id: true,
				title: true,
				description: true,
				requirements: true,
				status: true,
				createdAt: true,
				updatedAt: true,
				closeDate: true,
				college: {
					select: {
						id: true,
						name: true,
						faculty: { select: { id: true, name: true } },
					},
				},
				_count: {
					select: {
						Application: true,
					},
				},
				Application: {
					select: {
						id: true,
						appliedAt: true,
						status: true,
						user: {
							select: {
								id: true,
								name: true,
								lastName: true,
								email: true,
								StudentProfile: {
									select: {
										studentCode: true,
										fullName: true,
										planName: true,
										semester: true,
										campus: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!offer) {
			return res.status(404).json({ error: 'Offer not found' });
		}

		return res.status(200).json(offer);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Failed to fetch offer details' });
	}
});

router.get('/applicants/:id/profile', authenticate, authorize(['view_applications_dependence']), async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({ error: 'Falta el ID del usuario' });
		}
		const profile = await prisma.studentProfile.findUnique({
			where: { userId: id },
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
			return res.status(404).json({ message: 'Perfil no encontrado' });
		}

		const profileWithUrls = {
			...profile,
			Photo: profile.Photo
				? `${req.protocol}://${req.get('host')}/uploads/profile/${path.basename(profile.Photo)}`
				: null,
			Grades: profile.Grades
				? `${req.protocol}://${req.get('host')}/uploads/grades/${path.basename(profile.Grades)}`
				: null,
		};

		return res.status(200).json(profileWithUrls);
	} catch (error) {
		console.error('Error fetching profile:', error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
});

router.get('/offers/applicants-stats', authenticate, authorize(['view_applications_dependence']), async (req, res) => {
	try {
		const offerStats = await prisma.offer.findMany({
			select: {
				id: true,
				title: true,
				_count: {
					select: { Application: true },
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const formatted = offerStats.map(o => ({
			offerTitle: o.title,
			totalApplicants: o._count.Application,
		}));

		return res.status(200).json({ data: formatted });
	} catch (error) {
		console.error('Error al obtener estadísticas de ofertas:', error);
		return res.status(500).json({ error: 'Error interno del servidor.' });
	}
});

router.get('/offers/results', authenticate, authorize(['view_applications_dependence']), async (req, res) => {
	try {
		const results = await prisma.application.groupBy({
			by: ['offerId', 'status'],
			_count: { id: true },
			where: {
				status: { in: ['APPROVED', 'REJECTED'] },
			},
		});

		// Enlazamos título de oferta
		const offerTitles = await prisma.offer.findMany({
			select: { id: true, title: true },
		});
		const titleMap = Object.fromEntries(offerTitles.map(o => [o.id, o.title]));

		const formatted = results.map(r => ({
			offerTitle: titleMap[r.offerId] || 'Desconocida',
			status: r.status,
			total: r._count.id,
		}));

		return res.status(200).json({ data: formatted });
	} catch (error) {
		console.error('Error al obtener resultados de ofertas:', error);
		return res.status(500).json({ error: 'Error interno del servidor.' });
	}
});

router.get(
	'/offers/faculty-distribution',
	authenticate,
	authorize(['view_applications_dependence']),
	async (req, res) => {
		try {
			const data = await prisma.application.findMany({
				select: {
					user: {
						select: {
							college: {
								select: {
									name: true,
									faculty: { select: { name: true } },
								},
							},
						},
					},
				},
			});

			const countMap: Record<string, number> = {};

			data.forEach(app => {
				const faculty = app.user?.college?.faculty?.name || 'Sin facultad';
				countMap[faculty] = (countMap[faculty] || 0) + 1;
			});

			const formatted = Object.entries(countMap).map(([faculty, total]) => ({
				faculty,
				total,
			}));

			return res.status(200).json({ data: formatted });
		} catch (error) {
			console.error('Error al obtener distribución por facultad:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	},
);

router.get('/offers/common-skills', authenticate, authorize(['view_applications_dependence']), async (req, res) => {
	try {
		const skills = await prisma.systemSkill.findMany({
			select: {
				programName: true,
				student: {
					select: {
						user: {
							select: {
								Application: {
									select: { offerId: true },
								},
							},
						},
					},
				},
			},
		});

		const skillCount: Record<string, number> = {};

		skills.forEach(skill => {
			if (skill.programName) {
				skillCount[skill.programName] = (skillCount[skill.programName] || 0) + 1;
			}
		});

		const formatted = Object.entries(skillCount)
			.map(([skill, total]) => ({ skill, total }))
			.sort((a, b) => b.total - a.total)
			.slice(0, 10); // top 10 habilidades

		return res.status(200).json({ data: formatted });
	} catch (error) {
		console.error('Error al obtener habilidades comunes:', error);
		return res.status(500).json({ error: 'Error interno del servidor.' });
	}
});

export default router;
