'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
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
import { Switch } from '@/components/ui/Switch'
import { UpdateCommunityDocument } from '@/graphql/__generated__/operations'
import { CommunityStatusInput, communityStatusSchema } from '@/lib/validations/community'

interface UpdateCommunityStatusFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdateCommunityStatusForm({ setModalOpen }: UpdateCommunityStatusFormProps) {
  const { community, setCommunity } = useCommunityContext()
  const [updateCommunity, { loading: updateCommunityLoading }] =
    useMutation(UpdateCommunityDocument)
  const form = useForm<CommunityStatusInput>({
    resolver: zodResolver(communityStatusSchema),
    defaultValues: {
      isPublic: community.isPublic,
    },
  })

  const onSubmit: SubmitHandler<CommunityStatusInput> = async ({ isPublic }) => {
    try {
      const { data: updateCommunityData } = await updateCommunity({
        variables: {
          communityId: community.id,
          isPublic,
        },
      })

      if (!updateCommunityData?.updateCommunity?.success) {
        throw new Error(updateCommunityData?.updateCommunity?.message)
      }

      setCommunity((community) => {
        return {
          ...community,
          isPublic,
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
        className='space-y-4'
      >
        {form.formState.errors.root && (
          <Alert variant='destructive'>
            <CircleAlert className='h-4 w-4' />
            <AlertTitle>There was an issue updating the description</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='isPublic'
          control={form.control}
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between'>
              <FormDescription>
                Disabling this will prevent users from viewing your community
              </FormDescription>
              <FormControl>
                <Switch
                  name='status'
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
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
          <Button disabled={updateCommunityLoading} className='w-full md:w-fit'>
            {updateCommunityLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
