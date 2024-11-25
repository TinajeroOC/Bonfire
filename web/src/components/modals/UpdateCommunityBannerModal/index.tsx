'use client'

import { Image } from 'lucide-react'
import { useState } from 'react'

import { UpdateCommunityBannerForm } from '@/components/forms/UpdateCommunityBannerForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateCommunityBannerModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger icon={Image} label='Banner' description='Upload a banner image' />
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Banner</ModalTitle>
          <ModalDescription>Upload a banner image</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateCommunityBannerForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
