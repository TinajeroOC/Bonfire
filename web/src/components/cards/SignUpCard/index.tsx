import Link from 'next/link'

import { SignUpForm } from '@/components/forms/SignUpForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

export function SignUpCard() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='flex flex-col items-center justify-center gap-1 pb-4'>
        <CardTitle className='text-center text-2xl'>Sign Up</CardTitle>
        <CardDescription className='text-center'>Join us around the Bonfire!</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className='flex items-center justify-center rounded-b-[20px]'>
        <p className='text-sm'>
          Already have an account?{' '}
          <Link href='/signin' className='underline'>
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
