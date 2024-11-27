import Link from 'next/link'

import { BackButton } from '@/components/buttons/BackButton'
import { CommunityDateCard } from '@/components/cards/CommunityDateCard'
import { CommunityMemberCountCard } from '@/components/cards/CommunityMemberCountCard'
import { CommunityStatusCard } from '@/components/cards/CommunityStatusCard'
import { DeleteCommunityModal } from '@/components/modals/DeleteCommunityModal'
import { UpdateCommunityBannerModal } from '@/components/modals/UpdateCommunityBannerModal'
import { UpdateCommunityDescriptionModal } from '@/components/modals/UpdateCommunityDescriptionModal'
import { UpdateCommunityIconModal } from '@/components/modals/UpdateCommunityIconModal'
import { UpdateCommunityStatusModal } from '@/components/modals/UpdateCommunityStatusModal'
import { UpdateCommunityTitleModal } from '@/components/modals/UpdateCommunityTitleModal'
import { CommunityProvider } from '@/components/providers/CommunityProvider'
import { CommunityDocument } from '@/graphql/__generated__/operations'
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

  if (!communityData.community.community.isOwner) {
    throw new Error('Only the owner can manage community settings')
  }

  return (
    <CommunityProvider community={communityData.community.community}>
      <div className='relative mx-auto w-full max-w-6xl p-6'>
        <main>
          <BackButton />
          <div className='flex flex-col'>
            <Link href={`/b/${communityData.community.community.name}`}>
              <h1 className='mb-8 scroll-m-20 text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl'>
                {`b/${communityData.community.community.name}`}
              </h1>
            </Link>
            <div className='flex w-full flex-col items-start gap-4'>
              <h2 className='mt-2 scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl'>
                Overview
              </h2>
              <div className='flex w-full flex-col gap-2 md:flex-row'>
                <CommunityStatusCard />
                <CommunityMemberCountCard
                  memberCount={communityData.community.community.memberCount}
                />
                <CommunityDateCard date={communityData.community.community.dateCreated} />
              </div>
              <h2 className='mt-2 scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl'>
                Settings
              </h2>
              <UpdateCommunityIconModal />
              <UpdateCommunityBannerModal />
              <UpdateCommunityTitleModal />
              <UpdateCommunityDescriptionModal />
              <UpdateCommunityStatusModal />
              <DeleteCommunityModal />
            </div>
          </div>
        </main>
      </div>
    </CommunityProvider>
  )
}
