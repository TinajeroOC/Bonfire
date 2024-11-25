'use client'

import { Image } from 'lucide-react'
import { useState } from 'react'

import { UpdateAccountBannerForm } from '@/components/forms/UpdateAccountBannerForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateAccountBannerModel() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger
        icon={Image}
        label='Banner'
        description='Upload a profile background image'
      />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Banner</ModalTitle>
          <ModalDescription>Upload a profile background image</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateAccountBannerForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
