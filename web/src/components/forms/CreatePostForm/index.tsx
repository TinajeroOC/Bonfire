'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useCommunityContext } from '@/components/providers/CommunityProvider'
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
import { CreatePostDocument } from '@/graphql/__generated__/operations'
import { PostInput, postSchema } from '@/lib/validations/post'

interface CreatePostFormProps {
  setModalOpen: (open: boolean) => void
}

export function CreatePostForm({ setModalOpen }: CreatePostFormProps) {
  const [createPost, { loading }] = useMutation(CreatePostDocument)
  const { community } = useCommunityContext()
  const router = useRouter()
  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  })
  const params = useParams()

  const onSubmit: SubmitHandler<PostInput> = async ({ title, body }) => {
    try {
      const { data: createPostData } = await createPost({
        variables: {
          communityId: community.id,
          title,
          body,
        },
      })

      if (!createPostData?.createPost?.success) {
        throw new Error(createPostData?.createPost?.message)
      }

      router.push(`/b/${params.communityName}/comments/${createPostData.createPost.post?.id}`)
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
            <AlertTitle>There was an issue creating the post</AlertTitle>
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
            Create Post
          </Button>
        </div>
      </form>
    </Form>
  )
}
