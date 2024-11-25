'use client'

import { AtSign } from 'lucide-react'
import { useState } from 'react'

import { UpdateAccountDisplayNameForm } from '@/components/forms/UpdateAccountDisplayNameForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateAccountDisplayNameModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger
        icon={AtSign}
        label='Display Name'
        description='Choose a custom name to be shown on your profile'
      />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Display Name</ModalTitle>
          <ModalDescription>Choose a custom name to be shown on your profile</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateAccountDisplayNameForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
