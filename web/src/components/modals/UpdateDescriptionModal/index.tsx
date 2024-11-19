'use client'

import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { UpdateDescriptionForm } from '@/components/forms/UpdateDescriptionForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'

export function UpdateDescriptionModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger className='w-full'>
        <div className='flex justify-between gap-2 py-2'>
          <span className='flex shrink flex-col items-start gap-1'>
            <span className='text-left text-sm font-medium'>Description</span>
            <span className='text-left text-xs text-muted-foreground'>
              Share some details about yourself
            </span>
          </span>
          <span className='flex shrink-0 items-center'>
            <ChevronRight className='h-6 w-6' />
          </span>
        </div>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Description</ModalTitle>
          <ModalDescription>Share some details about yourself</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateDescriptionForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
