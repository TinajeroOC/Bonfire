"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CircleAlert, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { PasswordInput } from "@/components/ui/PasswordInput"
import { SignInInput, signInSchema } from "@/lib/validations/auth"

export function SignInForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit: SubmitHandler<SignInInput> = async ({ username, password }) => {
    setLoading(true)

    try {
      const response = await signIn("credentials", {
        redirect: false,
        username,
        password,
      })

      if (!response?.ok) {
        throw new Error("Your username or password is incorrect")
      }

      router.push("/")
      router.refresh()
    } catch (error) {
      form.setError("root", { message: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form noValidate autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Uh oh, there was an issue signing in</AlertTitle>
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
            Sign In
            <ArrowRight className="ml-[2px] mt-[0.5px] h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
