import { z } from 'zod';

export const PhotoSchema = z.string().min(1, "La imagen es obligatoria");

export type PhotoSchemaType = z.infer<typeof PhotoSchema>;
