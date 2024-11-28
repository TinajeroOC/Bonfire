'use client'

import { createContext, useContext, useState } from 'react'

import { CommunityType } from '@/graphql/__generated__/types'

type CommunityContext = {
  community: CommunityType
  setCommunity: React.Dispatch<React.SetStateAction<CommunityType>>
}

type CommunityProviderProps = {
  community: CommunityType
  children: React.ReactNode
}

const CommunityContext = createContext<CommunityContext>({
  community: {
    dateCreated: undefined,
    description: '',
    id: '',
    isMember: false,
    isOwner: false,
    memberCount: 0,
    name: '',
    ownerId: '',
    title: '',
  },
  setCommunity: function () {
    throw new Error('Function not implemented.')
  },
})

export const useCommunityContext = () => {
  const context = useContext(CommunityContext)
  if (!context) throw new Error('useCommunityContext must be used within a CommunityProvider')
  return context
}

export function CommunityProvider({
  community: defaultCommunity,
  children,
}: CommunityProviderProps) {
  const [community, setCommunity] = useState<CommunityType>(defaultCommunity)
  return (
    <CommunityContext.Provider value={{ community, setCommunity }}>
      {children}
    </CommunityContext.Provider>
  )
}
