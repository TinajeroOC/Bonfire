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
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { UpdateAccountProfileDocument } from "@/graphql/__generated__/operations"
import { UpdateDisplayNameInput, updateDisplayNameSchema } from "@/lib/validations/account"

interface UpdateDisplayNameFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdateDisplayNameForm({ setModalOpen }: UpdateDisplayNameFormProps) {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const apolloClient = useApolloClient()
  const form = useForm<z.infer<typeof updateDisplayNameSchema>>({
    resolver: zodResolver(updateDisplayNameSchema),
  })

  const onSubmit: SubmitHandler<UpdateDisplayNameInput> = async ({ displayName }) => {
    setIsLoading(true)

    try {
      const { data } = await apolloClient.mutate({
        mutation: UpdateAccountProfileDocument,
        variables: {
          displayName,
        },
      })

      if (!data?.updateAccountProfile?.success) {
        throw new Error(data?.updateAccountProfile?.message)
      }

      await updateSession({
        ...session,
        userAttributes: {
          ...session?.userAttributes,
          displayName,
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
            <AlertTitle>There was an issue updating your display name</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name="displayName"
          control={form.control}
          defaultValue={session?.userAttributes.displayName ?? undefined}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Display Name" />
              </FormControl>
              <FormMessage />
              {
                <FormDescription className="text-right">{`${form.watch("displayName")?.length ?? 0}/30`}</FormDescription>
              }
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
