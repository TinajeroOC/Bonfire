import { Users } from 'lucide-react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface CommunityMemberCountCardProps {
  memberCount: number
}

export function CommunityMemberCountCard({ memberCount }: CommunityMemberCountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-sm'>
          <Users className='h-4 w-4' />
          <span>Members</span>
        </CardTitle>
        <CardDescription className='text-xs font-light'>
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
