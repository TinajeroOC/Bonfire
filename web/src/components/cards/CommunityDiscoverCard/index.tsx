'use client'

import { useMutation } from '@apollo/client'
import Link from 'next/link'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import {
  CommunitiesDocument,
  JoinCommunityDocument,
  LeaveCommunityDocument,
} from '@/graphql/__generated__/operations'
import { CommunityType } from '@/graphql/__generated__/types'
import { useToast } from '@/hooks/use-toast'

interface CommunityDiscoverCardProps {
  community: CommunityType
  disableJoinButton?: boolean
}

export function CommunityDiscoverCard({
  community,
  disableJoinButton,
}: CommunityDiscoverCardProps) {
  const [memberCount, setMemberCount] = useState<number>(community.memberCount)
  const [isMember, setIsMember] = useState<boolean>(community.isMember)
  const [joinCommunity] = useMutation(JoinCommunityDocument, {
    refetchQueries: [
      { query: CommunitiesDocument, variables: { filter: { membershipType: 'MEMBER' } } },
    ],
  })
  const [leaveCommunity] = useMutation(LeaveCommunityDocument, {
    refetchQueries: [
      { query: CommunitiesDocument, variables: { filter: { membershipType: 'MEMBER' } } },
    ],
  })
  const { toast } = useToast()

  const onClick = () => (isMember ? handleCommunityLeave() : handleCommunityJoin())

  const handleCommunityJoin = async () => {
    try {
      const { data: joinCommunityData } = await joinCommunity({
        variables: {
          communityId: community.id,
        },
      })

      if (!joinCommunityData?.joinCommunity?.success) {
        throw new Error(joinCommunityData?.joinCommunity?.message)
      }

      setIsMember(true)
      setMemberCount((memberCount) => memberCount + 1)
    } catch (error) {
      toast({
        title: 'Unable to join community',
        description: (error as Error).message,
      })
    }
  }

  const handleCommunityLeave = async () => {
    try {
      const { data: leaveCommunityData } = await leaveCommunity({
        variables: {
          communityId: community.id,
        },
      })

      if (!leaveCommunityData?.leaveCommunity?.success) {
        throw new Error(leaveCommunityData?.leaveCommunity?.message)
      }

      setIsMember(false)
      setMemberCount((memberCount) => memberCount - 1)
    } catch (error) {
      toast({
        title: 'Unable to join community',
        description: (error as Error).message,
      })
    }
  }

  return (
    <div className='relative rounded-lg border p-4 transition-colors duration-150 hover:bg-secondary/20'>
      <Link href={`b/${community.name}`} className='absolute inset-0 z-10' />
      <div className='flex items-center gap-3'>
        <Avatar className='h-12 w-12'>
          <AvatarImage src={community.iconUrl ?? undefined} />
          <AvatarFallback className='bg-primary-foreground text-base md:text-lg'>b/</AvatarFallback>
        </Avatar>
        <div className='flex-grow'>
          <h4 className='truncate text-sm font-semibold'>{`b/${community.name}`}</h4>
          <p className='text-sm font-light text-muted-foreground'>{`${memberCount} ${memberCount === 1 ? 'member' : 'members'}`}</p>
        </div>
        {!disableJoinButton && (
          <Button onClick={onClick} variant={isMember ? 'outline' : 'secondary'} className='z-20'>
            {isMember ? 'Joined' : 'Join'}
          </Button>
        )}
      </div>
    </div>
  )
}
