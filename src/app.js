// Dependencies
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
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

// validate user token
const validateUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JW_TOKEN);
    } catch (err) {
      throw new Error("Session is not valid");
    }
  }
};

// Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = validateUser(token);
    return { models, user };
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
