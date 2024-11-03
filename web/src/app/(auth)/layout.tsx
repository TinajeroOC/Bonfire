import { AuthNavbar } from "@/components/layout/AuthNavbar"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AuthNavbar />
      <main className="flex flex-shrink flex-grow basis-0 flex-col items-center justify-center overflow-auto">
        <div className="px-lg w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
