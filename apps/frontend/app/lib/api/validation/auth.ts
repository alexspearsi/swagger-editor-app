import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[a-zA-Z\u00C0-\u024F\u0400-\u04FF]/, 'At least one letter')
  .regex(/\d/, 'At least one digit')
  .regex(/[^a-zA-Z\u00C0-\u024F\u0400-\u04FF0-9\s]/, 'At least one special character');

export const signInSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email'),
    password: passwordSchema,
    passwordRepeat: z.string(),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: 'Password do not match',
    path: ['passwordRepeat'],
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
