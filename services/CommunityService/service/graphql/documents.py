from gql import gql

delete_community_posts_document = gql(
    '''
    mutation DeletePosts($communityId: String) {
        deletePosts(communityId: $communityId) {
            success
            message
        }
    }
    ''')
