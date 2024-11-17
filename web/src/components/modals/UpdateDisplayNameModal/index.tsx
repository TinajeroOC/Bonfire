"use client"

import { ChevronRight } from "lucide-react"
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
          <ChevronRight className="h-6 w-6" />
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
