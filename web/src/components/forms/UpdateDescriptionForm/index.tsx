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
import { Textarea } from "@/components/ui/Textarea"
import { UpdateAccountDocument } from "@/graphql/__generated__/operations"
import { UpdateDescriptionInput, updateDescriptionSchema } from "@/lib/validations/account"

interface UpdateDescriptionFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdateDescriptionForm({ setModalOpen }: UpdateDescriptionFormProps) {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const apolloClient = useApolloClient()
  const form = useForm<z.infer<typeof updateDescriptionSchema>>({
    resolver: zodResolver(updateDescriptionSchema),
  })

  const onSubmit: SubmitHandler<UpdateDescriptionInput> = async ({ description }) => {
    setIsLoading(true)

    try {
      const { data } = await apolloClient.mutate({
        mutation: UpdateAccountDocument,
        variables: {
          description,
        },
      })

      if (!data?.updateAccount?.success) {
        throw new Error(data?.updateAccount?.message)
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
            <AlertTitle>There was an issue updating your description</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name="description"
          control={form.control}
          defaultValue={session?.userAttributes.description ?? undefined}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} value={field.value ?? ""} placeholder="Description" />
              </FormControl>
              <FormDescription className="text-right">{`${form.watch("description")?.length ?? 0}/200`}</FormDescription>
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
