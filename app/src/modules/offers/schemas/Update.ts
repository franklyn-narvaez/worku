import z from "zod";

export const UpdateSchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    requirements: z.string().min(1, "Los requisitos son requeridos"),
    collegeId: z.string().min(1, "La escuela es requerida"),
    facultyId: z.string().min(1, "La facultad es requerida"),
    closeDate: z.coerce.date().refine(date => date > new Date(), {
        message: "La fecha de cierre debe ser una fecha futura",
    }),
    status: z.enum(["true", "false"])
});

export type UpdateType = z.infer<typeof UpdateSchema>;
