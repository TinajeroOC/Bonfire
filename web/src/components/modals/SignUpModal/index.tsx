'use client'

import { SignUpForm } from '@/components/forms/SignUpForm'
import { Button } from '@/components/ui/Button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'

export function SignUpModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button className='md:min-w-32'>
          <span>Sign Up</span>
        </Button>
      </ModalTrigger>
      <ModalContent className='max-w-md'>
        <ModalHeader>
          <ModalTitle>Sign Up</ModalTitle>
          <ModalDescription>Join us around the Bonfire!</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <SignUpForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
