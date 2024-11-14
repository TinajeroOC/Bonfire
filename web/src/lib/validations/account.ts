import { z } from "zod"

export const updateAvatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      "Avatar image must be a JPG or PNG file"
    ),
})

export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>

export const updateBannerSchema = z.object({
  banner: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      "Banner image must be a JPG or PNG file"
    ),
})

export type UpdateBannerInput = z.infer<typeof updateBannerSchema>

export const updateEmailSchema = z
  .object({
    newEmail: z.string().email(),
    confirmNewEmail: z.string().email(),
  })
  .refine(({ newEmail: email, confirmNewEmail: confirmEmail }) => email === confirmEmail, {
    message: "New emails must match",
    path: ["confirmNewEmail"],
  })

export type updateEmailInput = z.infer<typeof updateEmailSchema>

export const updateDisplayNameSchema = z.object({
  displayName: z.string().max(30, "Display name must shorter than 30 characters").optional(),
})

export type UpdateDisplayNameInput = z.infer<typeof updateDisplayNameSchema>

export const updateDescriptionSchema = z.object({
  description: z.string().max(200, "Description must shorter than 200 characters").optional(),
})

export type UpdateDescriptionInput = z.infer<typeof updateDescriptionSchema>

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Enter your current password" }),
    newPassword: z.string().min(1, { message: "Enter a password" }),
    confirmNewPassword: z.string().min(1, { message: "Enter a password" }),
  })
  .refine(({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword, {
    message: "New passwords must match",
    path: ["confirmNewPassword"],
  })

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>

export const deleteAccountSchema = z.object({
  username: z.string().min(1, { message: "Enter your username" }),
  password: z.string().min(1, { message: "Enter your password" }),
})

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>
