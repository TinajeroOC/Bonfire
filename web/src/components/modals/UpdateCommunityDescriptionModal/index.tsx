'use client'

import { Text } from 'lucide-react'
import { useState } from 'react'

import { UpdateCommunityDescriptionForm } from '@/components/forms/UpdateCommunityDescriptionForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateCommunityDescriptionModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger
        icon={Text}
        label='Description'
        description='Give your community a description'
      />
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Description</ModalTitle>
          <ModalDescription>Give your community a description</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateCommunityDescriptionForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
