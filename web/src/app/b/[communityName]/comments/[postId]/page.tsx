import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { BackButton } from '@/components/buttons/BackButton'
import { CommunityInformationCard } from '@/components/cards/CommunityInformationCard'
import { PostContainer } from '@/components/containers/PostContainer'
import { CommunityProvider } from '@/components/providers/CommunityProvider'
import { PostProvider } from '@/components/providers/PostProvider'
import { Separator } from '@/components/ui/Separator'
import { CommunityDocument, PostDocument } from '@/graphql/__generated__/operations'
import { getApolloClient } from '@/lib/apollo'

interface CommentsPageProps {
  params: Promise<{ communityName: string; postId: string }>
}

export default async function CommentsPage({ params }: CommentsPageProps) {
  const { communityName, postId } = await params

  const apolloClient = getApolloClient()

  const [{ data: communityData }, { data: postData }, session] = await Promise.all([
    apolloClient.query({
      query: CommunityDocument,
      variables: {
        name: communityName,
      },
    }),
    apolloClient.query({
      query: PostDocument,
      variables: {
        id: postId,
      },
    }),
    getServerSession(authOptions),
  ])

  if (!communityData.community?.success || !communityData.community.community) {
    throw new Error(communityData.community?.message)
  }

  if (!postData.post?.success || !postData.post.post) {
    throw new Error(postData.post?.message)
  }

  return (
    <div className='relative mx-auto w-full max-w-6xl p-6'>
      <div className='flex flex-col-reverse gap-4 md:flex-row'>
        <main className='max-w-3xl flex-grow'>
          <BackButton />
          <PostProvider post={postData.post.post}>
            <PostContainer community={communityData.community.community} />
          </PostProvider>
          <Separator />
        </main>
        <aside className='w-full md:max-w-xs'>
          <CommunityProvider community={communityData.community.community}>
            <CommunityInformationCard
              disableJoinButton={session ? false : true}
              includeCommunityName
            />
          </CommunityProvider>
        </aside>
      </div>
    </div>
  )
}
