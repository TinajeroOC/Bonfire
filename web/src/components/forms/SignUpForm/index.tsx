"use client"

import { useMutation } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CircleAlert, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { PasswordInput } from "@/components/ui/PasswordInput"
import { SignUpDocument } from "@/graphql/__generated__/operations"
import { useToast } from "@/hooks/use-toast"
import { SignUpInput, signUpSchema } from "@/lib/validations/auth"

export function SignUpForm() {
  const [signUp, { loading }] = useMutation(SignUpDocument)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  })
  const router = useRouter()

  const onSubmit: SubmitHandler<SignUpInput> = async ({ username, email, password }) => {
    try {
      const { data: mutation } = await signUp({
        variables: {
          username,
          email,
          password,
        },
      })

      if (!mutation?.createAccount?.success) {
        throw new Error(mutation?.createAccount?.message)
      }

      const response = await signIn("credentials", {
        redirect: false,
        username,
        password,
      })

      if (!response?.ok) {
        throw new Error("Unable to automatically sign in")
      }

      router.refresh()

      toast({ title: "Account Created", description: "You have been signed in automatically" })
    } catch (error) {
      form.setError("root", { message: (error as Error).message })
    }
  }

  return (
    <Form {...form}>
      <form noValidate autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Uh oh, there was an issue signing up</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2">
          <Button disabled={loading} type="submit" className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
            <ArrowRight className="ml-[2px] mt-[0.5px] h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
