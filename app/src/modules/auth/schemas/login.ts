import { z } from "zod";

export const LoginSchema = z.object({
	email: z.email("El correo electrónico no es válido"),
	password: z.string().min(1, "Ingresa la contraseña."),
});

export type LoginType = z.infer<typeof LoginSchema>;
