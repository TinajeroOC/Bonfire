import Image from 'next/image'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { UserType } from '@/graphql/__generated__/types'

interface ProfileHeaderCardProps {
  user: UserType
}

export function ProfileHeaderCard({ user }: ProfileHeaderCardProps) {
  return (
    <div className='relative'>
      {user.bannerUrl ? (
        <Image
          src={user.bannerUrl}
          alt='Banner'
          width={2000}
          height={600}
          className='h-20 rounded-lg border-background bg-primary-foreground object-cover md:h-40'
        />
      ) : (
        <div className='h-20 w-full rounded-lg border-background bg-primary-foreground md:h-40' />
      )}
      <div className='absolute -bottom-8 left-4 md:-bottom-12 md:left-6'>
        <div className='flex items-end gap-2 md:gap-4'>
          <Avatar className='z-10 h-16 w-16 border-2 border-background md:h-24 md:w-24'>
            <AvatarImage src={user.avatarUrl ?? undefined} alt='Avatar' />
            <AvatarFallback className='text-3xl font-bold'>
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className='text-xl font-bold tracking-tight md:mb-2 md:text-3xl'>{`u/${user.username}`}</h1>
        </div>
      </div>
    </div>
  )
}
