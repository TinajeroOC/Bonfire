"use client"

import { useApolloClient } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CircleAlert, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const router = useRouter()
  const apolloClient = useApolloClient()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit: SubmitHandler<SignUpInput> = async ({ username, email, password }) => {
    setIsLoading(true)

    try {
      await apolloClient.mutate({
        mutation: SignUpDocument,
        variables: {
          username,
          email,
          password,
        },
      })

      router.push("/signin")

      toast({ title: "Account Created", description: "Enter your credentials to sign in." })
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form noValidate autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {error && (
          <Alert variant="destructive">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Uh oh, there was an issue signing up!</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
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
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
            <ArrowRight className="ml-[2px] mt-[0.5px] h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
