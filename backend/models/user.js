const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, default: null },  // Par défaut null si non fourni
  gender: { type: String, default: "Non spécifié" },  
  interests: { type: [String], default: [],required: true},  
  mentalHealth: {
    type: Map,
    of: Number,
    required: false
  },
  points: { type: Number, default: 0 },
  recompenses: { type: [String], default: [] },
  historiqueEtatMental: [
    {
      date: {
        type: Date,
        required: true,
        default: Date.now
      },
      etat: {
        type: Map,
        of: Number,
        required: true
      }
    }
  ],
  profilePicture: {
    type: String, 
    default: '',
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
