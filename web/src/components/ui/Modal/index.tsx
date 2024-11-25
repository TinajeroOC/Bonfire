'use client'

import { ChevronRight, LucideIcon } from 'lucide-react'
import * as React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/Drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ny } from '@/lib/utils'

interface BaseProps {
  children: React.ReactNode
}

interface RootModalProps extends BaseProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface ModalProps extends BaseProps {
  className?: string
  asChild?: true
}

const desktop = '(min-width: 768px)'

const Modal = ({ children, ...props }: RootModalProps) => {
  const isDesktop = useMediaQuery(desktop)
  const Modal = isDesktop ? Dialog : Drawer

  return <Modal {...props}>{children}</Modal>
}

const ModalTrigger = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger

  return (
    <ModalTrigger className={className} {...props}>
      {children}
    </ModalTrigger>
  )
}

interface ModalLabeledTriggerProps {
  icon: LucideIcon
  label: string
  description?: string
  className?: string
  children?: React.ReactNode
}

const ModalLabeledTrigger = ({
  icon: Icon,
  label,
  description,
  className = '',
  children,
  ...props
}: ModalLabeledTriggerProps) => {
  return (
    <ModalTrigger
      className={ny(
        'w-full rounded-lg border px-6 py-0.5 transition-colors hover:bg-secondary',
        className
      )}
      {...props}
    >
      <div className='flex justify-between gap-2 py-2'>
        <div className='flex items-center gap-4'>
          <Icon />
          <span className='flex shrink flex-col items-start gap-1'>
            <span className='text-left text-sm font-semibold'>{label}</span>
            {description && (
              <span className='text-left text-xs font-light text-muted-foreground'>
                {description}
              </span>
            )}
          </span>
        </div>
        <span className='flex shrink-0 items-center'>
          <ChevronRight className='h-6 w-6' />
        </span>
      </div>
      {children}
    </ModalTrigger>
  )
}

const ModalClose = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalClose = isDesktop ? DialogClose : DrawerClose

  return (
    <ModalClose className={className} {...props}>
      {children}
    </ModalClose>
  )
}

const ModalContent = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalContent = isDesktop ? DialogContent : DrawerContent

  return (
    <ModalContent className={className} {...props}>
      {children}
    </ModalContent>
  )
}

const ModalDescription = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalDescription = isDesktop ? DialogDescription : DrawerDescription

  return (
    <ModalDescription className={className} {...props}>
      {children}
    </ModalDescription>
  )
}

const ModalHeader = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalHeader = isDesktop ? DialogHeader : DrawerHeader

  return (
    <ModalHeader className={className} {...props}>
      {children}
    </ModalHeader>
  )
}

const ModalTitle = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalTitle = isDesktop ? DialogTitle : DrawerTitle

  return (
    <ModalTitle className={className} {...props}>
      {children}
    </ModalTitle>
  )
}

const ModalBody = ({ className, children, ...props }: ModalProps) => {
  return (
    <div className={ny('px-4 pb-4 md:px-0 md:pb-0', className)} {...props}>
      {children}
    </div>
  )
}

const ModalFooter = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalFooter = isDesktop ? DialogFooter : DrawerFooter

  return (
    <ModalFooter className={className} {...props}>
      {children}
    </ModalFooter>
  )
}

export {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalLabeledTrigger,
  ModalTitle,
  ModalTrigger,
}
