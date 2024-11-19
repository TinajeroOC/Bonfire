"use client"

import { useMutation } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
  const [updateAccount, { loading }] = useMutation(UpdateAccountDocument)
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()
  const form = useForm<z.infer<typeof updateAvatarSchema>>({
    resolver: zodResolver(updateAvatarSchema),
  })

  const onSubmit: SubmitHandler<UpdateAvatarInput> = async ({ avatar }) => {
    try {
      const { data: mutation } = await updateAccount({
        variables: {
          avatar,
        },
      })

      if (!mutation?.updateAccount?.success) {
        throw new Error(mutation?.updateAccount?.message)
      }

      await updateSession({
        ...session,
        userAttributes: {
          ...session?.userAttributes,
          avatarUrl: mutation.updateAccount.user?.avatarUrl,
        },
      })

      setModalOpen(false)
      router.refresh()
    } catch (error) {
      form.setError("root", { message: (error as Error).message })
    }
  }

  return (
    <Form {...form}>
      <form noValidate autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>There was an issue updating your avatar</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
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
          <Button disabled={loading} className="w-full md:w-fit">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
