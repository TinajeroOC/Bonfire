import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { CommunityPreviewCard } from '@/components/cards/CommunityPreviewCard'
import { CommunitiesDocument } from '@/graphql/__generated__/operations'
import { getApolloClient } from '@/lib/apollo'

export default async function DiscoverPage() {
  const session = await getServerSession(authOptions)

  const apolloClient = getApolloClient()

  const { data: communitiesData } = await apolloClient.query({
    query: CommunitiesDocument,
    variables: {
      filter: {
        membershipType: 'NON_MEMBER',
      },
    },
  })

  if (!communitiesData.communities?.success) {
    throw new Error(communitiesData.communities?.message)
  }

  return (
    <div className='mx-auto h-full w-full max-w-6xl p-6'>
      <main>
        <h1 className='mb-8 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl'>
          Discover Communities
        </h1>
        <div className='flex flex-wrap gap-4 md:gap-6'>
          {communitiesData.communities.communities.map((community) => (
            <div key={community?.id} className='w-full md:basis-[calc(50%-0.75rem)]'>
              <CommunityPreviewCard
                community={community!}
                disableJoinButton={session ? false : true}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
