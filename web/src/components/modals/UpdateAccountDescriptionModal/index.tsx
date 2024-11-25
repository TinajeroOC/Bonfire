'use client'

import { Text } from 'lucide-react'
import { useState } from 'react'

import { UpdateAccountDescriptionForm } from '@/components/forms/UpdateAccountDescriptionForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateAccountDescriptionModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger
        icon={Text}
        label='Description'
        description='Share some details about yourself'
      />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Description</ModalTitle>
          <ModalDescription>Share some details about yourself</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateAccountDescriptionForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
