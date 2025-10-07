// src/modules/student/schemas/LanguageSkill.ts
import { z } from "zod";

export const LanguageSchema = z.object({
  language: z.string().min(1, "El idioma es obligatorio"),

  speakLevel: z.enum(["EXCELLENT", "GOOD", "FAIR"], {
    error: "Seleccione un nivel de conversación válido",
  }),

  writeLevel: z.enum(["EXCELLENT", "GOOD", "FAIR"], {
    error: "Seleccione un nivel de escritura válido",
  }),

  readLevel: z.enum(["EXCELLENT", "GOOD", "FAIR"], {
    error: "Seleccione un nivel de lectura válido",
  }),
});

export const LanguageArraySchema = z.array(LanguageSchema).optional();

export type LanguageType = z.infer<typeof LanguageSchema>;
