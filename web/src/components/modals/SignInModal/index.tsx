'use client'

import { User2Icon } from 'lucide-react'

import { SignInForm } from '@/components/forms/SignInForm'
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
import { useMediaQuery } from '@/hooks/use-media-query'

export function SignInModal() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button className='sm:min-w-32' size={isDesktop ? 'default' : 'icon'} variant='outline'>
          <User2Icon className='block h-4 w-4 sm:hidden' />
          <span className='hidden sm:block'>Sign In</span>
        </Button>
      </ModalTrigger>
      <ModalContent className='max-w-md'>
        <ModalHeader>
          <ModalTitle>Sign In</ModalTitle>
          <ModalDescription>Welcome back to the Bonfire!</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <SignInForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
