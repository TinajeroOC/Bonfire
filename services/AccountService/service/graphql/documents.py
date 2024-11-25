from gql import gql

delete_user_posts_document = gql(
    '''
    mutation DeletePosts($userId: ID) {
        deletePosts(userId: $userId) {
            success
            message
        }
    }
    ''')
