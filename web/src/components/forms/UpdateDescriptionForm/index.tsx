'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { UpdateAccountDocument } from '@/graphql/__generated__/operations'
import { UpdateDescriptionInput, updateDescriptionSchema } from '@/lib/validations/account'

interface UpdateDescriptionFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdateDescriptionForm({ setModalOpen }: UpdateDescriptionFormProps) {
  const [updateAccount, { loading }] = useMutation(UpdateAccountDocument)
  const { data: session, update: updateSession } = useSession()
  const form = useForm<z.infer<typeof updateDescriptionSchema>>({
    resolver: zodResolver(updateDescriptionSchema),
  })

  const onSubmit: SubmitHandler<UpdateDescriptionInput> = async ({ description }) => {
    try {
      const { data: mutation } = await updateAccount({
        variables: {
          description,
        },
      })

      if (!mutation?.updateAccount?.success) {
        throw new Error(mutation?.updateAccount?.message)
      }

      await updateSession({
        ...session,
        userAttributes: {
          ...session?.userAttributes,
          description,
        },
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
            <AlertTitle>There was an issue updating your description</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='description'
          control={form.control}
          defaultValue={session?.userAttributes.description ?? undefined}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} placeholder='Description' />
              </FormControl>
              <FormDescription className='text-right'>{`${form.watch('description')?.length ?? 0}/200`}</FormDescription>
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
