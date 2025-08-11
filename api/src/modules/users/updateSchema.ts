import z from "zod";

export const UpdateSchema = z.object({
    id: z.string().min(1, "El ID es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
    email: z.email("El correo electrónico no es válido"),
    collegeId: z.string().min(1, "La escuela es requerida"),
    roleId: z.string().min(1, "El rol es requerido"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
})

export type UpdateType= z.infer<typeof UpdateSchema>;