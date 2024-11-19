'use client'

import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { UpdateBannerForm } from '@/components/forms/UpdateBannerForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'

export function UpdateBannerModel() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger className='w-full'>
        <div className='flex justify-between gap-2 py-2'>
          <span className='flex shrink flex-col items-start gap-1'>
            <span className='text-left text-sm font-medium'>Banner</span>
            <span className='text-left text-xs text-muted-foreground'>
              Upload a profile background image
            </span>
          </span>
          <span className='flex shrink-0 items-center'>
            <ChevronRight className='h-6 w-6' />
          </span>
        </div>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Banner</ModalTitle>
          <ModalDescription>Upload a profile background image</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateBannerForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
