import { z } from "zod";

export const VerifyEmailSchema = z.object({
    email: z
    .string()
    .email({
      message: "Please enter the correct email format",
    })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Email format is invalid",
    })
})