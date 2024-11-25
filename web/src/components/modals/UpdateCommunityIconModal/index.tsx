'use client'

import { Image } from 'lucide-react'
import { useState } from 'react'

import { UpdateCommunityIconForm } from '@/components/forms/UpdateCommunityIconForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
} from '@/components/ui/Modal'

export function UpdateCommunityIconModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalLabeledTrigger icon={Image} label='Icon' description='Upload an icon image' />
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Icon</ModalTitle>
          <ModalDescription>Upload an icon image</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateCommunityIconForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
