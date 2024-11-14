"use client"

import { useApolloClient } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { PasswordInput } from "@/components/ui/PasswordInput"
import { DeleteAccountDocument } from "@/graphql/__generated__/operations"
import { DeleteAccountInput, deleteAccountSchema } from "@/lib/validations/account"

interface DeleteAccountFormProps {
  setModalOpen: (open: boolean) => void
}

export function DeleteAccountForm({ setModalOpen }: DeleteAccountFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const apolloClient = useApolloClient()
  const router = useRouter()
  const form = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
  })

  const onSubmit: SubmitHandler<DeleteAccountInput> = async ({ username, password }) => {
    setIsLoading(true)

    try {
      const { data } = await apolloClient.mutate({
        mutation: DeleteAccountDocument,
        variables: {
          username,
          password,
        },
      })

      if (!data?.deleteAccount?.success) {
        throw new Error(data?.deleteAccount?.message)
      }

      await signOut()
      router.refresh()
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
            <AlertTitle>There was an issue updating your avatar</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput {...field} value={field.value ?? ""} placeholder="Password" />
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
            Delete
          </Button>
        </div>
      </form>
    </Form>
  )
}
