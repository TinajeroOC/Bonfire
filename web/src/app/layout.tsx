import "./globals.css"

import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"

import { AppSidebarInsetHeader } from "@/components/layout/AppSidebarInsetHeader"
import { AppSidebar } from "@/components/layout/AppSiderbar"
import { ApolloProvider } from "@/components/providers/ApolloProvider"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { SidebarInset, SidebarProvider } from "@/components/ui/Sidebar"
import { Toaster } from "@/components/ui/Toaster"
import { siteConfig } from "@/config/site"

import { authOptions } from "./api/auth/[...nextauth]/route"

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ApolloProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <div className="flex h-dvh flex-col">
                    <AppSidebarInsetHeader session={session} />
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
              <Toaster />
            </ThemeProvider>
          </ApolloProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
