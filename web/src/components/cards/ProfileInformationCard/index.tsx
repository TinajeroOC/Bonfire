'use client'

import dateFormat from 'dateformat'
import { Cake } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

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
import { UserType } from '@/graphql/__generated__/types'

interface ProfileInformationCardProps {
  user: UserType
}

export function ProfileInformationCard({ user }: ProfileInformationCardProps) {
  const { data: session } = useSession()

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm font-bold'>
          {user.displayName || `u/${user.username}`}
        </CardTitle>
        <CardDescription className='font-light'>
          {user.description || 'Sitting near the bonfire...'}
        </CardDescription>
      </CardHeader>
      <CardSeparator />
      <CardContent className='flex flex-col gap-2 pt-6'>
        <span className='flex items-center gap-2 text-sm font-light text-muted-foreground'>
          <Cake className='h-4 w-4 text-muted-foreground' />
          {dateFormat(user.dateJoined, 'mmmm dS, yyyy')}
        </span>
      </CardContent>
      {session?.userAttributes.id === user.id && (
        <>
          <CardSeparator />
          <CardFooter className='flex flex-col gap-2 pt-6'>
            <Button variant='secondary' className='w-full'>
              <Link href='/settings'>Manage Settings</Link>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
