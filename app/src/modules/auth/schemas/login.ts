import { z } from "zod";

export const LoginSchema = z.object({
	email: z.email("El correo electrónico no es válido"),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginType = z.infer<typeof LoginSchema>;
