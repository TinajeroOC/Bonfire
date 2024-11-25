'use client'

import { KeyRound } from 'lucide-react'
import { useState } from 'react'

import { UpdateAccountPasswordForm } from '@/components/forms/UpdateAccountPasswordForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateAccountPasswordModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger
        icon={KeyRound}
        label='Password'
        description='Change your account password'
      />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Password</ModalTitle>
          <ModalDescription>Change your account password</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateAccountPasswordForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
