'use client'

import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { PostDropdown } from '@/components/dropdowns/PostDropdown'
import { usePostContext } from '@/components/providers/PostProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { CommunityType } from '@/graphql/__generated__/types'

interface PostContainerProps {
  community: CommunityType
}

export function PostContainer({ community }: PostContainerProps) {
  const { data: session } = useSession()
  const { post } = usePostContext()

  return (
    <div>
      <div className='flex items-start gap-3'>
        <Link href={`/b/${community.name}`}>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={community.iconUrl ?? undefined} />
            <AvatarFallback>b/</AvatarFallback>
          </Avatar>
        </Link>
        <div className='my-auto flex flex-col'>
          <Link
            href={`/b/${community.name}`}
            className='flex items-center gap-2 text-sm leading-none text-muted-foreground'
          >
            <span className='font-semibold'>{`b/${community.name}`}</span>
            <span>·</span>
            <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
          </Link>
          <Link href={`/u/${post.user?.username}`} className='leading-none'>
            <span className='text-sm font-light text-muted-foreground hover:text-blue-500'>
              {post.user?.username}
            </span>
          </Link>
        </div>
        {session?.userAttributes.id === post.posterId && (
          <div className='flex flex-grow justify-end'>{post.isPoster && <PostDropdown />}</div>
        )}
      </div>
      <div className='mb-8 mt-6'>
        <h1 className='mb-1 text-xl font-bold tracking-tight'>{post.title}</h1>
        <p className='whitespace-pre-line text-sm font-light text-muted-foreground'>{post.body}</p>
      </div>
    </div>
  )
}
