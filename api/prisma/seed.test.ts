import { type Permission, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function seedTest(prisma: PrismaClient) {
	const permissions = [
		{ code: 'create_offer', name: 'Crear Oferta' },
		{ code: 'create_user', name: 'Crear Usuario' },
		{ code: 'view_list_offer', name: 'Ver Lista Oferta' },
		{ code: 'view_list_user', name: 'Ver Lista Usuario' },
		{ code: 'update_offer', name: 'Actualizar Oferta' },
		{ code: 'update_user', name: 'Actualizar Usuario' },

		{ code: 'create_offer_dependence', name: 'Crear Oferta Dependencia' },
		{
			code: 'view_list_offer_dependence',
			name: 'Ver Lista Oferta Dependencia',
		},
		{ code: 'update_offer_dependence', name: 'Actualizar Oferta Dependencia' },
		{
			code: 'view_applications_dependence',
			name: 'Ver Aplicaciones Dependencia',
		},

		{ code: 'view_offer', name: 'Ver Oferta' },
		{ code: 'apply_offer', name: 'Aplicar Oferta' },
		{ code: 'create_profile', name: 'Crear Perfil' },
		{ code: 'update_profile', name: 'Actualizar Perfil' },
		{ code: 'view_applications', name: 'Ver Aplicaciones' },

		{ code: 'review_profiles', name: 'Revisar Perfiles' },
	];

	const createPermissions: Permission[] = [];

	// Crear permisos
	for (const permission of permissions) {
		const result = await prisma.permission.upsert({
			where: { code: permission.code },
			update: {},
			create: {
				code: permission.code,
				name: permission.name,
			},
		});
		createPermissions.push(result);
	}

	// Crear Roles si no existen
	const admin = await prisma.role.upsert({
		where: { code: 'admin' },
		update: {},
		create: {
			code: 'admin',
			name: 'Administrador',
		},
	});

	const dependence = await prisma.role.upsert({
		where: { code: 'dependence' },
		update: {},
		create: {
			code: 'dependence',
			name: 'Dependencia',
		},
	});

	// Crear Role de Estudiante si no existe
	const student = await prisma.role.upsert({
		where: { code: 'student' },
		update: {},
		create: {
			code: 'student',
			name: 'Estudiante',
		},
	});

	const director = await prisma.role.upsert({
		where: { code: 'director' },
		update: {},
		create: {
			code: 'director',
			name: 'Director',
		},
	});

	// Asociar todos los permisos al rol admin
	const codeAdminPermissions = [
		'create_offer',
		'create_user',
		'view_list_offer',
		'view_list_user',
		'update_offer',
		'update_user',
	];
	const adminPermissions = createPermissions.filter(p => codeAdminPermissions.includes(p.code));
	for (const perm of adminPermissions) {
		const permission = await prisma.permission.findUnique({
			where: { code: perm.code },
		});
		if (permission) {
			await prisma.rolePermission.upsert({
				where: {
					roleId_permissionId: {
						roleId: admin.id,
						permissionId: permission.id,
					},
				},
				update: {},
				create: {
					roleId: admin.id,
					permissionId: permission.id,
				},
			});
		}
	}

	// Asignar permisos al rol estudiante
	const codeStudentPermissions = ['create_profile', 'update_profile', 'view_offer', 'apply_offer', 'view_applications'];
	const studentPermissions = createPermissions.filter(p => codeStudentPermissions.includes(p.code));
	for (const perm of studentPermissions) {
		const permission = await prisma.permission.findUnique({
			where: { code: perm.code },
		});

		if (permission) {
			await prisma.rolePermission.upsert({
				where: {
					roleId_permissionId: {
						roleId: student.id,
						permissionId: permission.id,
					},
				},
				update: {},
				create: {
					roleId: student.id,
					permissionId: permission.id,
				},
			});
		}
	}

	const codeDependencePermissions = [
		'create_offer_dependence',
		'view_list_offer_dependence',
		'update_offer_dependence',
		'view_applications_dependence',
	];
	const dependencePermissions = createPermissions.filter(p => codeDependencePermissions.includes(p.code));
	for (const perm of dependencePermissions) {
		const permission = await prisma.permission.findUnique({
			where: { code: perm.code },
		});

		if (permission) {
			await prisma.rolePermission.upsert({
				where: {
					roleId_permissionId: {
						roleId: dependence.id,
						permissionId: permission.id,
					},
				},
				update: {},
				create: {
					roleId: dependence.id,
					permissionId: permission.id,
				},
			});
		}
	}

	const codeDirectorPermissions = ['review_profiles'];
	const directorPermissions = createPermissions.filter(p => codeDirectorPermissions.includes(p.code));
	for (const perm of directorPermissions) {
		const permission = await prisma.permission.findUnique({
			where: { code: perm.code },
		});

		if (permission) {
			await prisma.rolePermission.upsert({
				where: {
					roleId_permissionId: {
						roleId: director.id,
						permissionId: permission.id,
					},
				},
				update: {},
				create: {
					roleId: director.id,
					permissionId: permission.id,
				},
			});
		}
	}

	// Crear Faculty
	const data = [
		{
			faculty: 'Facultad de Ingeniería',
			colleges: ['Escuela de Sistemas', 'Escuela de Civil', 'Escuela de Mecánica'],
		},
		{
			faculty: 'Facultad de Ciencias Naturales y Exactas',
			colleges: [
				'Escuela de Biología',
				'Escuela de Química',
				'Escuela de Matemáticas',
				'Escuela de Física',
				'Tecnologia en Analisis y Laboratorio Quimico',
				'Tecnologia en Manejo de la Producción Agroforestal',
			],
		},
		{
			faculty: 'Facultad de Ciencias Sociales y Económicas',
			colleges: ['Sociologia', 'Economía'],
		},
		{
			faculty: 'Facultad de Humanidades',
			colleges: [
				'Filosofía',
				'Licenciatura en Filosofía',
				'Licenciatura en Español y Filologia',
				'Licenciatura en Lenguas Extranjeras',
				'Programa Interpretación para sordociegos',
				'Licenciatura en Literatura',
				'Licenciatura en Ciencias Sociales',
				'Geografía',
				'Licenciatura en Historia',
				'Historia',
				'Trabajo Social',
			],
		},
		{
			faculty: 'Facultad Artes Integradas',
			colleges: [
				'Arquitectura',
				'Comunicación Social',
				'Música',
				'Licenciaturas',
				'Diseño Gráfico',
				'Diseño Industrial',
				'Oferta de Asignaturas Electivas',
			],
		},
	];

	for (const item of data) {
		const faculty = await prisma.faculty.upsert({
			where: { name: item.faculty },
			update: {},
			create: { name: item.faculty },
		});

		for (const collegeName of item.colleges) {
			await prisma.college.upsert({
				where: { name: collegeName },
				update: {
					facultyId: faculty.id,
				},
				create: {
					name: collegeName,
					facultyId: faculty.id,
				},
			});
		}
	}

	// Crear Usuario Admin si no existe
	const hashedPassword = await bcrypt.hash('admin123', 10);

	await prisma.user.upsert({
		where: { email: 'admin@example.com' },
		update: {},
		create: {
			name: 'Admin',
			lastName: 'System',
			email: 'admin@example.com',
			roleId: admin.id,
			password: hashedPassword,
		},
	});

	await prisma.user.upsert({
		where: { email: 'director@example.com' },
		update: {},
		create: {
			name: 'Director',
			lastName: 'System',
			email: 'director@example.com',
			roleId: director.id,
			password: hashedPassword,
		},
	});

	await prisma.user.upsert({
		where: { email: 'dependencia@example.com' },
		update: {},
		create: {
			name: 'Dependencia',
			lastName: 'System',
			email: 'dependencia@example.com',
			roleId: dependence.id,
			password: hashedPassword,
		},
	});

	await prisma.user.upsert({
		where: { email: 'estudiante@example.com' },
		update: {},
		create: {
			name: 'Estudiante',
			lastName: 'System',
			email: 'estudiante@example.com',
			roleId: student.id,
			password: hashedPassword,
		},
	});

	const seedOffers = [
		{
			title: 'Monitoría en Bases de Datos',
			description: 'Apoyar en proyectos y prácticas de SQL y modelado de datos',
			requirements: 'Conocimientos en SQL, PostgreSQL o MySQL',
			daysToClose: 15,
			faculty: 'Facultad de Ingeniería',
			college: 'Escuela de Sistemas',
		},
		{
			title: 'Monitoría en Inteligencia Artificial',
			description: 'Asistir en la creación de modelos de IA y análisis de datos',
			requirements: 'Conocimientos en Python, machine learning y estadística',
			daysToClose: 20,
			faculty: 'Facultad de Ingeniería',
			college: 'Escuela de Sistemas',
		},
		{
			title: 'Monitoría en Diseño UX/UI',
			description: 'Apoyar en el diseño de interfaces y experiencia de usuario',
			requirements: 'Manejo de Figma, Adobe XD o Sketch',
			daysToClose: 12,
			faculty: 'Facultad de Ingeniería',
			college: 'Escuela de Sistemas',
		},
		{
			title: 'Monitoría en Redes de Computadores',
			description: 'Asistir en prácticas de configuración y seguridad de redes',
			requirements: 'Conocimientos en TCP/IP, routers y switches',
			daysToClose: 18,
			faculty: 'Facultad de Ingeniería',
			college: 'Escuela de Sistemas',
		},
		{
			title: 'Monitoría en Matemáticas Aplicadas',
			description: 'Apoyo en ejercicios y tutorías de álgebra y cálculo',
			requirements: 'Sólidos conocimientos en álgebra, cálculo y estadística',
			daysToClose: 14,
			faculty: 'Facultad de Ingeniería',
			college: 'Escuela de Sistemas',
		},
		{
			title: 'Monitoría en Desarrollo de Aplicaciones Móviles',
			description: 'Apoyo en proyectos con Flutter y React Native',
			requirements: 'Conocimientos en Dart, JavaScript y control de versiones',
			daysToClose: 16,
			faculty: 'Facultad de Ingeniería',
			college: 'Escuela de Sistemas',
		},
		{
			title: 'Monitoría en Ciberseguridad',
			description: 'Asistir en prácticas de análisis de vulnerabilidades y protección de sistemas',
			requirements: 'Conocimientos en seguridad informática y redes',
			daysToClose: 22,
			faculty: 'Facultad de Ingeniería',
			college: 'Escuela de Sistemas',
		},
		{
			title: 'Monitoría en Análisis de Datos',
			description: 'Apoyo en la limpieza, análisis y visualización de datos',
			requirements: 'Manejo de Python, Excel, Pandas y Power BI',
			daysToClose: 13,
			faculty: 'Facultad de Ingeniería',
			college: 'Escuela de Sistemas',
		},
	];

	for (const offer of seedOffers) {
		const existing = await prisma.offer.findFirst({
			where: { title: offer.title },
		});
		if (existing) continue;

		const facultyForOffer = await prisma.faculty.findFirst();
		if (!facultyForOffer) continue;

		await prisma.offer.create({
			data: {
				title: offer.title,
				description: offer.description,
				requirements: offer.requirements,
				closeDate: new Date(new Date().setDate(new Date().getDate() + offer.daysToClose)),
				facultyId: facultyForOffer.id,
			},
		});
	}

	// Crear varios estudiantes con sus perfiles
	const studentsData = [
		{
			name: 'Laura',
			lastName: 'Gómez',
			email: 'laura.gomez@example.com',
			gender: 'FEMENINO',
			birthDate: new Date('2001-02-10'),
			birthPlace: 'Bogota',
			city: 'Cali',
			semester: 6,
		},
		{
			name: 'Carlos',
			lastName: 'Pérez',
			email: 'carlos.perez@example.com',
			gender: 'MASCULINO',
			birthDate: new Date('2000-08-25'),
			birthPlace: 'Palmira',
			city: 'Palmira',
			semester: 8,
		},
		{
			name: 'María',
			lastName: 'Fernández',
			email: 'maria.fernandez@example.com',
			gender: 'FEMENINO',
			birthDate: new Date('2002-11-15'),
			birthPlace: 'Jamundí',
			city: 'Jamundí',
			semester: 5,
		},
		{
			name: 'Andrés',
			lastName: 'Rodríguez',
			email: 'andres.rodriguez@example.com',
			gender: 'MASCULINO',
			birthDate: new Date('2001-06-30'),
			birthPlace: 'Buga',
			city: 'Buga',
			semester: 7,
		},
		{
			name: 'Valentina',
			lastName: 'Martínez',
			email: 'valentina.martinez@example.com',
			gender: 'FEMENINO',
			birthDate: new Date('2000-09-12'),
			birthPlace: 'Cali',
			city: 'Cali',
			semester: 8,
		},
		{
			name: 'Santiago',
			lastName: 'López',
			email: 'santiago.lopez@example.com',
			gender: 'MASCULINO',
			birthDate: new Date('2001-03-22'),
			birthPlace: 'Palmira',
			city: 'Palmira',
			semester: 6,
		},
		{
			name: 'Camila',
			lastName: 'Torres',
			email: 'camila.torres@example.com',
			gender: 'FEMENINO',
			birthDate: new Date('2002-07-05'),
			birthPlace: 'Buga',
			city: 'Buga',
			semester: 5,
		},
		{
			name: 'David',
			lastName: 'Gutiérrez',
			email: 'david.gutierrez@example.com',
			gender: 'MASCULINO',
			birthDate: new Date('2000-11-30'),
			birthPlace: 'Jamundí',
			city: 'Jamundí',
			semester: 8,
		},
		{
			name: 'Isabella',
			lastName: 'Ramírez',
			email: 'isabella.ramirez@example.com',
			gender: 'FEMENINO',
			birthDate: new Date('2001-12-17'),
			birthPlace: 'Cali',
			city: 'Cali',
			semester: 7,
		},
		{
			name: 'Juan',
			lastName: 'Sánchez',
			email: 'juan.sanchez@example.com',
			gender: 'MASCULINO',
			birthDate: new Date('2002-05-28'),
			birthPlace: 'Palmira',
			city: 'Palmira',
			semester: 6,
		},
	];

	const hashedStudentPassword = await bcrypt.hash('student123', 10);

	for (const studentData of studentsData) {
		// Crear usuario
		const studentUser = await prisma.user.upsert({
			where: { email: studentData.email },
			update: {},
			create: {
				name: studentData.name,
				lastName: studentData.lastName,
				email: studentData.email,
				roleId: student.id,
				password: hashedStudentPassword,
			},
		});

		// Crear perfil asociado
		const profile = await prisma.studentProfile.upsert({
			where: { userId: studentUser.id },
			update: {},
			create: {
				userId: studentUser.id,
				studentCode: `2023${Math.floor(1000 + Math.random() * 9000)}`,
				lastName: studentData.lastName,
				secondLastName: 'López',
				fullName: `${studentData.name} ${studentData.lastName}`,
				gender: studentData.gender,
				birthDate: studentData.birthDate,
				age: new Date().getFullYear() - studentData.birthDate.getFullYear(),
				birthPlace: studentData.birthPlace,
				idNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
				idIssuedPlace: studentData.city,
				maritalStatus: 'SINGLE',
				dependents: 0,
				familyPosition: 'CHILD',
				address: 'Cra 10 #20-30',
				stratum: '3',
				neighborhood: 'San Fernando',
				city: studentData.city,
				department: 'Valle del Cauca',
				phone: '6025555555',
				mobile: '3155555555',
				email: studentData.email,
				emergencyContact: 'Pedro Gómez',
				emergencyPhone: '3105555555',
				occupationalProfile: 'Estudiante de Ingeniería de Sistemas con interés en desarrollo de software.',
				planCode: 'IS2023',
				planName: 'Ingeniería de Sistemas',
				semester: studentData.semester,
				campus: 'Meléndez',
				academicPeriod: '2025-1',
				jornada: 'Diurna',
				isComplete: true,
				Photo: 'default_photo.png',
				Grades: 'grades_default.pdf',
				status: 'SUBMITTED',
				submittedAt: new Date(),
				reviewedAt: new Date(),
			},
		});

		// ✅ Agregar SystemSkill
		const skills = ['React', 'Node.js', 'PostgreSQL', 'Git', 'Docker'];
		const randomSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 3);
		for (const skill of randomSkills) {
			await prisma.systemSkill.upsert({
				where: { id: `${profile.id}-${skill}` },
				update: {},
				create: {
					id: `${profile.id}-${skill}`,
					studentId: profile.id,
					programName: skill,
				},
			});
		}

		// ✅ Agregar educación
		await prisma.education.createMany({
			data: [
				{
					studentId: profile.id,
					level: 'UNIVERSITY',
					degreeTitle: 'Ingeniería de Sistemas',
					endYear: 2026,
					institution: 'Universidad del Valle',
					city: studentData.city,
					semesters: studentData.semester,
				},
				{
					studentId: profile.id,
					level: 'HIGH_SCHOOL',
					degreeTitle: 'Bachiller Académico',
					endYear: 2021,
					institution: 'Colegio Nacional',
					city: studentData.city,
				},
			],
		});

		// ✅ Agregar cursos de capacitación
		await prisma.training.createMany({
			data: [
				{
					studentId: profile.id,
					institution: 'Platzi',
					courseName: 'Curso de React',
					duration: '30 horas',
					endDate: new Date('2024-12-01'),
				},
				{
					studentId: profile.id,
					institution: 'Udemy',
					courseName: 'Curso de Node.js',
					duration: '25 horas',
					endDate: new Date('2024-11-01'),
				},
			],
		});

		// ✅ Agregar idiomas
		await prisma.languageSkill.createMany({
			data: [
				{
					studentId: profile.id,
					language: 'Inglés',
					speakLevel: 'GOOD',
					writeLevel: 'GOOD',
					readLevel: 'GOOD',
				},
				{
					studentId: profile.id,
					language: 'Español',
					speakLevel: 'EXCELLENT',
					writeLevel: 'EXCELLENT',
					readLevel: 'EXCELLENT',
				},
			],
		});

		// ✅ Agregar disponibilidad
		await prisma.availability.createMany({
			data: [
				{
					studentId: profile.id,
					dayOfWeek: 'MONDAY',
					startTime1: '08:00',
					endTime1: '12:00',
				},
				{
					studentId: profile.id,
					dayOfWeek: 'WEDNESDAY',
					startTime1: '14:00',
					endTime1: '18:00',
				},
			],
		});

		// ✅ (Opcional) agregar experiencia laboral
		await prisma.workExperience.create({
			data: {
				studentId: profile.id,
				companyName: 'Tech Solutions',
				role: 'Intern',
				functions: 'Desarrollo de módulos en Node.js',
				bossName: 'Juan Pérez',
				bossRole: 'Project Manager',
				bossPhone: '3105555555',
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-06-30'),
				achievements: 'Desarrollo de API funcional',
			},
		});
	}

	// Obtener todas las ofertas disponibles
	const offers = await prisma.offer.findMany();
	const allStudents = await prisma.user.findMany({
		where: { roleId: student.id },
	});

	for (const studentUser of allStudents) {
		// Seleccionar entre 1 y 2 ofertas aleatorias para aplicar
		const randomOffers = offers.sort(() => 0.5 - Math.random()).slice(0, 2);

		for (const offer of randomOffers) {
			await prisma.application.upsert({
				where: {
					user_offer_unique: {
						userId: studentUser.id,
						offerId: offer.id,
					},
				},
				update: {
					status: 'SENT',
					appliedAt: new Date(),
				},
				create: {
					userId: studentUser.id,
					offerId: offer.id,
					status: 'SENT',
					appliedAt: new Date(),
				},
			});
		}
	}
}
