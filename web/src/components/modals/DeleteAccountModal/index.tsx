'use client'

import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { DeleteAccountForm } from '@/components/forms/DeleteAccountForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'

export function DeleteAccountModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger className='w-full'>
        <div className='flex justify-between gap-2 py-2'>
          <span className='flex shrink flex-col items-start gap-1'>
            <span className='text-left text-sm font-medium'>Delete Account</span>
            <span className='text-left text-xs text-muted-foreground'>
              Delete your account and its data from our servers
            </span>
          </span>
          <span className='flex shrink-0 items-center'>
            <ChevronRight className='h-6 w-6' />
          </span>
        </div>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Account</ModalTitle>
          <ModalDescription>
            This action cannot be reversed. By deleting your account, all of your data will be
            removed from our servers
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <DeleteAccountForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
