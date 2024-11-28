'use client'

import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { CommentDropdown } from '@/components/dropdowns/CommentDropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { CommentType } from '@/graphql/__generated__/types'

interface CommentContainerProps {
  comment: CommentType
}

export function CommentContainer({ comment }: CommentContainerProps) {
  const { data: session } = useSession()

  return (
    <div className='py-4'>
      <span className='mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
        <Link href={`/u/${comment.user?.username}`} className='z-10 flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={comment.user?.avatarUrl ?? undefined} alt={comment.user?.username} />
            <AvatarFallback className='text-white'>
              {comment.user?.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='font-semibold hover:underline'>{`u/${comment.user?.username}`}</span>
          <span>·</span>
        </Link>
        <span className='font-light'>
          {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
        </span>
        {session?.userAttributes.id === comment.commenterId && (
          <div className='flex flex-grow justify-end text-white'>
            {comment.isCommenter && <CommentDropdown />}
          </div>
        )}
      </span>
      {comment.user && (
        <div>
          <p className='line-clamp-[8] truncate whitespace-pre-line text-sm font-light text-muted-foreground'>
            {comment.body}
          </p>
        </div>
      )}
    </div>
  )
}
