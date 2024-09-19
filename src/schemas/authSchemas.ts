import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string({ message: "First Name must be a string" })
    .min(4, { message: "First Name must be 4 or more characters long" })
    .max(50, { message: "First Name must be 50 or fewer characters long" }),

  lastName: z
    .string({ message: "Last Name must be a string" })
    .min(4, { message: "Last Name must be 4 or more characters long" })
    .max(50, { message: "Last Name must be 50 or fewer characters long" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string({ message: "Password must be a string" })
    .min(4, { message: "Password must be 4 or more characters long" })
    .max(30, { message: "Password must be 30 or fewer characters long" }),

  phone: z
    .string()
    .min(4, { message: "Phone Number is too short" })
    .max(14, { message: "Phone Number is too long" })
    .optional(),

  image: z.string().optional(),
});

export const loginSchema = registerSchema.pick({ email: true, password: true });

export const refreshSchema = z.object({
  refreshToken: z.string({ message: "Invalid refresh Token" }),
});
