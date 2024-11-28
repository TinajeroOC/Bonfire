declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      NEXT_PUBLIC_APOLLO_SERVER_URL: string
      NEXTAUTH_URL: string
      NEXTAUTH_SECRET: string
    }
  }
}

export {}
