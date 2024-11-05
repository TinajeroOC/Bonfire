"use client"

import { HttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { ApolloClient, ApolloNextAppProvider, InMemoryCache } from "@apollo/experimental-nextjs-app-support"
import { getSession } from "next-auth/react"

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_APOLLO_SERVER_URI,
  })

  const authLink = setContext(async (_, { headers }) => {
    const session = await getSession()

    return {
      headers: {
        ...headers,
        Authorization: session?.accessToken ? `JWT ${session.accessToken}` : "",
      },
    }
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  })
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}
