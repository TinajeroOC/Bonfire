import "./globals.css"

import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"

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
      <body>{children}</body>
    </html>
  )
}
