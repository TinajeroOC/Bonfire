'use client'

import { ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { getSession } from 'next-auth/react'

function makeClient() {
  const authLink = setContext(async (_, { headers }) => {
    const session = await getSession()

    return {
      headers: {
        ...headers,
        Authorization: session?.accessToken ? `JWT ${session.accessToken}` : '',
      },
    }
  })

  const uploadLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_APOLLO_SERVER_URI,
    headers: { 'Apollo-Require-Preflight': 'true' },
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, uploadLink]),
  })
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}
