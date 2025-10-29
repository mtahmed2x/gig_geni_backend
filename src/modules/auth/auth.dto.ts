import { z } from 'zod';
import { UserRole } from '../user/user.constant';

export const registerSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().min(11, 'Phone number must be at least 11 digits'),
  role: z.enum(UserRole).default(UserRole.Employee),
  name: z.string().min(1, 'Name is required'),
  deviceTokens: z.string().optional(),
});

enum VerifyOTPType {
  Verify = 'Verify',
  Reset = 'Reset',
}

export const verifyOTPSchema = z.object({
  type: z.enum(VerifyOTPType),
  otp: z.string().regex(/^\d{6}$/, 'Invalid otp'),
});

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  deviceTokens: z.string().optional(),
});

export const logoutSchema = z.object({
  deviceTokens: z.string(),
});
