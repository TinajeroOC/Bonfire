import { Flame } from "lucide-react"
import Link from "next/link"

import { siteConfig } from "@/config/site"

export function AuthNavbar() {
  return (
    <nav className="sticky top-0 z-40 h-auto w-full border-b">
      <header className="relative z-40 flex h-16 w-full flex-row flex-nowrap items-center justify-between gap-4 px-6 sm:px-12 md:px-16">
        <div className="flex flex-grow basis-0 flex-row flex-nowrap items-center justify-start bg-transparent gap-1">
          <Flame className="h-6 w-6 stroke-[3px] fill-orange-600 stroke-orange-600" />
          <span className="text-2xl font-semibold">
            <Link href="/">{siteConfig.name}</Link>
          </span>
        </div>
      </header>
    </nav>
  )
}
