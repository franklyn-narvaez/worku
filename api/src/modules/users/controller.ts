import { prisma } from "@/libs/db";
import { Router } from "express";
import { registerSchema } from "./schema";
import z from "zod";
import bcrypt from "bcrypt";
import { CreateSchema } from "./createSchema";
import { UpdateSchema } from "./updateSchema";
import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorize";

const router = Router();

router.get(
	"",
	authenticate,
	authorize(["view_list_user"]),
	async (_, res) => {
		try {
			const users = await prisma.user.findMany({
				select: {
					id: true,
					name: true,
					lastName: true,
					email: true,
					createdDate: true,
					status: true,
					college: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});
			return res.json(users);
		} catch (error) {
			return res.status(500).json({ error: "Failed to fetch users" });
		}
	},
);

router.post("/register", async (req, res) => {
	try {
		const parseData = registerSchema.safeParse(req.body);

		if (!parseData.success) {
			return res.status(400).json({
				message: "Datos inválidos",
				errors: z.treeifyError(parseData.error).properties, //
			});
		}

		const userFound = await prisma.user.findUnique({
			where: {
				email: parseData.data.email,
			},
		});

		if (userFound) {
			return res.status(400).json({ error: "El usuario ya existe" });
		}

		const role = await prisma.role.findFirst({
			where: {
				code: "student",
			},
		});

		if (!role) {
			return res.status(404).json({ error: "Rol no encontrado" });
		}

		const hashedPassword = await bcrypt.hash(parseData.data.password, 10);
		const newUser = await prisma.user.create({
			data: { ...parseData.data, roleId: role.id, password: hashedPassword },
		});

		const { password: _, ...user } = newUser;

		return res.status(201).json(user);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: z.treeifyError(error) });
		}
		return res.status(500).json({ error: "Error al registrar el usuario" });
	}
});

router.post(
	"/create",
	authenticate,
	authorize(["create_user"]),
	async (req, res) => {
		try {
			const parseData = CreateSchema.safeParse(req.body);

			if (!parseData.success) {
				return res.status(400).json({
					message: "Datos inválidos",
					errors: z.treeifyError(parseData.error).properties, //
				});
			}

			const userFound = await prisma.user.findUnique({
				where: {
					email: parseData.data.email,
				},
			});

			if (userFound) {
				return res.status(400).json({ error: "El usuario ya existe" });
			}

			const hashedPassword = await bcrypt.hash(parseData.data.email, 10);
			const newUser = await prisma.user.create({
				data: { ...parseData.data, password: hashedPassword },
			});

			const { password: _, ...user } = newUser;

			return res.status(201).json(user);
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({ errors: z.treeifyError(error) });
			}
			return res.status(500).json({ error: "Error al registrar el usuario" });
		}
	},
);

router.get("/me", authenticate, async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		select: {
			id: true,
			name: true,
			email: true,
			role: {
				select: {
					id: true,
					name: true,
					permission: {
						select: {
							permission: {
								select: { id: true, code: true, name: true },
							},
						},
					},
				},
			},
		},
	});
	res.json(user);
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const user = await prisma.user.findUnique({
			where: { id },
			include: {
				college: true,
				role: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ error: "Error al obtener el usuario" });
	}
});

router.patch(
	"/update",
	authenticate,
	authorize(["update_user"]),
	async (req, res) => {
		try {
			const parseData = UpdateSchema.safeParse(req.body);

			if (!parseData.success) {
				return res.status(400).json({
					message: "Datos inválidos",
					errors: z.treeifyError(parseData.error).properties, //
				});
			}

			// Buscar al usuario que se va a actualizar
			const currentUser = await prisma.user.findUnique({
				where: { id: parseData.data.id },
			});

			if (!currentUser) {
				return res.status(404).json({ error: "Usuario no encontrado" });
			}

			// Si el email cambió, comprobar que no exista en otro usuario
			if (currentUser.email !== parseData.data.email) {
				const emailExists = await prisma.user.findUnique({
					where: { email: parseData.data.email },
				});

				if (emailExists) {
					return res
						.status(400)
						.json({ error: "El correo ya está en uso por otro usuario" });
				}
			}

			const updatedUser = await prisma.user.update({
				where: { id: parseData.data.id },
				data: {
					name: parseData.data.name,
					lastName: parseData.data.lastName,
					email: parseData.data.email,
					collegeId: parseData.data.collegeId,
					roleId: parseData.data.roleId,
					status: parseData.data.status, // Agregado para manejar el estado del usuario
				},
			});
			return res.status(200).json(updatedUser);
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({ errors: z.treeifyError(error) });
			}
			return res.status(500).json({ error: "Error al registrar el usuario" });
		}
	},
);



export default router;
