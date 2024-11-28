import { Fragment } from 'react'

import { FeedPostCard } from '@/components/cards/FeedPostCard'
import { Separator } from '@/components/ui/Separator'
import { FeedPostsDocument } from '@/graphql/__generated__/operations'
import { getApolloClient } from '@/lib/apollo'

export default async function FeedPage() {
  const apolloClient = getApolloClient()

  const { data: postsData } = await apolloClient.query({
    query: FeedPostsDocument,
  })

  if (!postsData.posts?.success) {
    throw new Error(postsData.posts?.message)
  }

  return (
    <div className='mx-auto w-full max-w-6xl p-6'>
      <main>
        <div className='flex flex-col gap-2'>
          {postsData.posts?.posts?.map((post) => (
            <Fragment key={post.id}>
              <article>
                <FeedPostCard post={post} />
              </article>
              <Separator />
            </Fragment>
          ))}
        </div>
      </main>
    </div>
  )
}
