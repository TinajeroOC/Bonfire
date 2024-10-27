import { ApolloServer } from "apollo-server"
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway"

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [{ name: "AccountService", url: "http://127.0.0.1:8000/graphql/" }],
  }),
})

const server = new ApolloServer({
  gateway,
})

server.listen(4000).then(({ url }) => {
  console.log(`Apollo Server ready at ${url}`)
})
