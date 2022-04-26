// Dependencies
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
require("dotenv").config();

const db = require("./db");
const DB_HOST = process.env.DB_HOST;

// Run server on specified port
const port = process.env.PORT || 3003;

const notes = [
  {
    id: "1",
    content:
      "If you can't explain it to a six year old, you don't understand it yourself.",
    author: "Albert Einstein",
  },
  {
    id: "2",
    content:
      "The man who does not read has no advantage over the man who cannot read.",
    author: "Mark Twain",
  },
  {
    id: "3",
    content: "The future belongs to those who prepare for it today.",
    author: "Malcolm X",
  },
];

// GraphQL Schema
const typeDefs = gql`
  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`;

// Resolver for Schema fields
const resolvers = {
  Query: {
    notes: () => notes,
    note: (parent, args) => {
      return notes.find((note) => note.id === args.id);
    },
  },
  Mutation: {
    newNote: (parent, args) => {
      const noteVal = {
        id: String(notes.length + 1),
        content: args.content,
        author: "Muhammad Ali",
      };
      notes.push(noteVal);
      return noteVal;
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
