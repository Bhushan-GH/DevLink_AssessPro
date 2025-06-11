// src/schemas/userSchema.ts
import * as z from 'zod';

export const registerSchema = z.object({
  username: z.string().min(2, 'Name is too short'),
  address: z.string().min(5, 'Address is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
