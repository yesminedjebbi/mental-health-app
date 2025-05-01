const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  happiness: { type: Number, required: true}, 
  depression: { type: Number, required: true },
  anxiety: { type: Number, required: true },
  loneliness: { type: Number, required: true },
  anger: { type: Number, required: true },
});

module.exports = mongoose.model("mentalstate", UserSchema);
