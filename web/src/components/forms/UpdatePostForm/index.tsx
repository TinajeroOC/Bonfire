'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { usePostContext } from '@/components/providers/PostProvider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { UpdatePostDocument } from '@/graphql/__generated__/operations'
import { PostInput, postSchema } from '@/lib/validations/post'

interface UpdatePostFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdatePostForm({ setModalOpen }: UpdatePostFormProps) {
  const [updatePost, { loading }] = useMutation(UpdatePostDocument)
  const { post, setPost } = usePostContext()
  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      body: post.body,
    },
  })

  const onSubmit: SubmitHandler<PostInput> = async ({ title, body }) => {
    try {
      const { data: updatePostData } = await updatePost({
        variables: {
          postId: post.id,
          title,
          body,
        },
      })

      if (!updatePostData?.updatePost?.success) {
        throw new Error(updatePostData?.updatePost?.message)
      }

      setPost((post) => {
        return {
          ...post,
          title,
          body,
        }
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
          name='title'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className='text-right'>{`${form.watch('title')?.length ?? 0}/300`}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='body'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription className='text-right'>{`${form.watch('body')?.length ?? 0}/10000`}</FormDescription>
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
