// Require Mongoose Library
const mongoose = require("mongoose");

module.exports = {
  connect: (DB_HOST) => {
    // Connect to db
    mongoose.connect(DB_HOST);

    // Log error if connections fails
    mongoose.connection.on("error", (err) => {
      console.log(err);
      console.log("MongoDB connection error.");
      process.exit();
    });
  },
  close: () => {
    mongoose.connection.close();
  },
};
