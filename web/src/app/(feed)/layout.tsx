import { getServerSession } from "next-auth/next"

import { FeedNavbar } from "@/components/layout/FeedNavbar"

import { authOptions } from "../api/auth/[...nextauth]/route"

interface FeedLayoutProps {
  children: React.ReactNode
}

export default async function FeedLayout({ children }: FeedLayoutProps) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <FeedNavbar session={session} />
      <main className="flex flex-shrink flex-grow basis-0 flex-col items-center justify-center overflow-auto">
        <div className="px-lg w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
