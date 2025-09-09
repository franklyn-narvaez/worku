import z from "zod";

export const statusEnum = z.enum(["ACTIVE", "INACTIVE"])

export const statusLabels: Record<z.infer<typeof statusEnum>, string> = {
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
}
export const UpdateSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
    email: z.email("El correo electrónico no es válido"),
    collegeId: z.string().min(1, "La escuela es requerida"),
    roleId: z.string().min(1, "El rol es requerido"),
    status: statusEnum,
})

export type UpdateType= z.infer<typeof UpdateSchema>;