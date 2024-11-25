'use client'

import { Globe } from 'lucide-react'
import { useState } from 'react'

import { UpdateCommunityStatusForm } from '@/components/forms/UpdateCommunityStatusForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateCommunityStatusModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger
        icon={Globe}
        label='Status'
        description='Control whether your community is public or private'
      />
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Status</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <UpdateCommunityStatusForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
