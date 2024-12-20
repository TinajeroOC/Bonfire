'use client'

import { useMutation } from '@apollo/client'
import dateFormat from 'dateformat'
import { Cake, Loader2, Users } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { CreatePostModal } from '@/components/modals/CreatePostModal'
import { useCommunityContext } from '@/components/providers/CommunityProvider'
import { Button } from '@/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSeparator,
  CardTitle,
} from '@/components/ui/Card'
import {
  CommunitiesDocument,
  JoinCommunityDocument,
  LeaveCommunityDocument,
} from '@/graphql/__generated__/operations'
import { useToast } from '@/hooks/use-toast'

interface CommunityInformationCardProps {
  includeCommunityName?: boolean
  disableJoinButton?: boolean
}

export function CommunityInformationCard({
  includeCommunityName,
  disableJoinButton,
}: CommunityInformationCardProps) {
  const { community } = useCommunityContext()
  const [memberCount, setMemberCount] = useState<number>(community.memberCount)
  const [isMember, setIsMember] = useState<boolean>(community.isMember)
  const [joinCommunity, { loading: joinCommunityLoading }] = useMutation(JoinCommunityDocument, {
    refetchQueries: [
      { query: CommunitiesDocument, variables: { filter: { membershipType: 'MEMBER' } } },
    ],
  })
  const [leaveCommunity, { loading: leaveCommunityLoading }] = useMutation(LeaveCommunityDocument, {
    refetchQueries: [
      { query: CommunitiesDocument, variables: { filter: { membershipType: 'MEMBER' } } },
    ],
  })
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleCommunityJoin = async () => {
    const { data: joinCommunityData } = await joinCommunity({
      variables: {
        communityId: community.id,
      },
    })

    if (joinCommunityData?.joinCommunity?.success) {
      setIsMember(true)
      setMemberCount((memberCount) => memberCount + 1)
    } else {
      toast({
        title: 'There was an issue joining the community',
        description: 'Contact us if this issue persists',
        variant: 'destructive',
      })
    }
  }

  const handleCommunityLeave = async () => {
    const { data: leaveCommunityData } = await leaveCommunity({
      variables: {
        communityId: community.id,
      },
    })

    if (leaveCommunityData?.leaveCommunity?.success) {
      setIsMember(false)
      setMemberCount((memberCount) => memberCount - 1)
    } else {
      toast({
        title: 'There was an issue leaving the community',
        description: 'Contact us if this issue persists',
        variant: 'destructive',
      })
    }
  }

  const renderMembershipButton = () => {
    if (community.isOwner) {
      return (
        <Button asChild className='w-full' variant='secondary'>
          <Link href={`/b/${community.name}/settings`}>Manage Community</Link>
        </Button>
      )
    }

    if (isMember) {
      return (
        <Button
          onClick={handleCommunityLeave}
          disabled={leaveCommunityLoading}
          variant='secondary'
          className='w-full'
        >
          {leaveCommunityLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Leave Community
        </Button>
      )
    }

    return (
      <Button
        onClick={handleCommunityJoin}
        disabled={joinCommunityLoading}
        variant='secondary'
        className='w-full'
      >
        {joinCommunityLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        Join Community
      </Button>
    )
  }

  return (
    <Card>
      {includeCommunityName ? (
        <CardHeader>
          <Link href={`/b/${community.name}`}>
            <CardTitle className='mb-1 flex font-bold'>{`b/${community.name}`}</CardTitle>
          </Link>
          <CardDescription className='font-light'>
            <span className='block font-semibold'>{community.title}</span>
            <span>{community.description}</span>
          </CardDescription>
        </CardHeader>
      ) : (
        <CardHeader>
          <CardTitle className='text-sm font-bold'>{community.title}</CardTitle>
          <CardDescription className='font-light'>{community.description}</CardDescription>
        </CardHeader>
      )}
      <CardSeparator />
      <CardContent className='flex flex-col gap-2 pt-6'>
        <span className='flex items-center gap-2 text-sm font-light text-muted-foreground'>
          <Users className='h-4 w-4 text-muted-foreground' />
          {`${memberCount} ${memberCount === 1 ? 'Member' : 'Members'}`}
        </span>
        <span className='flex items-center gap-2 text-sm font-light text-muted-foreground'>
          <Cake className='h-4 w-4 text-muted-foreground' />
          {dateFormat(community.dateCreated, 'mmmm dS, yyyy')}
        </span>
      </CardContent>
      {session && (
        <>
          <CardSeparator />
          <CardFooter className='flex flex-col gap-2 pt-6'>
            {isMember && <CreatePostModal />}
            {!disableJoinButton && renderMembershipButton()}
          </CardFooter>
        </>
      )}
    </Card>
  )
}
