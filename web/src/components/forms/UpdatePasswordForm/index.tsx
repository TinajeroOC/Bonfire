"use client"

import { useApolloClient } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, Loader2 } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form"
import { PasswordInput } from "@/components/ui/PasswordInput"
import { UpdateAccountPasswordDocument } from "@/graphql/__generated__/operations"
import { UpdatePasswordInput, updatePasswordSchema } from "@/lib/validations/account"

interface UpdatePasswordFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdatePasswordForm({ setModalOpen }: UpdatePasswordFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const apolloClient = useApolloClient()
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const onSubmit: SubmitHandler<UpdatePasswordInput> = async ({ currentPassword, newPassword }) => {
    setIsLoading(true)

    try {
      const { data } = await apolloClient.mutate({
        mutation: UpdateAccountPasswordDocument,
        variables: {
          currentPassword,
          newPassword,
        },
      })

      if (!data?.updateAccountPassword?.success) {
        throw new Error(data?.updateAccountPassword?.message)
      }

      setModalOpen(false)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form noValidate autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>There was an issue updating your password</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name="currentPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput {...field} value={field.value ?? ""} placeholder="Current Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput {...field} value={field.value ?? ""} placeholder="New Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmNewPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput {...field} value={field.value ?? ""} placeholder="Confirm New Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex md:justify-end gap-2">
          <Button onClick={() => setModalOpen(false)} variant="secondary" type="button" className="w-full md:w-fit">
            Cancel
          </Button>
          <Button disabled={isLoading} className="w-full md:w-fit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
