'use client'

import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { DeleteAccountDocument } from '@/graphql/__generated__/operations'
import { DeleteAccountInput, deleteAccountSchema } from '@/lib/validations/account'

interface DeleteAccountFormProps {
  setModalOpen: (open: boolean) => void
}

export function DeleteAccountForm({ setModalOpen }: DeleteAccountFormProps) {
  const [deleteAccount, { loading }] = useMutation(DeleteAccountDocument)
  const router = useRouter()
  const form = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
  })

  const onSubmit: SubmitHandler<DeleteAccountInput> = async ({ username, password }) => {
    try {
      const { data: mutation } = await deleteAccount({
        variables: {
          username,
          password,
        },
      })

      if (!mutation?.deleteAccount?.success) {
        throw new Error(mutation?.deleteAccount?.message)
      }

      await signOut()
      router.refresh()
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
            <AlertTitle>There was an issue updating your avatar</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name='username'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ''} placeholder='Username' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='password'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput {...field} value={field.value ?? ''} placeholder='Password' />
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
            Delete
          </Button>
        </div>
      </form>
    </Form>
  )
}
