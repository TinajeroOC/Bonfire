from gql import gql

post_document = gql(
    '''
    query Post($id: ID!) {
      post(id: $id) {
        success
        message
        post {
          id
          title
          body
          isPoster
          posterId
          communityId
          createdAt
          updatedAt
        }
      }
    }
    ''')
