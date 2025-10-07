// src/modules/student/schemas/SystemSkill.ts
import { z } from "zod";

export const SystemSkillSchema = z.object({
  programName: z.string().min(1, "El nombre del programa es obligatorio"),
});

export const SystemSkillsArraySchema = z.array(SystemSkillSchema).min(1, {
  message: "Debe agregar al menos un programa o herramienta",
});

export type SystemSkillType = z.infer<typeof SystemSkillSchema>;
