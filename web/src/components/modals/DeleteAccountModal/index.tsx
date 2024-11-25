'use client'

import { CircleX } from 'lucide-react'
import { useState } from 'react'

import { DeleteAccountForm } from '@/components/forms/DeleteAccountForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function DeleteAccountModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger
        icon={CircleX}
        label='Delete Account'
        description='Delete your account and its data from our servers'
      />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Account</ModalTitle>
          <ModalDescription>
            This action cannot be reversed. By deleting your account, all of your data will be
            removed from our servers
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <DeleteAccountForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
