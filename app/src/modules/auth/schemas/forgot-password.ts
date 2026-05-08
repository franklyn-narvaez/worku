import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
	email: z.email('El correo electrónico no es válido'),
});

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
