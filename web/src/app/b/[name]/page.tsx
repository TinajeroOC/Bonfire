import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { CommunityHeaderCard } from '@/components/cards/CommunityHeaderCard'
import { CommunityOverviewCard } from '@/components/cards/CommunityOverviewCard'
import { CommunityDocument } from '@/graphql/__generated__/operations'
import { getApolloClient } from '@/lib/apollo'

interface CommunityPageProps {
  params: Promise<{ name: string }>
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { name } = await params

  const { data: communityData } = await getApolloClient().query({
    query: CommunityDocument,
    variables: {
      name,
    },
  })

  if (!communityData.community?.success || !communityData.community.community) {
    throw new Error('Unable to load community')
  }

  const session = await getServerSession(authOptions)

  return (
    <div className='mx-auto w-full max-w-6xl p-6'>
      <CommunityHeaderCard community={communityData.community.community} />
      <div className='mt-16 flex flex-col-reverse gap-6 md:flex-row'>
        <main className='flex-grow'>
          {communityData.community.community.isPublic ||
          communityData.community.community.isOwner ? (
            <></>
          ) : (
            <div className='flex h-full flex-col items-center justify-center gap-2'>
              <h3 className='font-bold'>Community is Private</h3>
              <p className='text-sm font-light text-muted-foreground'>
                The owner has privated this community
              </p>
            </div>
          )}
        </main>
        <aside className='w-full md:max-w-xs'>
          <CommunityOverviewCard
            community={communityData.community.community}
            disableJoinButton={session ? false : true}
          />
        </aside>
      </div>
    </div>
  )
}
