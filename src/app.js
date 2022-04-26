// Dependencies
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

// Run server on specified port
const port = process.env.PORT || 3003;

// GraphQL Schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Resolver for Schema fields
const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
};

// Config
const app = express();

// Apollo server
const server = new ApolloServer({ typeDefs, resolvers });

// Apollo GraphQL middleware
server.start().then((res) => {
  server.applyMiddleware({ app, path: "/api" });
  app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
  );
});
