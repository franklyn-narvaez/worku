import {
	ApplicationStatus,
	DayOfWeek,
	FamilyPosition,
	Gender,
	LanguageLevel,
	MaritalStatus,
	type Permission,
	type PrismaClient,
	ProfileStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";

function buildCloseDate(daysToClose: number) {
	const closeDate = new Date();
	closeDate.setDate(closeDate.getDate() + daysToClose);

	return closeDate;
}

function cycleValue<T>(values: readonly T[], index: number) {
	const value = values[index % values.length];

	if (value === undefined) {
		throw new Error("No se pudo resolver un valor cíclico para el seed.");
	}

	return value;
}

function pickRandomValues<T>(values: readonly T[], count: number) {
	const pool = [...values];
	const picked: T[] = [];

	while (picked.length < count && pool.length > 0) {
		const randomIndex = Math.floor(Math.random() * pool.length);
		const [value] = pool.splice(randomIndex, 1);

		if (value !== undefined) {
			picked.push(value);
		}
	}

	return picked;
}

export async function seedTest(prisma: PrismaClient) {
	const permissions = [
		{ code: "create_offer", name: "Crear Oferta" },
		{ code: "create_user", name: "Crear Usuario" },
		{ code: "view_list_offer", name: "Ver Lista Oferta" },
		{ code: "view_list_user", name: "Ver Lista Usuario" },
		{ code: "update_offer", name: "Actualizar Oferta" },
		{ code: "update_user", name: "Actualizar Usuario" },

		{ code: "create_offer_dependence", name: "Crear Oferta Dependencia" },
		{
			code: "view_list_offer_dependence",
			name: "Ver Lista Oferta Dependencia",
		},
		{ code: "update_offer_dependence", name: "Actualizar Oferta Dependencia" },
		{
			code: "view_applications_dependence",
			name: "Ver Aplicaciones Dependencia",
		},

		{ code: "view_offer", name: "Ver Oferta" },
		{ code: "apply_offer", name: "Aplicar Oferta" },
		{ code: "create_profile", name: "Crear Perfil" },
		{ code: "update_profile", name: "Actualizar Perfil" },
		{ code: "view_applications", name: "Ver Aplicaciones" },

		{ code: "review_profiles", name: "Revisar Perfiles" },
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
		where: { code: "admin" },
		update: {},
		create: {
			code: "admin",
			name: "Administrador",
		},
	});

	const dependence = await prisma.role.upsert({
		where: { code: "dependence" },
		update: {},
		create: {
			code: "dependence",
			name: "Dependencia",
		},
	});

	// Crear Role de Estudiante si no existe
	const student = await prisma.role.upsert({
		where: { code: "student" },
		update: {},
		create: {
			code: "student",
			name: "Estudiante",
		},
	});

	const director = await prisma.role.upsert({
		where: { code: "director" },
		update: {},
		create: {
			code: "director",
			name: "Director",
		},
	});

	// Asociar todos los permisos al rol admin
	const codeAdminPermissions = [
		"create_offer",
		"create_user",
		"view_list_offer",
		"view_list_user",
		"update_offer",
		"update_user",
	];
	const adminPermissions = createPermissions.filter((p) =>
		codeAdminPermissions.includes(p.code),
	);
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
	const codeStudentPermissions = [
		"create_profile",
		"update_profile",
		"view_offer",
		"apply_offer",
		"view_applications",
	];
	const studentPermissions = createPermissions.filter((p) =>
		codeStudentPermissions.includes(p.code),
	);
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
		"create_offer_dependence",
		"view_list_offer_dependence",
		"update_offer_dependence",
		"view_applications_dependence",
	];
	const dependencePermissions = createPermissions.filter((p) =>
		codeDependencePermissions.includes(p.code),
	);
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

	const codeDirectorPermissions = ["review_profiles"];
	const directorPermissions = createPermissions.filter((p) =>
		codeDirectorPermissions.includes(p.code),
	);
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
			faculty: "Facultad de Ingeniería",
			colleges: [
				"Escuela de Sistemas",
				"Escuela de Civil",
				"Escuela de Mecánica",
			],
		},
		{
			faculty: "Facultad de Ciencias Naturales y Exactas",
			colleges: [
				"Escuela de Biología",
				"Escuela de Química",
				"Escuela de Matemáticas",
				"Escuela de Física",
				"Tecnologia en Analisis y Laboratorio Quimico",
				"Tecnologia en Manejo de la Producción Agroforestal",
			],
		},
		{
			faculty: "Facultad de Ciencias Sociales y Económicas",
			colleges: ["Sociologia", "Economía"],
		},
		{
			faculty: "Facultad de Humanidades",
			colleges: [
				"Filosofía",
				"Licenciatura en Filosofía",
				"Licenciatura en Español y Filologia",
				"Licenciatura en Lenguas Extranjeras",
				"Programa Interpretación para sordociegos",
				"Licenciatura en Literatura",
				"Licenciatura en Ciencias Sociales",
				"Geografía",
				"Licenciatura en Historia",
				"Historia",
				"Trabajo Social",
			],
		},
		{
			faculty: "Facultad Artes Integradas",
			colleges: [
				"Arquitectura",
				"Comunicación Social",
				"Música",
				"Licenciaturas",
				"Diseño Gráfico",
				"Diseño Industrial",
				"Oferta de Asignaturas Electivas",
			],
		},
	];

	for (const item of data) {
		const faculty = await prisma.faculty.upsert({
			where: { name: item.faculty },
			update: { name: item.faculty },
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

	const systemsCollege = await prisma.college.findUnique({
		where: { name: "Escuela de Sistemas" },
	});

	if (!systemsCollege) {
		throw new Error(
			'No se encontró la escuela base "Escuela de Sistemas" en el seed.',
		);
	}

	// Crear Usuario Admin si no existe
	const hashedPassword = await bcrypt.hash("admin123", 10);

	await prisma.user.upsert({
		where: { email: "admin@example.com" },
		update: {
			name: "Admin",
			lastName: "System",
			roleId: admin.id,
			password: hashedPassword,
		},
		create: {
			name: "Admin",
			lastName: "System",
			email: "admin@example.com",
			roleId: admin.id,
			password: hashedPassword,
		},
	});

	await prisma.user.upsert({
		where: { email: "director@example.com" },
		update: {
			name: "Director",
			lastName: "System",
			roleId: director.id,
			password: hashedPassword,
		},
		create: {
			name: "Director",
			lastName: "System",
			email: "director@example.com",
			roleId: director.id,
			password: hashedPassword,
		},
	});

	await prisma.user.upsert({
		where: { email: "dependencia@example.com" },
		update: {
			name: "Dependencia",
			lastName: "System",
			collegeId: systemsCollege.id,
			roleId: dependence.id,
			password: hashedPassword,
		},
		create: {
			name: "Dependencia",
			lastName: "System",
			email: "dependencia@example.com",
			roleId: dependence.id,
			collegeId: systemsCollege.id,
			password: hashedPassword,
		},
	});

	await prisma.user.upsert({
		where: { email: "estudiante@example.com" },
		update: {
			name: "Estudiante",
			lastName: "System",
			roleId: student.id,
			password: hashedPassword,
		},
		create: {
			name: "Estudiante",
			lastName: "System",
			email: "estudiante@example.com",
			roleId: student.id,
			password: hashedPassword,
		},
	});

	const seedOffers = [
		{
			title: "Monitoría en Bases de Datos",
			description: "Apoyar en proyectos y prácticas de SQL y modelado de datos",
			requirements: "Conocimientos en SQL, PostgreSQL o MySQL",
			daysToClose: 15,
			faculty: "Facultad de Ingeniería",
			college: "Escuela de Sistemas",
			status: true,
		},
		{
			title: "Monitoría en Inteligencia Artificial",
			description:
				"Asistir en la creación de modelos de IA y análisis de datos",
			requirements: "Conocimientos en Python, machine learning y estadística",
			daysToClose: 20,
			faculty: "Facultad de Ciencias Naturales y Exactas",
			college: "Escuela de Matemáticas",
			status: true,
		},
		{
			title: "Monitoría en Diseño UX/UI",
			description: "Apoyar en el diseño de interfaces y experiencia de usuario",
			requirements: "Manejo de Figma, Adobe XD o Sketch",
			daysToClose: 12,
			faculty: "Facultad Artes Integradas",
			college: "Diseño Gráfico",
			status: true,
		},
		{
			title: "Monitoría en Redes de Computadores",
			description: "Asistir en prácticas de configuración y seguridad de redes",
			requirements: "Conocimientos en TCP/IP, routers y switches",
			daysToClose: 18,
			faculty: "Facultad de Ingeniería",
			college: "Escuela de Civil",
			status: false,
		},
		{
			title: "Monitoría en Matemáticas Aplicadas",
			description: "Apoyo en ejercicios y tutorías de álgebra y cálculo",
			requirements: "Sólidos conocimientos en álgebra, cálculo y estadística",
			daysToClose: 14,
			faculty: "Facultad de Ciencias Naturales y Exactas",
			college: "Escuela de Matemáticas",
			status: true,
		},
		{
			title: "Monitoría en Desarrollo de Aplicaciones Móviles",
			description: "Apoyo en proyectos con Flutter y React Native",
			requirements: "Conocimientos en Dart, JavaScript y control de versiones",
			daysToClose: 16,
			faculty: "Facultad de Humanidades",
			college: "Licenciatura en Español y Filologia",
			status: true,
		},
		{
			title: "Monitoría en Ciberseguridad",
			description:
				"Asistir en prácticas de análisis de vulnerabilidades y protección de sistemas",
			requirements: "Conocimientos en seguridad informática y redes",
			daysToClose: 22,
			faculty: "Facultad de Ingeniería",
			college: "Escuela de Sistemas",
			status: false,
		},
		{
			title: "Monitoría en Análisis de Datos",
			description: "Apoyo en la limpieza, análisis y visualización de datos",
			requirements: "Manejo de Python, Excel, Pandas y Power BI",
			daysToClose: 13,
			faculty: "Facultad de Ciencias Sociales y Económicas",
			college: "Economía",
			status: true,
		},
	];

	for (const offer of seedOffers) {
		const college = await prisma.college.findUnique({
			where: { name: offer.college },
			include: { faculty: true },
		});

		if (!college) {
			throw new Error(
				`No se encontró la escuela "${offer.college}" para la oferta "${offer.title}".`,
			);
		}

		if (college.faculty.name !== offer.faculty) {
			throw new Error(
				`La oferta "${offer.title}" esperaba la facultad "${offer.faculty}" pero la escuela "${offer.college}" pertenece a "${college.faculty.name}".`,
			);
		}

		const offerData = {
			description: offer.description,
			requirements: offer.requirements,
			closeDate: buildCloseDate(offer.daysToClose),
			status: offer.status,
			collegeId: college.id,
			facultyId: college.facultyId,
		};

		const existing = await prisma.offer.findFirst({
			where: { title: offer.title },
		});

		if (existing) {
			await prisma.offer.update({
				where: { id: existing.id },
				data: offerData,
			});
		} else {
			await prisma.offer.create({
				data: {
					title: offer.title,
					...offerData,
				},
			});
		}
	}

	// Crear varios estudiantes con sus perfiles
	const studentsData = [
		{
			name: "Laura",
			lastName: "Gómez",
			email: "laura.gomez@example.com",
			gender: Gender.FEMENINO,
			birthDate: new Date("2001-02-10"),
			birthPlace: "Cali",
			city: "Cali",
			semester: 6,
		},
		{
			name: "Carlos",
			lastName: "Pérez",
			email: "carlos.perez@example.com",
			gender: Gender.MASCULINO,
			birthDate: new Date("2000-08-25"),
			birthPlace: "Palmira",
			city: "Palmira",
			semester: 8,
		},
		{
			name: "María",
			lastName: "Fernández",
			email: "maria.fernandez@example.com",
			gender: Gender.FEMENINO,
			birthDate: new Date("2002-11-15"),
			birthPlace: "Jamundí",
			city: "Jamundí",
			semester: 5,
		},
		{
			name: "Andrés",
			lastName: "Rodríguez",
			email: "andres.rodriguez@example.com",
			gender: Gender.MASCULINO,
			birthDate: new Date("2001-06-30"),
			birthPlace: "Buga",
			city: "Buga",
			semester: 7,
		},
		{
			name: "Valentina",
			lastName: "Martínez",
			email: "valentina.martinez@example.com",
			gender: Gender.FEMENINO,
			birthDate: new Date("2000-09-12"),
			birthPlace: "Cali",
			city: "Cali",
			semester: 8,
		},
		{
			name: "Santiago",
			lastName: "López",
			email: "santiago.lopez@example.com",
			gender: Gender.MASCULINO,
			birthDate: new Date("2001-03-22"),
			birthPlace: "Palmira",
			city: "Palmira",
			semester: 6,
		},
		{
			name: "Camila",
			lastName: "Torres",
			email: "camila.torres@example.com",
			gender: Gender.FEMENINO,
			birthDate: new Date("2002-07-05"),
			birthPlace: "Buga",
			city: "Buga",
			semester: 5,
		},
		{
			name: "David",
			lastName: "Gutiérrez",
			email: "david.gutierrez@example.com",
			gender: Gender.MASCULINO,
			birthDate: new Date("2000-11-30"),
			birthPlace: "Jamundí",
			city: "Jamundí",
			semester: 8,
		},
		{
			name: "Isabella",
			lastName: "Ramírez",
			email: "isabella.ramirez@example.com",
			gender: Gender.FEMENINO,
			birthDate: new Date("2001-12-17"),
			birthPlace: "Cali",
			city: "Cali",
			semester: 7,
		},
		{
			name: "Juan",
			lastName: "Sánchez",
			email: "juan.sanchez@example.com",
			gender: Gender.MASCULINO,
			birthDate: new Date("2002-05-28"),
			birthPlace: "Palmira",
			city: "Palmira",
			semester: 6,
		},
	];

	const hashedStudentPassword = await bcrypt.hash("student123", 10);

	for (const [studentDataIndex, studentData] of studentsData.entries()) {
		// Crear usuario
		const studentUser = await prisma.user.upsert({
			where: { email: studentData.email },
			update: {
				name: studentData.name,
				lastName: studentData.lastName,
				roleId: student.id,
				password: hashedStudentPassword,
			},
			create: {
				name: studentData.name,
				lastName: studentData.lastName,
				email: studentData.email,
				roleId: student.id,
				password: hashedStudentPassword,
			},
		});

		const profileStatuses = [
			ProfileStatus.SUBMITTED,
			ProfileStatus.APPROVED,
			ProfileStatus.REJECTED,
			ProfileStatus.DRAFT,
		] as const;
		const profileStatus = cycleValue(profileStatuses, studentDataIndex);
		const now = new Date();
		const profilePayload = {
			studentCode: `2023${String(studentDataIndex + 1).padStart(4, "0")}`,
			lastName: studentData.lastName,
			secondLastName: "López",
			fullName: `${studentData.name} ${studentData.lastName}`,
			gender: studentData.gender,
			birthDate: studentData.birthDate,
			age: new Date().getFullYear() - studentData.birthDate.getFullYear(),
			birthPlace: studentData.birthPlace,
			idNumber: `10000000${String(studentDataIndex + 1).padStart(2, "0")}`,
			idIssuedPlace: studentData.city,
			maritalStatus: MaritalStatus.SINGLE,
			dependents: 0,
			familyPosition: FamilyPosition.CHILD,
			address: "Cra 10 #20-30",
			stratum: "3",
			neighborhood: "San Fernando",
			city: studentData.city,
			department: "Valle del Cauca",
			phone: "6025555555",
			mobile: "3155555555",
			email: studentData.email,
			emergencyContact: "Pedro Gómez",
			emergencyPhone: "3105555555",
			occupationalProfile:
				"Estudiante de Ingeniería de Sistemas con interés en desarrollo de software.",
			planCode: "IS2023",
			planName: "Ingeniería de Sistemas",
			semester: studentData.semester,
			campus: "Meléndez",
			academicPeriod: "2025-1",
			jornada: "Diurna",
			isComplete: profileStatus !== ProfileStatus.DRAFT,
			Photo: "default_photo.png",
			Grades: "grades_default.pdf",
			status: profileStatus,
			submittedAt: profileStatus === ProfileStatus.DRAFT ? null : now,
			reviewedAt: profileStatus === ProfileStatus.DRAFT ? null : now,
			rejectComment:
				profileStatus === ProfileStatus.REJECTED
					? "Se requiere corregir la documentación cargada."
					: null,
		};

		// Crear perfil asociado
		const profile = await prisma.studentProfile.upsert({
			where: { userId: studentUser.id },
			update: profilePayload,
			create: {
				userId: studentUser.id,
				...profilePayload,
			},
		});

		await prisma.systemSkill.deleteMany({
			where: { studentId: profile.id },
		});
		await prisma.systemSkill.createMany({
			data: pickRandomValues(
				[
					"React",
					"Node.js",
					"PostgreSQL",
					"Git",
					"Docker",
					"JavaScript",
					"AWS",
					"Python",
				],
				3,
			).map((skill) => ({
				id: `${profile.id}-${skill}`,
				studentId: profile.id,
				programName: skill,
			})),
		});

		await prisma.education.deleteMany({
			where: { studentId: profile.id },
		});
		await prisma.education.createMany({
			data: [
				{
					studentId: profile.id,
					level: "UNIVERSITY",
					degreeTitle: "Ingeniería de Sistemas",
					endYear: 2026,
					institution: "Universidad del Valle",
					city: studentData.city,
					semesters: studentData.semester,
				},
				{
					studentId: profile.id,
					level: "HIGH_SCHOOL",
					degreeTitle: "Bachiller Académico",
					endYear: 2021,
					institution: "Colegio Nacional",
					city: studentData.city,
				},
			],
		});

		await prisma.training.deleteMany({
			where: { studentId: profile.id },
		});
		await prisma.training.createMany({
			data: [
				{
					studentId: profile.id,
					institution: "Platzi",
					courseName: "Curso de React",
					duration: "30 horas",
					endDate: new Date("2024-12-01"),
				},
				{
					studentId: profile.id,
					institution: "Udemy",
					courseName: "Curso de Node.js",
					duration: "25 horas",
					endDate: new Date("2024-11-01"),
				},
			],
		});

		await prisma.languageSkill.deleteMany({
			where: { studentId: profile.id },
		});
		await prisma.languageSkill.createMany({
			data: [
				{
					studentId: profile.id,
					language: "Inglés",
					speakLevel: LanguageLevel.GOOD,
					writeLevel: LanguageLevel.GOOD,
					readLevel: LanguageLevel.GOOD,
				},
				{
					studentId: profile.id,
					language: "Español",
					speakLevel: LanguageLevel.EXCELLENT,
					writeLevel: LanguageLevel.EXCELLENT,
					readLevel: LanguageLevel.EXCELLENT,
				},
			],
		});

		await prisma.availability.deleteMany({
			where: { studentId: profile.id },
		});
		await prisma.availability.createMany({
			data: [
				{
					studentId: profile.id,
					dayOfWeek: DayOfWeek.MONDAY,
					startTime1: "08:00",
					endTime1: "12:00",
				},
				{
					studentId: profile.id,
					dayOfWeek: DayOfWeek.WEDNESDAY,
					startTime1: "14:00",
					endTime1: "18:00",
				},
			],
		});

		await prisma.workExperience.deleteMany({
			where: { studentId: profile.id },
		});
		await prisma.workExperience.create({
			data: {
				studentId: profile.id,
				companyName: "Tech Solutions",
				role: "Intern",
				functions: "Desarrollo de módulos en Node.js",
				bossName: "Juan Pérez",
				bossRole: "Project Manager",
				bossPhone: "3105555555",
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-06-30"),
				achievements: "Desarrollo de API funcional",
			},
		});
	}

	// Obtener todas las ofertas disponibles
	const offers = await prisma.offer.findMany({
		orderBy: { title: "asc" },
	});

	if (!offers.length) {
		throw new Error(
			"No hay ofertas disponibles para crear aplicaciones en el seed.",
		);
	}

	const allStudents = await prisma.user.findMany({
		where: { roleId: student.id },
		orderBy: { email: "asc" },
	});

	await prisma.application.deleteMany({
		where: {
			userId: {
				in: allStudents.map((item) => item.id),
			},
		},
	});

	const applicationStatuses = [
		ApplicationStatus.SENT,
		ApplicationStatus.UNDER_REVIEW,
		ApplicationStatus.CALLED_FOR_INTERVIEW,
		ApplicationStatus.PENDING,
		ApplicationStatus.APPROVED,
		ApplicationStatus.REJECTED,
	] as const;

	for (const [studentIndex, studentUser] of allStudents.entries()) {
		const primaryOffer = cycleValue(offers, studentIndex);
		const secondaryOffer = cycleValue(offers, studentIndex + 3);
		const offersForStudent =
			studentIndex % 2 === 0 ? [primaryOffer, secondaryOffer] : [primaryOffer];

		for (const [offerIndex, offer] of offersForStudent.entries()) {
			const applicationStatus = cycleValue(
				applicationStatuses,
				studentIndex + offerIndex,
			);
			await prisma.application.upsert({
				where: {
					user_offer_unique: {
						userId: studentUser.id,
						offerId: offer.id,
					},
				},
				update: {
					status: applicationStatus,
					appliedAt: new Date(),
					interviewDate:
						applicationStatus === ApplicationStatus.CALLED_FOR_INTERVIEW
							? buildCloseDate(2)
							: null,
					attendedInterview:
						applicationStatus === ApplicationStatus.APPROVED
							? true
							: applicationStatus === ApplicationStatus.REJECTED
								? false
								: null,
				},
				create: {
					userId: studentUser.id,
					offerId: offer.id,
					status: applicationStatus,
					appliedAt: new Date(),
					interviewDate:
						applicationStatus === ApplicationStatus.CALLED_FOR_INTERVIEW
							? buildCloseDate(2)
							: null,
					attendedInterview:
						applicationStatus === ApplicationStatus.APPROVED
							? true
							: applicationStatus === ApplicationStatus.REJECTED
								? false
								: null,
				},
			});
		}
	}
}
