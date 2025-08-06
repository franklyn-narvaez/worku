import {z} from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
    email: z.email("El correo electrónico no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    collegeId: z.string().min(1, "El ID de la facultad es requerido"),
});

export type RegisterType = z.infer<typeof registerSchema>;