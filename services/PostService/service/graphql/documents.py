from gql import gql

community_document = gql(
    '''
    query Community($id: ID!) {
        community(id: $id) {
            success
            message
            community {
                id
                name
                isOwner
                isMember
            }
        }
    }
    ''')

comments_document = gql(
    '''
    query Comments($postId: ID!) {
        comments(postId: $postId) {
            success
            message
            comments {
                id
                body
                postId
                commenterId
                updatedAt
                createdAt
                isCommenter
            }
        }
    }
    ''')

delete_post_comments_document = gql(
    '''
    mutation DeleteComments($postId: ID!) {
        deleteComments(postId: $postId) {
            success
            message
        }
    }
    '''
)
