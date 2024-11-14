import { getServerSession } from "next-auth/next"

import { AppNavbar } from "@/components/layout/AppNavbar"

import { authOptions } from "../api/auth/[...nextauth]/route"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppNavbar session={session} />
      <main className="flex flex-shrink flex-grow basis-0 flex-col items-center overflow-auto">
        <div className="px-6 my-4 w-full max-w-5xl">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl mt-4 mb-8">Settings</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
