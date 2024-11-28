'use client'

import { CommentIdProvider } from '@/components/providers/CommentIdProvider'
import { useCommentsContext } from '@/components/providers/CommentsProvider'

import { CommentContainer } from '../CommentContainer'

export function CommentsContainer() {
  const { comments } = useCommentsContext()

  return (
    <>
      {comments.map((comment) => (
        <CommentIdProvider key={comment.id} id={comment.id}>
          <CommentContainer comment={comment} />
        </CommentIdProvider>
      ))}
    </>
  )
}
