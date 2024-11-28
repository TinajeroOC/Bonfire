'use client'

import { createContext, useContext, useReducer } from 'react'

import { CommentType } from '@/graphql/__generated__/types'
import { commentsReducer, CommentsReducerActions } from '@/reducers/comments'

type CommentsContext = {
  comments: CommentType[]
  dispatch: React.Dispatch<CommentsReducerActions>
}

type CommentProviderProps = {
  comments: CommentType[]
  children: React.ReactNode
}

const CommentsContext = createContext<CommentsContext>({
  comments: [],
  dispatch: function () {
    throw new Error('Function not implemented.')
  },
})

export const useCommentsContext = () => {
  const context = useContext(CommentsContext)
  if (!context) throw new Error('useCommentsContext must be used within a CommentsProvider')
  return context
}

export function CommentsProvider({ comments: defaultComments, children }: CommentProviderProps) {
  const [comments, dispatch] = useReducer(commentsReducer, defaultComments)

  return (
    <CommentsContext.Provider value={{ comments, dispatch }}>{children}</CommentsContext.Provider>
  )
}
