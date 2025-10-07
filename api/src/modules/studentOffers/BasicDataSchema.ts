import { z } from "zod";

export const BasicDataSchema = z.object({
	studentCode: z.string().min(1, "El código de estudiante es obligatorio"),
	lastName: z.string().min(1, "El primer apellido es obligatorio"),
	secondLastName: z.string().nullable(),
	fullName: z.string().min(1, "El nombre completo es obligatorio"),

	planCode: z.string().min(1, "El código del programa es obligatorio"),
	planName: z.string().min(1, "El nombre del programa es obligatorio"),
	semester: z.number().min(1, "El semestre es obligatorio"),
	campus: z.string().min(1, "El campus es obligatorio"),
	academicPeriod: z.string().min(1, "El período académico es obligatorio"),
	jornada: z.string().min(1, "La jornada es obligatoria"),

	gender: z.enum(["MASCULINO", "FEMENINO"], {
		error: "Seleccione un género",
	}),

	birthDate: z.coerce.date({
		error: "La fecha de nacimiento es obligatoria",
	}),
	age: z.number().min(0, "Edad inválida"),
	birthPlace: z.string().min(1, "El lugar de nacimiento es obligatorio"),
	idNumber: z.string().min(1, "El número de documento es obligatorio"),
	idIssuedPlace: z.string().min(1, "El lugar de expedición es obligatorio"),

	maritalStatus: z.enum(["SINGLE", "MARRIED", "FREE_UNION", "OTHER"], {
		error: "Seleccione un estado civil",
	}),
	dependents: z.int().min(0, "Debe ser un número mayor o igual a 0"),
	familyPosition: z.enum(["INDEPENDENT", "HEAD_OF_FAMILY", "CHILD", "SPOUSE"], {
		error: "Seleccione una posición familiar",
	}),

	address: z.string().nullable(),
	stratum: z.string().nullable(),
	neighborhood: z.string().nullable(),
	city: z.string().nullable(),
	department: z.string().nullable(),

	phone: z.string().nullable(),
	mobile: z.string().min(1, "El celular es obligatorio"),
	email: z.email("Correo electrónico inválido"),
	emergencyContact: z.string().nullable(),
	emergencyPhone: z.string().nullable(),

	occupationalProfile: z
		.string()
		.min(1, "El perfil ocupacional es obligatorio"),
});

export type BasicDataType = z.infer<typeof BasicDataSchema>;
