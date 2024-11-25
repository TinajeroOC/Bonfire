import { ApolloServer } from "@apollo/server"
import { ApolloGateway, IntrospectAndCompose, GraphQLDataSourceProcessOptions } from "@apollo/gateway"
import { expressMiddleware } from "@apollo/server/express4"
import FileUploadDataSource from "@abrevior/apollo-federation-upload"
import express from "express"
import cors from "cors"
import { graphqlUploadExpress } from "graphql-upload-ts"

class AuthenticatedDataSource extends FileUploadDataSource {
  async willSendRequest(options: GraphQLDataSourceProcessOptions<Record<string, any>>) {
    if (!options.request) {
      options.request = {}
    }

    if (!options.request.http) {
      options.request.http = {
        method: "POST",
        url: this.url,
        headers: new Headers(),
      }
    }

    const authorizationHeader = options.context.req?.headers?.authorization || options.context.authorization

    if (authorizationHeader) {
      options.request.http.headers.set("Authorization", authorizationHeader)
    }
  }
}

async function startApolloServer() {
  const app = express()

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "Account Service", url: "http://127.0.0.1:8000/graphql/" },
        { name: "Community Service", url: "http://127.0.0.1:8001/graphql/" },
        { name: "Post Service", url: "http://127.0.0.1:8002/graphql/" },
      ],
    }),
    buildService: ({ url }) =>
      new AuthenticatedDataSource({
        url,
        useChunkedTransfer: false,
      }),
  })

  const server = new ApolloServer({
    gateway,
    csrfPrevention: true,
  })

  await server.start()

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    graphqlUploadExpress({
      maxFileSize: 10000000,
      maxFiles: 3,
    }),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          req,
          authorization: req.headers.authorization,
        }
      },
    })
  )

  app.listen(4000)
}

startApolloServer()
