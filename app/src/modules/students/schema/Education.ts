import { z } from "zod";

export const EducationSchema = z.object({
	level: z.enum(["HIGH_SCHOOL", "UNIVERSITY", "OTHER"], {
		error: "Seleccione un nivel educativo",
	}),
	degreeTitle: z.string().min(1, "El título obtenido es obligatorio"),
	endYear: z.coerce
		.number<number>()
		.min(1900, "Año inválido")
		.max(new Date().getFullYear(), "Año no puede ser en el futuro"),
	institution: z.string().min(1, "La institución es obligatoria"),
	city: z.string().min(1, "La ciudad es obligatoria"),
	semesters: z.coerce.number<number>().nullable().optional(),
});

export const EducationsArraySchema = z
	.array(EducationSchema)
	.min(1, "Debe agregar al menos un registro académico");

export type EducationType = z.infer<typeof EducationSchema>;
