import { ApolloServer } from "apollo-server"
import {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
  GraphQLDataSourceProcessOptions,
} from "@apollo/gateway"

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest(options: GraphQLDataSourceProcessOptions<Record<string, any>>) {
    if (options.request.http && options.context.authorization) {
      options.request.http.headers.set("Authorization", options.context.authorization)
    }
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [{ name: "AccountService", url: "http://127.0.0.1:8000/graphql/" }],
  }),
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url })
  },
})

const server = new ApolloServer({
  gateway,
  context: ({ req }) => ({
    authorization: req.headers.authorization,
  }),
})

server.listen(4000).then(({ url }) => {
  console.log(`Apollo Server ready at ${url}`)
})
