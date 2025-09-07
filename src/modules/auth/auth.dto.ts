import { z } from "zod";
import { Gender, Sex, UserRole } from "../user/user.constant";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(UserRole).default(UserRole.User),
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  dateOfBirth: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
      message: "Date of Birth must be in format dd/mm/yyyy",
    }),
  gender: z.enum(Gender),
  sex: z.enum(Sex),
  deviceTokens: z.string().optional(),
});

export const verifyOTPSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Invalid otp"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  deviceTokens: z.string().optional(),
});

export const logoutSchema = z.object({
  deviceTokens: z.string(),
});
