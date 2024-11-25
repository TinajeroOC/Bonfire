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
              isPublic
            }
        }
    }
    ''')
