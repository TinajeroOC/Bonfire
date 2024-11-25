'use client'

import { Globe } from 'lucide-react'

import { useCommunityContext } from '@/components/providers/CommunityProvider'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export function CommunityStatusCard() {
  const { community } = useCommunityContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-sm'>
          <Globe className='h-4 w-4' />
          <span>Status</span>
        </CardTitle>
        <CardDescription className='text-xs font-light'>
          {community.isPublic ? 'Public community' : 'Private community'}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
