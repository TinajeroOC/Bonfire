'use client'

import { createContext, useContext, useState } from 'react'

import { PostType } from '@/graphql/__generated__/types'

type PostContext = {
  post: PostType
  setPost: React.Dispatch<React.SetStateAction<PostType>>
}

type PostProviderProps = {
  post: PostType
  children: React.ReactNode
}

const PostContext = createContext<PostContext>({
  post: {
    body: '',
    communityId: '',
    createdAt: undefined,
    id: '',
    posterId: '',
    title: '',
    updatedAt: undefined,
  },
  setPost: function () {
    throw new Error('Function not implemented.')
  },
})

export const usePostContext = () => {
  const context = useContext(PostContext)
  if (!context) throw new Error('usePostContext must be used within a PostProvider')
  return context
}

export function PostProvider({ post: defaultPost, children }: PostProviderProps) {
  const [post, setPost] = useState<PostType>(defaultPost)
  return <PostContext.Provider value={{ post, setPost }}>{children}</PostContext.Provider>
}
