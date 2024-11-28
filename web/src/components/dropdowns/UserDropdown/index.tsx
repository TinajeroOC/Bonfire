import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { LogOut, Settings, User2 } from 'lucide-react'
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
        <Avatar className='h-10 w-10 hover:cursor-pointer'>
          <AvatarImage
            src={session.userAttributes.avatarUrl ?? undefined}
            alt={session.userAttributes.username}
          />
          <AvatarFallback>{session.userAttributes.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-64'>
        <DropdownMenuLabel>
          <div className='flex items-center gap-3 py-1.5 text-left text-sm'>
            <Avatar className='h-10 w-10 hover:cursor-pointer'>
              <AvatarImage
                src={session.userAttributes.avatarUrl ?? undefined}
                alt={session.userAttributes.username}
              />
              <AvatarFallback>{session.userAttributes.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate text-sm font-bold'>{`u/${session.userAttributes.username}`}</span>
              <span className='truncate text-xs font-normal text-muted-foreground'>
                {session.userAttributes.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/u/${session.userAttributes.username}`}>
          <DropdownMenuItem className='hover:cursor-pointer'>
            <User2 />
            Profile
          </DropdownMenuItem>
        </Link>
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
