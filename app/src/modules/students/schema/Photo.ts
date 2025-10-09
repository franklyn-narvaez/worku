// Photo.ts
import { z } from 'zod';

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PhotoSchema = z
  .any()
  .refine(
    (file) => {
      if (typeof file === 'string') return true;

      if (file instanceof FileList) {
        file = file.length > 0 ? file[0] : undefined;
      }
      return file !== undefined && file !== null;
    },
    { message: 'Selecciona una imagen.' }
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
      return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
    },
    { message: 'Formatos permitidos: .jpg, .png, .webp' }
  );

export type PhotoSchemaType = z.infer<typeof PhotoSchema>;
