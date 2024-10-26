import { users } from "@nexcom/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const userSchema = createSelectSchema(users);

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  avatar: z.string().url({ message: "Please enter a valid URL" }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updateUserRoleSchema = userSchema.pick({
  id: true,
  role: true,
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export const signUpSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const createFirstUserSchema = signUpSchema;

export type CreateFirstUserInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(255, { message: "Password cannot exceed 255 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export type SignInInput = z.infer<typeof signInSchema>;

export * from "./products";
