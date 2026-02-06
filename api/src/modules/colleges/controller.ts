import { Router } from 'express';
import { prisma } from '@/libs/db';

const router = Router();

// Endpoint para obtener colleges, opcionalmente filtrados por facultyId
router.get('', async (req, res) => {
	const { facultyId } = req.query;

	try {
		const whereClause = facultyId ? { facultyId: facultyId.toString() } : {};
		const colleges = await prisma.college.findMany({
			where: whereClause,
			select: {
				id: true,
				name: true,
				facultyId: true,
			},
		});
		return res.status(200).json(colleges);
	} catch (error) {
		return res.status(500).json({ error: 'Failed to fetch colleges' });
	}
});

// Endpoint para obtener todas las facultades
router.get('/faculty', async (req, res) => {
	try {
		const faculty = await prisma.faculty.findMany();
		return res.status(200).json(faculty);
	} catch (error) {
		return res.status(500).json({ error: 'Failed to fetch faculty' });
	}
});

export default router;
