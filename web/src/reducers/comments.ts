import { CommentType } from '@/graphql/__generated__/types'

type CommentsReducerCreateAction = {
  type: 'created'
  comment: CommentType
}

type CommentsReducerUpdateAction = {
  type: 'updated'
  comment: CommentType
}

type CommentsReducerDeleteAction = {
  type: 'deleted'
  id: string
}

export type CommentsReducerActions =
  | CommentsReducerCreateAction
  | CommentsReducerUpdateAction
  | CommentsReducerDeleteAction

export function commentsReducer(comments: CommentType[], action: CommentsReducerActions) {
  switch (action.type) {
    case 'created':
      return [action.comment, ...comments]
    case 'updated':
      return comments.map((comment) => {
        if (comment.id === action.comment.id) {
          return action.comment
        } else {
          return comment
        }
      })
    case 'deleted':
      return comments.filter((comment) => comment.id !== action.id)
    default:
      throw new Error(`Unknown action: ${action}`)
  }
}
