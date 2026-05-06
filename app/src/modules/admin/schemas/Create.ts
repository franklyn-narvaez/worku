import z from 'zod';

export const CreateSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	lastName: z.string().min(1, 'El apellido es requerido'),
	email: z.email('El correo electrónico no es válido'),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
	collegeId: z.string().min(1, 'La escuela es requerida'),
	roleId: z.string().min(1, 'El rol es requerido'),
});

export type CreateType = z.infer<typeof CreateSchema>;
