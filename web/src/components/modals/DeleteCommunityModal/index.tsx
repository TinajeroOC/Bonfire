'use client'

import { CircleX } from 'lucide-react'
import { useState } from 'react'

import { DeleteCommunityForm } from '@/components/forms/DeleteCommunityForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function DeleteCommunityModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger
        icon={CircleX}
        label='Delete Community'
        description='Delete your community from our servers'
      />
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Delete Community</ModalTitle>
          <ModalDescription>
            This action cannot be reversed. By deleting this community, all of its data will be
            removed from our servers
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <DeleteCommunityForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
