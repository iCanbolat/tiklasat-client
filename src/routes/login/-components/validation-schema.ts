import { z } from "zod";

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z.string().min(3, "At least 3 char"),
  fullName: z.string().min(3, "At least 3 char"),
});

export const signinSchema = z.object({
  email: z.string().email("This is not a valid email."),
  password: z.string().min(3, "Minimum 3 characters"),
});

export const resetSchema = z.object({
  email: z.string().email("This is not a valid email."),
});

export const newPasswordSchema = z.object({
  password: z.string().min(3, "At least 3 char"),
});

export const MAX_FILE_SIZE = 2000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
