"use client"

import { useApolloClient } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { UpdateAccountDocument } from "@/graphql/__generated__/operations"
import { updateEmailInput, updateEmailSchema } from "@/lib/validations/account"

interface UpdateEmailFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdateEmailForm({ setModalOpen }: UpdateEmailFormProps) {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const apolloClient = useApolloClient()
  const form = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
  })

  const onSubmit: SubmitHandler<updateEmailInput> = async ({ newEmail }) => {
    setIsLoading(true)

    try {
      const { data } = await apolloClient.mutate({
        mutation: UpdateAccountDocument,
        variables: {
          email: newEmail,
        },
      })

      if (!data?.updateAccount?.success) {
        throw new Error(data?.updateAccount?.message)
      }

      await updateSession({
        ...session,
        userAttributes: {
          ...session?.userAttributes,
          email: newEmail,
        },
      })

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
            <AlertTitle>There was an issue updating your email</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name="newEmail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="New Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmNewEmail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Confirm New Email" />
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
