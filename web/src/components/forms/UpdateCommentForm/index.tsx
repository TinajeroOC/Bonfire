'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useCommentIdContext } from '@/components/providers/CommentIdProvider'
import { useCommentsContext } from '@/components/providers/CommentsProvider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/Form'
import { Textarea } from '@/components/ui/Textarea'
import { UpdateCommentDocument } from '@/graphql/__generated__/operations'
import { CommentInput, commentSchema } from '@/lib/validations/comment'

interface UpdateCommentFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdateCommentForm({ setModalOpen }: UpdateCommentFormProps) {
  const [updateComment, { loading }] = useMutation(UpdateCommentDocument)
  const { id } = useCommentIdContext()
  const { comments, dispatch } = useCommentsContext()
  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: comments.find((comment) => comment.id === id)?.body,
    },
  })

  const onSubmit: SubmitHandler<CommentInput> = async ({ body }) => {
    try {
      const { data: updateCommentData } = await updateComment({
        variables: {
          commentId: id,
          body,
        },
      })

      if (!updateCommentData?.updateComment?.success || !updateCommentData?.updateComment.comment) {
        throw new Error(updateCommentData?.updateComment?.message)
      }

      dispatch({
        type: 'updated',
        comment: updateCommentData.updateComment.comment,
      })

      setModalOpen(false)
    } catch (error) {
      form.setError('root', { message: (error as Error).message })
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        autoComplete='off'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-2'
      >
        {form.formState.errors.root && (
          <Alert variant='destructive'>
            <CircleAlert className='h-4 w-4' />
            <AlertTitle>There was an issue updating the post</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='body'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} placeholder='Comment' />
              </FormControl>
              <FormDescription className='text-right'>{`${form.watch('body')?.length ?? 0}/4000`}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='pt-2'>
          <Button disabled={loading} type='submit' className='w-full'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
