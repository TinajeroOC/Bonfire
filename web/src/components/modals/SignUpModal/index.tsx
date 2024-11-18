"use client"

import { User2Icon } from "lucide-react"

import { SignUpForm } from "@/components/forms/SignUpForm"
import { Button } from "@/components/ui/Button"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/Modal"
import { useMediaQuery } from "@/hooks/use-media-query"

export function SignUpModal() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button className="sm:min-w-32" size={isDesktop ? "default" : "icon"} variant="outline">
          <User2Icon className="block h-4 w-4 sm:hidden" />
          <span className="hidden sm:block">Sign Up</span>
        </Button>
      </ModalTrigger>
      <ModalContent className="max-w-md">
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
