"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"

import { UpdateEmailForm } from "@/components/forms/UpdateEmailForm"
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@/components/ui/Modal"

export function UpdateEmailModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger className="w-full">
        <div className="flex justify-between gap-2 py-2">
          <span className="flex flex-col items-start gap-1 shrink">
            <span className="text-sm font-medium text-left">Email</span>
          </span>
          <span className="flex items-center shrink-0">
            <ChevronRight className="h-6 w-6" />
          </span>
        </div>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Email</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <UpdateEmailForm setModalOpen={setOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
