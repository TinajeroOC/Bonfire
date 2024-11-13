import { jwtDecode } from "jwt-decode"
import type { AuthOptions, DecodedAccessToken, Tokens, UserAttributes } from "next-auth"
import NextAuth from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

import { RefreshTokenDocument, SignInDocument } from "@/graphql/__generated__/operations"
import { getClient } from "@/lib/apollo"

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const { data } = await getClient().mutate({
      mutation: RefreshTokenDocument,
      variables: {
        refreshToken: token.user.tokens.refresh,
      },
    })

    if (!data?.refreshToken) {
      throw new Error("Unable to refresh access token")
    }

    token.user.tokens.access = data.refreshToken.token
    token.user.tokens.refresh = data.refreshToken.refreshToken
    token.user.tokens.accessExp = data.refreshToken.payload.exp

    return token
  } catch (error) {
    console.error(error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: AuthOptions = {
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

          if (!data?.auth) {
            throw new Error("Unable to authenticate")
          }

          const userAttributes: UserAttributes = {
            id: data.auth.user.id,
            email: data.auth.user.email,
            username: data.auth.user.username,
            displayName: data.auth.user.displayName,
            description: data.auth.user.description,
            avatarUrl: data.auth.user.avatarUrl,
            bannerUrl: data.auth.user.bannerUrl,
          }

          const decodedAccessToken: DecodedAccessToken = jwtDecode(data.auth.token)

          const tokens: Tokens = {
            access: data.auth.token,
            accessExp: decodedAccessToken.exp,
            refresh: data.auth.refreshToken,
            refreshExp: data.auth.refreshExpiresIn,
          }

          return {
            id: userAttributes.id,
            tokens: tokens,
            attributes: userAttributes,
          }
        } catch (error) {
          console.error(error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ trigger, token, user, session }) {
      if (trigger === "signIn") {
        return { user }
      }

      if (trigger === "update") {
        token.user.attributes = session.userAttributes
        return token
      }

      if (Date.now() < token.user.tokens.accessExp * 1000) {
        return token
      }

      if (Date.now() < token.user.tokens.refreshExp * 1000) {
        return await refreshAccessToken(token)
      }

      return { ...token, error: "RefreshTokenExpired" }
    },
    async session({ session, token }) {
      session.userAttributes = token.user.attributes
      session.accessToken = token.user.tokens.access
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
