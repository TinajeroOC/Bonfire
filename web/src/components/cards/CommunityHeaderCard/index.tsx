import Image from 'next/image'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { CommunityType } from '@/graphql/__generated__/types'

interface CommunityHeaderCardProps {
  community: CommunityType
}

export function CommunityHeaderCard({ community }: CommunityHeaderCardProps) {
  return (
    <div className='relative'>
      {community.bannerUrl ? (
        <Image
          src={community.bannerUrl}
          alt='Community banner'
          width={1000}
          height={400}
          className='h-20 rounded-lg border bg-secondary object-cover md:h-40'
        />
      ) : (
        <div className='h-20 w-full rounded-lg border bg-primary-foreground md:h-40' />
      )}
      <div className='absolute -bottom-8 left-4 md:-bottom-12 md:left-6'>
        <div className='flex items-end gap-2 md:gap-4'>
          <Avatar className='z-10 h-16 w-16 border-2 border-background md:h-24 md:w-24'>
            <AvatarImage src={community.iconUrl ?? undefined} />
            <AvatarFallback className='bg-primary-foreground text-3xl font-bold'>b/</AvatarFallback>
          </Avatar>
          <h1 className='text-xl font-bold tracking-tight md:mb-2 md:text-3xl'>{`b/${community.name}`}</h1>
        </div>
      </div>
    </div>
  )
}
