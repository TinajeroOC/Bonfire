import { z } from 'zod'

export const commentSchema = z.object({
  body: z
    .string()
    .min(1, 'Comment must be at least 1 character')
    .max(4000, 'Comment must be 4000 characters or fewer'),
})

export type CommentInput = z.infer<typeof commentSchema>
