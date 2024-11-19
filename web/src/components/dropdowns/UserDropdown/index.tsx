import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu'

interface UserDropdownProps {
  session: Session
}

export function UserDropdown({ session }: UserDropdownProps) {
  const onSignOut = async () => await signOut()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='h-10 w-10 rounded-sm'>
          <AvatarImage
            src={session.userAttributes.avatarUrl ?? undefined}
            alt={session.userAttributes.username}
          />
          <AvatarFallback className='select-none'>
            {session.userAttributes.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-56'>
        <DropdownMenuLabel>
          <div className='flex items-center gap-3 py-1.5 text-left text-sm'>
            <Avatar className='h-10 w-10 rounded-sm'>
              <AvatarImage
                src={session.userAttributes.avatarUrl ?? undefined}
                alt={session.userAttributes.displayName ?? session.userAttributes.username}
              />
              <AvatarFallback className='select-none'>
                {session.userAttributes.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{session.userAttributes.username}</span>
              <span className='truncate text-xs text-muted-foreground'>
                {session.userAttributes.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href='/settings'>
          <DropdownMenuItem className='hover:cursor-pointer'>
            <Settings />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className='hover:cursor-pointer'>
          <LogOut />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
