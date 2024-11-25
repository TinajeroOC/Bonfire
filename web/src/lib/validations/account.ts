import { z } from 'zod'

export const accountAvatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Avatar image must be a JPG or PNG file'
    ),
})

export type AccountAvatarInput = z.infer<typeof accountAvatarSchema>

export const accountBannerSchema = z.object({
  banner: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Banner image must be a JPG or PNG file'
    ),
})

export type AccountBannerInput = z.infer<typeof accountBannerSchema>

export const accountEmailSchema = z
  .object({
    newEmail: z.string().email(),
    confirmNewEmail: z.string().email(),
  })
  .refine(({ newEmail: email, confirmNewEmail: confirmEmail }) => email === confirmEmail, {
    message: 'New emails must match',
    path: ['confirmNewEmail'],
  })

export type AccountEmailInput = z.infer<typeof accountEmailSchema>

export const accountDisplayNameSchema = z.object({
  displayName: z.string().max(30, 'Display name must be 30 characters or fewer').optional(),
})

export type AccountDisplayNameInput = z.infer<typeof accountDisplayNameSchema>

export const accountDescriptionSchema = z.object({
  description: z.string().max(200, 'Description must be 200 characters or fewer').optional(),
})

export type AccountDescriptionInput = z.infer<typeof accountDescriptionSchema>

export const accountPasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
  })
  .refine(({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword, {
    message: 'New passwords must match',
    path: ['confirmNewPassword'],
  })

export type AccountPasswordInput = z.infer<typeof accountPasswordSchema>

export const deleteAccountSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>
