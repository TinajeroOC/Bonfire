declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      NEXT_PUBLIC_APOLLO_SERVER_URI: string
    }
  }
}

export {}
