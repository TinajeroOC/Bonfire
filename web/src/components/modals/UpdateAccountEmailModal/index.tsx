'use client'

import { Mail } from 'lucide-react'
import { useState } from 'react'

import { UpdateAccountEmailForm } from '@/components/forms/UpdateAccountEmailForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateAccountEmailModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger icon={Mail} label='Email' description='Change your account email' />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Email</ModalTitle>
          <ModalDescription>Change your account email</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateAccountEmailForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
