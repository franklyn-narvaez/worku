import { z } from "zod";

export const AvailabilitySchema = z.object({
	dayOfWeek: z.enum([
		"MONDAY",
		"TUESDAY",
		"WEDNESDAY",
		"THURSDAY",
		"FRIDAY",
		"SATURDAY",
		"SUNDAY",
	]),
	startTime1: z.string().min(1, "La hora de inicio es obligatoria"),
	endTime1: z.string().min(1, "La hora de fin es obligatoria"),
	startTime2: z.string().nullable(),
	endTime2: z.string().nullable(),
	startTime3: z.string().nullable(),
	endTime3: z.string().nullable(),
});

export const AvailabilityArraySchema = z
	.array(AvailabilitySchema)
	.min(1, "Debe incluir disponibilidad para todos los días de la semana");

export type AvailabilityType = z.infer<typeof AvailabilitySchema>;
