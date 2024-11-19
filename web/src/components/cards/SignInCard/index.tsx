import Link from 'next/link'

import { SignInForm } from '@/components/forms/SignInForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

export function SignInCard() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='flex flex-col items-center justify-center gap-1 pb-4'>
        <CardTitle className='text-center text-2xl'>Sign In</CardTitle>
        <CardDescription className='text-center'>Welcome back to the Bonfire!</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className='flex items-center justify-center rounded-b-[20px]'>
        <p className='text-sm'>
          Don't have an account?{' '}
          <Link href='/signup' className='underline'>
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
