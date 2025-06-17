// schemas/resourceSchema.ts
import { z } from 'zod';

export const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  notes: z.string().optional(),
  status: z.enum(['watching','reading', 'done']),
});
export type Resource = z.infer<typeof resourceSchema>;
