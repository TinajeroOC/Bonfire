from gql import gql

posts_document = gql(
    '''
    query Posts($userId: ID) {
        posts(userId: $userId) {
        success
        message
        posts {
            id
            posterId
            communityId
            title
            body
            createdAt
            updatedAt
            isPoster
        }
        }
    }
    ''')

delete_user_posts_document = gql(
    '''
    mutation DeletePosts($userId: ID) {
        deletePosts(userId: $userId) {
            success
            message
        }
    }
    ''')
