import { z } from "zod"

export const signUpSchema = z.object({
  username: z
    .string()
    .regex(/^[A-Za-z-0-9_]*$/, "Username must only contain letters and numbers")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or fewer"),
  email: z.string().email(),
  password: z.string(),
})

export type SignUpInput = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type SignInInput = z.infer<typeof signInSchema>
