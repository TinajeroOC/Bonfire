import { getServerSession } from "next-auth/next"

import { FeedNavbar } from "@/components/layout/FeedNavbar"

import { authOptions } from "../api/auth/[...nextauth]/route"

interface AccountLayoutProps {
  children: React.ReactNode
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <FeedNavbar session={session} />
      <main className="flex flex-shrink flex-grow basis-0 flex-col items-center overflow-auto">
        <div className="px-6 w-full max-w-5xl">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 py-8">Settings</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
