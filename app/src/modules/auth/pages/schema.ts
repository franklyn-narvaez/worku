import { z } from "zod";

export const RegisterSchema = z
	.object({
		name: z.string().min(1, "El nombre es requerido"),
		lastName: z.string().min(1, "El apellido es requerido"),
		email: z.email("El correo electrónico no es válido"),
		password: z
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres"),
		confirmPassword: z
			.string()
			.min(6, "La confirmación de contraseña debe tener al menos 6 caracteres"),
		collegeId: z.string().min(1, "La escuela es requerida"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Las contraseñas no coinciden",
	});

export type RegisterType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
	email: z.email("El correo electrónico no es válido"),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginType = z.infer<typeof LoginSchema>;
