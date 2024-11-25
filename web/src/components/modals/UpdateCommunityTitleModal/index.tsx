'use client'

import { Text } from 'lucide-react'
import { useState } from 'react'

import { UpdateCommunityTitleForm } from '@/components/forms/UpdateCommunityTitleForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateCommunityTitleModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger icon={Text} label='Title' description='Give your community a title' />
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Give your community a title</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateCommunityTitleForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
