import { z } from 'zod';

export const ResetPasswordSchema = z.object({
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
	passwordConfirm: z.string().min(6, 'La confirmación de contraseña es requerida'),
}).refine(data => data.password === data.passwordConfirm, {
	message: 'Las contraseñas no coinciden',
	path: ['passwordConfirm'],
});

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
