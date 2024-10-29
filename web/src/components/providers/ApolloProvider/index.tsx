"use client"

import { HttpLink } from "@apollo/client"
import { ApolloClient, ApolloNextAppProvider, InMemoryCache } from "@apollo/experimental-nextjs-app-support"

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_APOLLO_SERVER_URI,
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  })
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}
