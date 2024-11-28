from gql import gql

delete_community_posts_document = gql(
    '''
    mutation DeletePosts($communityId: ID!) {
        deletePosts(communityId: $communityId) {
            success
            message
        }
    }
    ''')
