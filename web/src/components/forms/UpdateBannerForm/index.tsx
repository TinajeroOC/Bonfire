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
import { UpdateAccountMediaDocument } from "@/graphql/__generated__/operations"
import { UpdateBannerInput, updateBannerSchema } from "@/lib/validations/account"

interface UpdateBannerFormProps {
  setModalOpen: (open: boolean) => void
}

export function UpdateBannerForm({ setModalOpen }: UpdateBannerFormProps) {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const router = useRouter()
  const apolloClient = useApolloClient()
  const form = useForm<z.infer<typeof updateBannerSchema>>({
    resolver: zodResolver(updateBannerSchema),
  })

  const onSubmit: SubmitHandler<UpdateBannerInput> = async ({ banner }) => {
    setIsLoading(true)

    try {
      const { data } = await apolloClient.mutate({
        mutation: UpdateAccountMediaDocument,
        variables: {
          banner,
        },
      })

      if (!data?.updateAccountMedia?.success) {
        throw new Error(data?.updateAccountMedia?.message)
      }

      await updateSession({
        ...session,
        userAttributes: {
          ...session?.userAttributes,
          bannerUrl: data.updateAccountMedia.bannerUrl,
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
          name="banner"
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
