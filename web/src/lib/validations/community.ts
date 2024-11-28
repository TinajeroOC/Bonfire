import { z } from 'zod'

export const communitySchema = z.object({
  name: z
    .string()
    .regex(/^[A-Za-z-0-9_]*$/, 'Name must only contain letters and numbers')
    .min(3, 'Name must be at least 3 characters')
    .max(20, 'Name must be 20 characters or fewer'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be 50 characters or fewer'),
  description: z.string().max(500, 'Description must be 500 characters or fewer'),
  icon: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Icon image must be a JPG or PNG file'
    )
    .optional(),
  banner: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Banner image must be a JPG or PNG file'
    )
    .optional(),
})

export type CommunityInput = z.infer<typeof communitySchema>

export const communityIconSchema = z.object({
  icon: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Icon image must be a JPG or PNG file'
    ),
})

export type CommunityIconInput = z.infer<typeof communityIconSchema>

export const communityBannerSchema = z.object({
  banner: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Banner image must be a JPG or PNG file'
    ),
})

export type CommunityBannerInput = z.infer<typeof communityBannerSchema>

export const communityTitleSchema = z.object({
  title: z.string().max(50, 'Title must be 50 characters or fewer'),
})

export type CommunityTitleInput = z.infer<typeof communityTitleSchema>

export const communityDescriptionSchema = z.object({
  description: z.string().max(500, 'Description must be 500 characters or fewer'),
})

export type CommunityDescriptionInput = z.infer<typeof communityDescriptionSchema>

export const deleteCommunitySchema = z.object({
  name: z.string(),
})

export type DeleteCommunityInput = z.infer<typeof deleteCommunitySchema>
