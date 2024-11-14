"use client"

import { ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"

import { UpdateDisplayNameForm } from "@/components/forms/UpdateDisplayNameForm"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/Modal"

export function UpdateDisplayNameModal() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger className="w-full">
        <div className="flex justify-between gap-2 py-2">
          <span className="flex flex-col items-start gap-1 shrink">
            <span className="text-sm font-medium text-left ">Display Name</span>
            <span className="text-xs text-muted-foreground text-left">
              Choose a custom name to be shown on your profile
            </span>
          </span>
          <span className="flex items-center shrink-0 gap-2">
            {session?.userAttributes.displayName && (
              <span className="text-xs text-foreground text-left bg-orange-600 py-1 px-2 rounded-full">
                {session?.userAttributes.displayName}
              </span>
            )}
            <ChevronRight className="h-6 w-6" />
          </span>
        </div>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Display Name</ModalTitle>
          <ModalDescription>Choose a custom name to be shown on your profile</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <UpdateDisplayNameForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
