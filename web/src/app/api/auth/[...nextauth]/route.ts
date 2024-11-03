import { jwtDecode } from "jwt-decode"
import type { AuthOptions, AuthValidity, BackendJWT, DecodedJWT, User, UserObject } from "next-auth"
import NextAuth from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

import { RefreshTokenDocument, SignInDocument } from "@/graphql/__generated__/operations"
import { getClient } from "@/lib/apollo"

async function refreshAccessToken(nextAuthJWT: JWT): Promise<JWT> {
  try {
    const { data } = await getClient().mutate({
      mutation: RefreshTokenDocument,
      variables: {
        token: nextAuthJWT.data.tokens.refresh,
      },
    })

    if (!data?.refreshToken) {
      throw new Error("Unable to refresh token")
    }

    nextAuthJWT.data.validity.validUntil = data.refreshToken.payload.exp
    nextAuthJWT.data.tokens.access = data.refreshToken.token

    return nextAuthJWT
  } catch (error) {
    console.debug(error)
    return {
      ...nextAuthJWT,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          label: "Username",
          type: "username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data } = await getClient().mutate({
            mutation: SignInDocument,
            variables: {
              username: credentials?.username || "",
              password: credentials?.password || "",
            },
          })

          if (!data?.tokenAuth) {
            throw new Error("Unable to authenticate")
          }

          const tokens: BackendJWT = {
            access: data.tokenAuth.token,
            refresh: data.tokenAuth.refreshToken,
          }

          const user: UserObject = {
            id: data.tokenAuth.user.id,
            username: data.tokenAuth.user.username,
            email: data.tokenAuth.user.email,
          }

          const access: DecodedJWT = jwtDecode(data.tokenAuth.token)

          const validity: AuthValidity = {
            validUntil: access.exp,
            refreshUntil: data.tokenAuth.refreshExpiresIn,
          }

          return {
            id: user.id,
            tokens: tokens,
            user: user,
            validity: validity,
          } as User
        } catch (error) {
          console.error(error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl)
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        return { ...token, data: user }
      }

      if (Date.now() < token.data.validity.validUntil * 1000) {
        return token
      }

      if (Date.now() < token.data.validity.refreshUntil * 1000) {
        return await refreshAccessToken(token)
      }

      return { ...token, error: "RefreshTokenExpired" } as JWT
    },
    async session({ session, token }) {
      session.user = token.data.user
      session.validity = token.data.validity
      session.error = token.error
      return session
    },
  },
  pages: {
    newUser: "/signup",
    signIn: "/signin",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
