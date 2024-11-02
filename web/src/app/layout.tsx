import "./globals.css"

import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"

import { ApolloProvider } from "@/components/providers/ApolloProvider"
import { AuthProvider } from "@/components/providers/AuthProvider"

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Bonfire",
  description: "Gather around the Bonfire!",
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <AuthProvider>
          <ApolloProvider>{children}</ApolloProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
