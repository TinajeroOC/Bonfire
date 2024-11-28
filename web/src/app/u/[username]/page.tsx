import { Fragment } from 'react'

import { FeedPostCard } from '@/components/cards/FeedPostCard'
import { ProfileHeaderCard } from '@/components/cards/ProfileHeaderCard'
import { ProfileInformationCard } from '@/components/cards/ProfileInformationCard'
import { Separator } from '@/components/ui/Separator'
import { UserDocument } from '@/graphql/__generated__/operations'
import { getApolloClient } from '@/lib/apollo'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  const apolloClient = getApolloClient()

  const { data: userData } = await apolloClient.query({
    query: UserDocument,
    variables: {
      username,
    },
  })

  if (!userData.user?.success || !userData.user?.user) {
    throw new Error(userData.user?.message)
  }

  return (
    <div className='mx-auto w-full max-w-6xl p-6'>
      <ProfileHeaderCard user={userData.user.user} />
      <div className='mt-16 flex flex-col-reverse gap-6 md:flex-row'>
        <main className='max-w-3xl flex-grow'>
          <div className='flex flex-col gap-2'>
            {userData.user.user.posts?.map((post) => (
              <Fragment key={post.id}>
                <article>
                  <FeedPostCard post={post} />
                </article>
                <Separator />
              </Fragment>
            ))}
          </div>
        </main>
        <aside className='w-full md:max-w-xs'>
          <ProfileInformationCard user={userData.user.user} />
        </aside>
      </div>
    </div>
  )
}
