'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { UpdateAccountPasswordDocument } from '@/graphql/__generated__/operations'
import { UpdatePasswordInput, updatePasswordSchema } from '@/lib/validations/account'

interface UpdatePasswordFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdatePasswordForm({ setModalOpen }: UpdatePasswordFormProps) {
  const [updateAccountPassword, { loading }] = useMutation(UpdateAccountPasswordDocument)

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const onSubmit: SubmitHandler<UpdatePasswordInput> = async ({ currentPassword, newPassword }) => {
    try {
      const { data: mutation } = await updateAccountPassword({
        variables: {
          currentPassword,
          newPassword,
        },
      })

      if (!mutation?.updateAccountPassword?.success) {
        throw new Error(mutation?.updateAccountPassword?.message)
      }

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
            <AlertTitle>There was an issue updating your password</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='currentPassword'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  {...field}
                  value={field.value ?? ''}
                  placeholder='Current Password'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='newPassword'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput {...field} value={field.value ?? ''} placeholder='New Password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='confirmNewPassword'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  {...field}
                  value={field.value ?? ''}
                  placeholder='Confirm New Password'
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
