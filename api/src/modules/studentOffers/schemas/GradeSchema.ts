import { z } from 'zod';

export const GradeSchema = z.string().min(1, "El pdf es obligatorio");

export type GradeSchemaType = z.infer<typeof GradeSchema>;
