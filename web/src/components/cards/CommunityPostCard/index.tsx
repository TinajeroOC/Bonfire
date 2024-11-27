import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { PostType } from '@/graphql/__generated__/types'

interface CommunityPostCardProps {
  communityName: string
  post: PostType
}

export function CommunityPostCard({ communityName, post }: CommunityPostCardProps) {
  return (
    <div className='relative rounded-lg p-4 transition-colors duration-150 hover:bg-secondary/20'>
      <Link href={`/b/${communityName}/comments/${post.id}`} className='absolute inset-0' />
      <span className='mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
        <Link href={`/u/${post.user?.username}`} className='z-10 flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={post.user?.avatarUrl ?? undefined} alt={post.user?.username} />
            <AvatarFallback className='text-white'>
              {post.user?.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='font-semibold hover:text-blue-500'>{`u/${post.user?.username}`}</span>
          <span>·</span>
        </Link>
        <span className='font-light'>
          {formatDistanceToNow(post.createdAt, { addSuffix: true })}
        </span>
      </span>
      <div>
        <h3 className='mb-1 text-xl font-semibold tracking-tight'>{post.title}</h3>
        <p className='line-clamp-[8] truncate whitespace-pre-line text-sm font-light text-muted-foreground'>
          {post.body}
        </p>
      </div>
    </div>
  )
}
