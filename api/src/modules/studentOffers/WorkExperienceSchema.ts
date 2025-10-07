// src/modules/student/schemas/WorkExperience.ts
import { z } from "zod";

export const WorkExperienceSchema = z.object({
	companyName: z.string().min(1, "El nombre de la empresa es obligatorio"),
	role: z.string().min(1, "El cargo es obligatorio"),
	functions: z.string().min(1, "Las funciones son obligatorias"),
	achievements: z.string().nullable(),
	bossName: z.string().min(1, "El nombre del jefe inmediato es obligatorio"),
	bossRole: z.string().min(1, "El cargo del jefe es obligatorio"),
	bossPhone: z.string().min(1, "El teléfono del jefe es obligatorio"),
	startDate: z.coerce.date({
		error: "La fecha de inicio es obligatoria",
	}),
	endDate: z.coerce.date().nullable(),
});

export const WorkExperiencesArraySchema = z
	.array(WorkExperienceSchema)
	.optional();

export type WorkExperienceType = z.infer<typeof WorkExperienceSchema>;
