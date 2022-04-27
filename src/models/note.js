// Require Mongoose lib
const mongoose = require("mongoose");

// Note db schema
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Note model with schema
const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
