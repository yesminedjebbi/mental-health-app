const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  interests: { type: [String], required: true }, // Array of interests
});

module.exports = mongoose.model("User", UserSchema);
