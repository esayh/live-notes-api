const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
require("dotenv").config();

const gravatar = require("../util/avatar");

module.exports = {
  newNote: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("Please sign in to create a note");
    }
    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("Please sign in to delete note");
    }

    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to delete note");
    }
    try {
      await note.remove();
      return true;
    } catch {
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models }) => {
    if (!user) {
      throw new AuthenticationError("Please sign in to update note");
    }
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to update note");
    }
    return await models.Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          content,
        },
      },
      {
        new: true,
      }
    );
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase();

    // hash password
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar(email);
    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      });

      // create jwt
      return jwt.sign({ id: user._id }, process.env.JW_TOKEN);
    } catch (err) {
      throw new Error("There was an error creating account");
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }

    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    });

    // if user is not valid throw error
    if (!user) {
      throw new AuthenticationError("Error signing in");
    }
    // if password is not valid throw error
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError("Error signing in");
    }
    return jwt.sign({ id: user._id }, process.env.JW_TOKEN);
  },
  toggleFaves: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError();
    }
    // check for favorited note
    const verifyNote = await models.Note.findById(id);
    const hasUser = verifyNote.favoritedBy.indexOf(user.id);

    if (hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: -1,
          },
        },
        {
          new: true,
        }
      );
    } else {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: 1,
          },
        },
        {
          new: true,
        }
      );
    }
  },
};
