'use client'

import { Ellipsis } from 'lucide-react'

import { DeletePostModal } from '@/components/modals/DeletePostModal'
import { UpdatePostModal } from '@/components/modals/UpdatePostModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

export function PostDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-24'>
        <DropdownMenuGroup className='flex flex-col'>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <UpdatePostModal />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <DeletePostModal />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
