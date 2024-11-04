import "./globals.css"

import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"

import { ApolloProvider } from "@/components/providers/ApolloProvider"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Toaster } from "@/components/ui/Toaster"
import { siteConfig } from "@/config/site"

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ApolloProvider>{children}</ApolloProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
