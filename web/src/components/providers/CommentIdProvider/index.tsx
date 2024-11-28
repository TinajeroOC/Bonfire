'use client'

import { createContext, useContext } from 'react'

type CommentIdContext = {
  id: string
}

type CommentIdContextProviderProps = {
  id: string
  children: React.ReactNode
}

const CommentIdContext = createContext<CommentIdContext>({
  id: '',
})

export const useCommentIdContext = () => useContext(CommentIdContext)

export function CommentIdProvider({ id, children }: CommentIdContextProviderProps) {
  return <CommentIdContext.Provider value={{ id }}>{children}</CommentIdContext.Provider>
}
