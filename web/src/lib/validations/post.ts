import { z } from 'zod'

export const postSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must be at least 1 character')
    .max(300, 'Title must be 300 characters or fewer'),
  body: z.string().max(10000, 'Body must be 10000 characters or fewer'),
})

export type PostInput = z.infer<typeof postSchema>
