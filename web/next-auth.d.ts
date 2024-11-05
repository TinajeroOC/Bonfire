// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { User, UserObject } from "next-auth"

declare module "next-auth" {
  export interface UserObject {
    id: string
    username: string
    email: string
  }

  export interface BackendAccessJWT {
    access: string
  }

  export interface BackendJWT extends BackendAccessJWT {
    refresh: string
  }

  export interface DecodedJWT {
    username: string
    exp: number
    origIat: number
  }

  export interface AuthValidity {
    validUntil: number
    refreshUntil: number
  }

  export interface User {
    tokens: BackendJWT
    user: UserObject
    validity: AuthValidity
  }

  export interface Session {
    user: UserObject
    accessToken: string
    validity: AuthValidity
    error: "RefreshTokenExpired" | "RefreshAccessTokenError"
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    data: User
    error: "RefreshTokenExpired" | "RefreshAccessTokenError"
  }
}
