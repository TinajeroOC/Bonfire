'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/Button'

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      size='icon'
      variant='secondary'
      className='absolute -left-[2rem] rounded-full hover:cursor-pointer max-2xl:hidden'
      onClick={router.back}
      asChild
    >
      <ArrowLeft className='h-10 w-10 p-2' />
    </Button>
  )
}
