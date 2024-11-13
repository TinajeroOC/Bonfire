// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { User, UserAttributes } from "next-auth"

declare module "next-auth" {
  export interface UserAttributes {
    id: string
    email: string
    username: string
    displayName?: string | null
    description?: string | null
    avatarUrl?: string | null
    bannerUrl?: string | null
  }

  export interface Tokens {
    access: string
    accessExp: number
    refresh: string
    refreshExp: number
  }

  export interface DecodedAccessToken {
    username: string
    exp: number
    origIat: number
  }

  export interface User {
    attributes: UserAttributes
    tokens: Tokens
  }

  export interface Session {
    userAttributes: UserAttributes
    accessToken: string
    error?: "RefreshTokenExpired" | "RefreshAccessTokenError"
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    user: User
    error?: "RefreshTokenExpired" | "RefreshAccessTokenError"
  }
}
