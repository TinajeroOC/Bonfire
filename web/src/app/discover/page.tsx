import { getServerSession } from 'next-auth'

import { CommunityDiscoverCard } from '@/components/cards/CommunityDiscoverCard'
import { CommunitiesDocument } from '@/graphql/__generated__/operations'
import { getApolloClient } from '@/lib/apollo'

import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function DiscoverPage() {
  const session = await getServerSession(authOptions)

  const { data: communitiesData } = await getApolloClient().query({
    query: CommunitiesDocument,
    variables: {
      filter: {
        membershipType: 'NON_MEMBER',
        communityStatus: 'PUBLIC',
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
              <CommunityDiscoverCard
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
