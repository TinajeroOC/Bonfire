'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { CommunitiesDocument, DeleteCommunityDocument } from '@/graphql/__generated__/operations'
import { DeleteCommunityInput, deleteCommunitySchema } from '@/lib/validations/community'

interface DeleteCommunityFormProps {
  setModalOpen: (open: boolean) => void
}

export function DeleteCommunityForm({ setModalOpen }: DeleteCommunityFormProps) {
  const { community } = useCommunityContext()
  const [deleteCommunity, { loading }] = useMutation(DeleteCommunityDocument, {
    refetchQueries: [
      { query: CommunitiesDocument, variables: { filter: { membershipType: 'MEMBER' } } },
    ],
  })
  const form = useForm<DeleteCommunityInput>({
    resolver: zodResolver(deleteCommunitySchema),
    defaultValues: {
      name: '',
    },
  })
  const router = useRouter()

  const onSubmit: SubmitHandler<DeleteCommunityInput> = async ({ name }) => {
    try {
      if (name !== community.name) {
        throw new Error('Entered name does not match the name of the community')
      }

      const { data: deleteCommunityData } = await deleteCommunity({
        variables: {
          communityId: community.id,
        },
      })

      if (!deleteCommunityData?.deleteCommunity?.success) {
        throw new Error(deleteCommunityData?.deleteCommunity?.message)
      }

      router.push('/')
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
        className='space-y-4'
      >
        {form.formState.errors.root && (
          <Alert variant='destructive'>
            <CircleAlert className='h-4 w-4' />
            <AlertTitle>There was an issue deleting the community</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder='Community Name' />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Confirm the deletion of your community by entering its name
              </FormDescription>
            </FormItem>
          )}
        />
        <div className='flex gap-2 md:justify-end'>
          <Button
            onClick={() => setModalOpen(false)}
            variant='secondary'
            type='button'
            className='w-full md:w-fit'
          >
            Cancel
          </Button>
          <Button disabled={loading} className='w-full md:w-fit'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Delete
          </Button>
        </div>
      </form>
    </Form>
  )
}
