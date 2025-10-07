import { z } from "zod";

export const TrainingSchema = z.object({
	institution: z.string().min(1, "La institución es obligatoria"),
	courseName: z.string().min(1, "El nombre del curso es obligatorio"),
	duration: z.string().min(1, "La duración es obligatoria"),
	endDate: z.coerce.date<Date>({
		error: "La fecha de finalización es obligatoria",
	}),
});

export const TrainingsArraySchema = z.array(TrainingSchema).optional();

export type TrainingType = z.infer<typeof TrainingSchema>;
