'use client'

import { Ellipsis } from 'lucide-react'

import { DeleteCommentModal } from '@/components/modals/DeleteCommentModal'
import { UpdateCommentModal } from '@/components/modals/UpdateCommentModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

export function CommentDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-24'>
        <DropdownMenuGroup className='flex flex-col'>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <UpdateCommentModal />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <DeleteCommentModal />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
