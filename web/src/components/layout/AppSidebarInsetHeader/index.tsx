'use client'

import { Flame } from 'lucide-react'
import { Session } from 'next-auth'

import { UserDropdown } from '@/components/dropdowns/UserDropdown'
import { SignInModal } from '@/components/modals/SignInModal'
import { SignUpModal } from '@/components/modals/SignUpModal'
import { SidebarTrigger } from '@/components/ui/Sidebar'

interface AppSidebarInsetHeaderProps {
  session: Session | null
}

export function AppSidebarInsetHeader({ session }: AppSidebarInsetHeaderProps) {
  return (
    <div className='sticky top-0 z-10 h-auto w-full border-b bg-background'>
      <header className='flex h-16 w-full flex-row flex-nowrap items-center justify-between gap-4 px-6 md:px-10'>
        <div className='flex flex-row items-center gap-2 md:hidden'>
          <SidebarTrigger className='block md:hidden' />
          <Flame className='h-6 w-6 fill-orange-600 stroke-orange-600 stroke-[3px]' />
        </div>
        {session ? (
          <ul className='flex w-full flex-grow basis-0 flex-row flex-nowrap items-center justify-end gap-4'>
            <UserDropdown session={session} />
          </ul>
        ) : (
          <ul className='flex w-full flex-grow basis-0 flex-row flex-nowrap items-center justify-end gap-4'>
            <li>
              <SignUpModal />
            </li>
            <li>
              <SignInModal />
            </li>
          </ul>
        )}
      </header>
    </div>
  )
}
