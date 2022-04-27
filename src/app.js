// Dependencies
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();

// imported modules
const db = require("./db");
const models = require("./models");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

// Run server on specified port
const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 3003;

// Config
const app = express();

// Connect to db
db.connect(DB_HOST);

// Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models };
  },
});

// Apollo GraphQL middleware
server.start().then((res) => {
  server.applyMiddleware({ app, path: "/api" });
  app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
  );
});
