const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Added unique constraint to ensure usernames are unique
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String], // Changed to ensure roles is an array of strings
    default: ["Employee"], // Default value should be an array
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", userSchema);
