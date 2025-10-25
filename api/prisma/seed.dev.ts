import { PrismaClient, type Permission } from "@prisma/client";
import bcrypt from "bcrypt";

export async function seedDev(prisma: PrismaClient) {
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


		{ code: "review_profiles", name: "Revisar Perfiles" }
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

	const codeDirectorPermissions = [
		"review_profiles"
	];
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
	const faculty = await prisma.faculty.upsert({
		where: { name: "Facultad de Ingeniería" },
		update: {},
		create: {
			name: "Facultad de Ingeniería",
		},
	});

	// Crear College asociado a Faculty
	await prisma.college.upsert({
		where: { name: "Escuela de Sistemas" },
		update: {},
		create: {
			name: "Escuela de Sistemas",
			facultyId: faculty.id,
		},
	});

	// Crear Usuario Admin si no existe
	const hashedPassword = await bcrypt.hash("admin123", 10);

	await prisma.user.upsert({
		where: { email: "admin01@gmail.com" },
		update: {},
		create: {
			name: "Admin",
			lastName: "01",
			email: "admin01@gmail.com",
			roleId: admin.id,
			password: hashedPassword,
		},
	});
}
