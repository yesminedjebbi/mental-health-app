const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, default: null },  // Par défaut null si non fourni
  gender: { type: String, default: "Non spécifié" },  
  centre_d_interet: { type: [String], default: [] },  
  mentalHealthHistory: { type: [String], default: [] },
  points: { type: Number, default: 0 },
  recompenses: { type: [String], default: [] },
  dernierQuizDate: { type: Date, default: null },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
