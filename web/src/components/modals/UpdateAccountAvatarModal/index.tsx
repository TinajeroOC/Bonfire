'use client'

import { Image } from 'lucide-react'
import { useState } from 'react'

import { UpdateAccountAvatarForm } from '@/components/forms/UpdateAccountAvatarForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateAccountAvatarModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger icon={Image} label='Avatar' description='Upload a profile image' />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Avatar</ModalTitle>
          <ModalDescription>Upload a profile image</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateAccountAvatarForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
