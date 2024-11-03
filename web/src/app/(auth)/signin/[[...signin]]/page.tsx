import { Metadata } from "next"

import { SignInCard } from "@/components/cards/SignInCard"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Sign In - ${siteConfig.name}`,
}

export default async function SignInPage() {
  return <SignInCard />
}
