import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const GradesSchema = z
  .any()
  .refine(
    (file) => {
      if (typeof file === 'string') return true;

      if (file instanceof FileList) {
        file = file.length > 0 ? file[0] : undefined;
      }
      return file !== undefined && file !== null;
    },
    { message: 'El certificado de notas es obligatorio.' }
  )
  .refine(
    (file) => {
      if (typeof file === 'string') return true;

      if (file instanceof FileList) {
        file = file.length > 0 ? file[0] : undefined;
      }
      return file instanceof File;
    },
    { message: 'Debe ser un archivo válido.' }
  )
  .refine(
    (file) => {
      if (typeof file === 'string') return true;

      if (file instanceof FileList) {
        file = file.length > 0 ? file[0] : undefined;
      }
      return file && file.size <= MAX_FILE_SIZE;
    },
    { message: `Tamaño máximo permitido: ${MAX_FILE_SIZE / (1024 * 1024)}MB.` }
  )
  .refine(
    (file) => {
      if (typeof file === 'string') return true;

      if (file instanceof FileList) {
        file = file.length > 0 ? file[0] : undefined;
      }
      return file && ACCEPTED_FILE_TYPES.includes(file.type);
    },
    { message: 'Solo se permiten archivos PDF.' }
  );

export type GradesSchemaType = z.infer<typeof GradesSchema>;
