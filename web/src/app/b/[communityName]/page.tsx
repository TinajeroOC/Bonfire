import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { CommunityHeaderCard } from '@/components/cards/CommunityHeaderCard'
import { CommunityInformationCard } from '@/components/cards/CommunityInformationCard'
import { CommunityPostCard } from '@/components/cards/CommunityPostCard'
import { CommunityProvider } from '@/components/providers/CommunityProvider'
import { Separator } from '@/components/ui/Separator'
import { CommunityDocument, CommunityPostsDocument } from '@/graphql/__generated__/operations'
import { getApolloClient } from '@/lib/apollo'

interface CommunityPageProps {
  params: Promise<{ communityName: string }>
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { communityName } = await params

  const apolloClient = getApolloClient()

  const { data: communityData } = await apolloClient.query({
    query: CommunityDocument,
    variables: {
      name: communityName,
    },
  })

  if (!communityData.community?.success || !communityData.community.community) {
    throw new Error(communityData.community?.message)
  }

  const { data: postsData } = await apolloClient.query({
    query: CommunityPostsDocument,
    variables: {
      communityId: communityData.community.community.id,
    },
  })

  if (!postsData.posts?.success || !postsData.posts.posts) {
    throw new Error('Unable to load posts')
  }

  const session = await getServerSession(authOptions)

  return (
    <div className='mx-auto w-full max-w-6xl p-6'>
      <CommunityHeaderCard community={communityData.community.community} />
      <div className='mt-16 flex flex-col-reverse gap-6 md:flex-row'>
        <main className='max-w-3xl flex-grow'>
          {communityData.community.community.isPublic ||
          communityData.community.community.isOwner ? (
            <div className='flex flex-col gap-2'>
              {postsData.posts?.posts?.map((post, index) => (
                <>
                  <article key={`post-${index}`}>
                    <CommunityPostCard communityName={communityName} post={post} />
                  </article>
                  <Separator key={`sep-${index}`} />
                </>
              ))}
            </div>
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
          <CommunityProvider community={communityData.community.community}>
            <CommunityInformationCard disableJoinButton={session ? false : true} />
          </CommunityProvider>
        </aside>
      </div>
    </div>
  )
}