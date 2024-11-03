"use client"

import { Flame, User2Icon } from "lucide-react"
import Link from "next/link"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/Button"
import { siteConfig } from "@/config/site"
import { useMediaQuery } from "@/hooks/use-media-query"

const desktop = "(min-width: 768px)"

interface FeedNavbarProps {
  session: Session | null
}

export function FeedNavbar({ session }: FeedNavbarProps) {
  const isDesktop = useMediaQuery(desktop)

  const onSignOut = async () => await signOut()

  return (
    <nav className="sticky top-0 z-40 h-auto w-full border-b">
      <header className="relative z-40 flex h-16 w-full flex-row flex-nowrap items-center justify-between gap-4 px-6 sm:px-12 md:px-16">
        <div className="flex flex-grow basis-0 flex-row flex-nowrap items-center justify-start bg-transparent gap-1">
          <Flame className="h-6 w-6 stroke-[3px] stroke-orange-600" />
          <span className="text-2xl font-semibold">
            <Link href="/">{siteConfig.name}</Link>
          </span>
        </div>
        {session?.user ? (
          <ul className="flex w-full flex-grow basis-0 flex-row flex-nowrap items-center justify-end gap-4">
            <Button onClick={onSignOut} className="sm:min-w-32" variant="outline">
              <span>Sign Out</span>
            </Button>
          </ul>
        ) : (
          <ul className="flex w-full flex-grow basis-0 flex-row flex-nowrap items-center justify-end gap-4">
            <li>
              <Link href="/signin">
                <Button className="sm:min-w-32" size={isDesktop ? "default" : "icon"} variant="outline">
                  <User2Icon className="block h-4 w-4 sm:hidden" />
                  <span className="hidden sm:block">Sign In</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/signup">
                <Button className="sm:min-w-32" variant="secondary">
                  <span>Sign Up</span>
                </Button>
              </Link>
            </li>
          </ul>
        )}
      </header>
    </nav>
  )
}
