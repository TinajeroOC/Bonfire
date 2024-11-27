'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

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
import { CommunitiesDocument, CreateCommunityDocument } from '@/graphql/__generated__/operations'
import { CommunityInput, communitySchema } from '@/lib/validations/community'

interface CreateCommunityFormProps {
  setModalOpen: (open: boolean) => void
}

export function CreateCommunityForm({ setModalOpen }: CreateCommunityFormProps) {
  const [createCommunity, { loading }] = useMutation(CreateCommunityDocument, {
    refetchQueries: [
      { query: CommunitiesDocument, variables: { filter: { membershipType: 'MEMBER' } } },
    ],
  })
  const router = useRouter()
  const form = useForm<CommunityInput>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      name: '',
      title: '',
      description: '',
    },
  })

  const onSubmit: SubmitHandler<CommunityInput> = async ({
    name,
    title,
    description,
    icon,
    banner,
  }) => {
    try {
      const { data: createCommunityData } = await createCommunity({
        variables: {
          name,
          title,
          description,
          icon,
          banner,
        },
      })

      if (!createCommunityData?.createCommunity?.success) {
        throw new Error(createCommunityData?.createCommunity?.message ?? '')
      }

      router.push(`/b/${name}`)
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
            <AlertTitle>There was an issue creating the community</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className='text-right'>{`${form.watch('name')?.length ?? 0}/20`}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='title'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className='text-right'>{`${form.watch('title')?.length ?? 0}/50`}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='description'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription className='text-right'>{`${form.watch('description')?.length ?? 0}/500`}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='icon'
          control={form.control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  accept='image/*'
                  type='file'
                  onChange={(event) => onChange(event.target.files && event.target.files[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='banner'
          control={form.control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Banner</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  accept='image/*'
                  type='file'
                  onChange={(event) => onChange(event.target.files && event.target.files[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='pt-2'>
          <Button disabled={loading} type='submit' className='w-full'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Create Community
          </Button>
        </div>
      </form>
    </Form>
  )
}
