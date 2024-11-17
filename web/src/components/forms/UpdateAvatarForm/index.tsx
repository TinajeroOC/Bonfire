"use client"

import { useApolloClient } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { UpdateAccountDocument } from "@/graphql/__generated__/operations"
import { UpdateAvatarInput, updateAvatarSchema } from "@/lib/validations/account"

interface UpdateAvatarFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdateAvatarForm({ setModalOpen }: UpdateAvatarFormProps) {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const apolloClient = useApolloClient()
  const router = useRouter()
  const form = useForm<z.infer<typeof updateAvatarSchema>>({
    resolver: zodResolver(updateAvatarSchema),
  })

  const onSubmit: SubmitHandler<UpdateAvatarInput> = async ({ avatar }) => {
    setIsLoading(true)

    try {
      const { data } = await apolloClient.mutate({
        mutation: UpdateAccountDocument,
        variables: {
          avatar,
        },
      })

      if (!data?.updateAccount?.success) {
        throw new Error(data?.updateAccount?.message)
      }

      await updateSession({
        ...session,
        userAttributes: {
          ...session?.userAttributes,
          avatarUrl: data.updateAccount.user?.avatarUrl,
        },
      })

      setModalOpen(false)
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
          name="avatar"
          control={form.control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...fieldProps}
                  accept="image/*"
                  type="file"
                  onChange={(event) => onChange(event.target.files && event.target.files[0])}
                />
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
