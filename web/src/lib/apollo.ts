import { ApolloLink, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/experimental-nextjs-app-support'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const { getClient: getApolloClient } = registerApolloClient(() => {
  const authLink = setContext(async () => {
    const session = await getServerSession(authOptions)

    return {
      headers: {
        Authorization: session?.accessToken ? `JWT ${session.accessToken}` : '',
      },
    }
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      authLink,
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_APOLLO_SERVER_URL,
      }),
    ]),
  })
})
