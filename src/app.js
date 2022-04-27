// Dependencies
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();

const db = require("./db");
const models = require("./models");
const typeDefs = require("./schema");

// Run server on specified port
const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 3003;

// Resolver for Schema fields
const resolvers = {
  Query: {
    notes: async () => {
      return await models.Note.find();
    },
    note: async (parent, args) => {
      return await models.Note.findById(args.id);
    },
  },
  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: "Muhammad Ali",
      });
    },
  },
};

// Config
const app = express();

// Connect to db
db.connect(DB_HOST);

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
