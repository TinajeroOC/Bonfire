'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useCommunityContext } from '@/components/providers/CommunityProvider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { CommunitiesDocument, UpdateCommunityDocument } from '@/graphql/__generated__/operations'
import { CommunityIconInput, communityIconSchema } from '@/lib/validations/community'

interface UpdateCommunityIconFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdateCommunityIconForm({ setModalOpen }: UpdateCommunityIconFormProps) {
  const { community, setCommunity } = useCommunityContext()
  const [updateCommunity, { loading }] = useMutation(UpdateCommunityDocument, {
    refetchQueries: [
      { query: CommunitiesDocument, variables: { filter: { membershipType: 'MEMBER' } } },
    ],
  })
  const form = useForm<CommunityIconInput>({
    resolver: zodResolver(communityIconSchema),
  })

  const onSubmit: SubmitHandler<CommunityIconInput> = async ({ icon }) => {
    try {
      const { data: updateCommunityData } = await updateCommunity({
        variables: {
          communityId: community.id,
          icon,
        },
      })

      if (!updateCommunityData?.updateCommunity?.success) {
        throw new Error(updateCommunityData?.updateCommunity?.message)
      }

      setCommunity((community) => {
        return {
          ...community,
          iconUrl: updateCommunityData.updateCommunity?.community?.iconUrl,
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
            <AlertTitle>There was an issue updating the icon</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='icon'
          control={form.control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
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
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
