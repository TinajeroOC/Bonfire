import { Metadata } from "next"

import { SignUpCard } from "@/components/cards/SignUpCard"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Sign Up - ${siteConfig.name}`,
}

export default async function SignUpPage() {
  return <SignUpCard />
}
