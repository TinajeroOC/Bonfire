import dateFormat from 'dateformat'
import { Cake } from 'lucide-react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface CommunityDateCardProps {
  date: string
}

export function CommunityDateCard({ date }: CommunityDateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-sm'>
          <Cake className='h-4 w-4' />
          <span>Creation Date</span>
        </CardTitle>
        <CardDescription className='text-xs font-light'>
          {dateFormat(date, 'mmmm dS, yyyy')}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
