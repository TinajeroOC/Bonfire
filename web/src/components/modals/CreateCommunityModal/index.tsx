'use client'

import { useState } from 'react'

import { CreateCommunityForm } from '@/components/forms/CreateCommunityForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'

export function CreateCommunityModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <span>Create a Community</span>
      </ModalTrigger>
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Create a Community</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <CreateCommunityForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
