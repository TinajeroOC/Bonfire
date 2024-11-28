'use client'

import { useState } from 'react'

import { UpdateCommentForm } from '@/components/forms/UpdateCommentForm'
import { Button } from '@/components/ui/Button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'

export function UpdateCommentModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant='ghost' className='justify-start'>
          Edit
        </Button>
      </ModalTrigger>
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Edit Comment</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <UpdateCommentForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
