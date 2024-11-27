import './globals.css'

import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import NextTopLoader from 'nextjs-toploader'
import colors from 'tailwindcss/colors'

import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppSidebarInsetHeader } from '@/components/layout/AppSidebarInsetHeader'
import { ApolloProvider } from '@/components/providers/ApolloProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SidebarInset, SidebarProvider } from '@/components/ui/Sidebar'
import { Toaster } from '@/components/ui/Toaster'
import { siteConfig } from '@/config/site'

import { authOptions } from './api/auth/[...nextauth]/route'

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
    <html lang='en' className={GeistSans.className} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ApolloProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
              <NextTopLoader color={colors.orange['500']} height={2} showSpinner={false} />
              <SidebarProvider>
                <AppSidebar session={session} />
                <SidebarInset>
                  <AppSidebarInsetHeader session={session} />
                  {children}
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
