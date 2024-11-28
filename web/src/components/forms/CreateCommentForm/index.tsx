'use client'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useCommentsContext } from '@/components/providers/CommentsProvider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Textarea } from '@/components/ui/Textarea'
import { CreateCommentDocument } from '@/graphql/__generated__/operations'
import { CommentInput, commentSchema } from '@/lib/validations/comment'

export function CreateCommentForm() {
  const [createComment, { loading }] = useMutation(CreateCommentDocument)
  const [focused, setFocused] = useState<boolean>(false)
  const { dispatch } = useCommentsContext()
  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: '',
    },
  })
  const params = useParams()

  const onSubmit: SubmitHandler<CommentInput> = async ({ body }) => {
    try {
      const { data: createCommentData } = await createComment({
        variables: {
          postId: params.postId as string,
          body,
        },
      })

      if (!createCommentData?.createComment?.success || !createCommentData.createComment.comment) {
        throw new Error(createCommentData?.createComment?.message)
      }

      form.reset()

      setFocused(false)

      dispatch({
        type: 'created',
        comment: { ...createCommentData.createComment.comment },
      })
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
            <AlertTitle>There was an issue creating the comment</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='body'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Add a comment'
                  className='min-h-0'
                  onFocus={() => setFocused(true)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {focused && (
          <div className='flex justify-end gap-2'>
            <Button
              disabled={loading}
              variant='outline'
              onClick={() => {
                form.clearErrors()
                setFocused(false)
              }}
            >
              Cancel
            </Button>
            <Button disabled={loading} type='submit' className='w-fit' variant='secondary'>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Comment
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
