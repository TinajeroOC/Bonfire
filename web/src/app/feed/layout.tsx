import { getServerSession } from "next-auth/next"

import { AppNavbar } from "@/components/layout/AppNavbar"

import { authOptions } from "../api/auth/[...nextauth]/route"

interface FeedLayoutProps {
  children: React.ReactNode
}

export default async function FeedLayout({ children }: FeedLayoutProps) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppNavbar session={session} />
      <main className="flex flex-shrink flex-grow basis-0 flex-col items-center justify-center overflow-auto">
        <div className="px-6 w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
