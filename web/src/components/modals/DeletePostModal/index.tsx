'use client'

import { useMutation } from '@apollo/client'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import { usePostContext } from '@/components/providers/PostProvider'
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
import { DeletePostDocument } from '@/graphql/__generated__/operations'
import { useToast } from '@/hooks/use-toast'

export function DeletePostModal() {
  const [deletePost, { loading }] = useMutation(DeletePostDocument)
  const router = useRouter()
  const params = useParams()
  const [open, setOpen] = useState(false)
  const { post } = usePostContext()
  const { toast } = useToast()

  const handleDeletePost = async () => {
    const { data: deletePostData } = await deletePost({
      variables: {
        postId: post.id,
      },
    })

    if (!deletePostData?.deletePost?.success) {
      toast({
        title: 'There was an issue deleting the post',
        description: 'Contact us if this issue persists',
        variant: 'destructive',
      })
    }

    setOpen(false)

    router.push(`/b/${params.communityName}`)
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
          <ModalTitle>Delete Post</ModalTitle>
          <ModalDescription>
            This action cannot be reversed. By deleting this post, all of its data will be removed
            from our servers
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='destructive' disabled={loading} onClick={handleDeletePost}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
