import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["application/pdf"];

const GradesSchema = z.object({
  grades: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Tamaño máximo permitido: ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Formato permitido pdf",
    }),
});

export type GradesSchemaType = z.infer<typeof GradesSchema>;
