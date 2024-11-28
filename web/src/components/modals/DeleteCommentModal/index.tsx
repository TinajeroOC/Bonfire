'use client'

import { useMutation } from '@apollo/client'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { useCommentIdContext } from '@/components/providers/CommentIdProvider'
import { useCommentsContext } from '@/components/providers/CommentsProvider'
import { Button } from '@/components/ui/Button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal'
import { DeleteCommentDocument } from '@/graphql/__generated__/operations'
import { useToast } from '@/hooks/use-toast'

export function DeleteCommentModal() {
  const [deleteComment, { loading }] = useMutation(DeleteCommentDocument)
  const [open, setOpen] = useState(false)
  const { id } = useCommentIdContext()
  const { dispatch } = useCommentsContext()
  const { toast } = useToast()

  const handleDeleteComment = async () => {
    const { data: deleteCommentData } = await deleteComment({
      variables: {
        commentId: id,
      },
    })

    if (!deleteCommentData?.deleteComment?.success) {
      toast({
        title: 'There was an issue deleting the comment',
        description: 'Contact us if this issue persists',
        variant: 'destructive',
      })
    }

    setOpen(false)

    dispatch({
      type: 'deleted',
      id,
    })
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant='ghost' className='justify-start'>
          Delete
        </Button>
      </ModalTrigger>
      <ModalContent className='max-w-xl'>
        <ModalHeader>
          <ModalTitle>Delete Comment</ModalTitle>
          <ModalDescription>
            This action cannot be reversed. By deleting this comment, all of its data will be
            removed from our servers
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='destructive' disabled={loading} onClick={handleDeleteComment}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
