const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Référence vers l'utilisateur
    ref: 'User',  // Nom du modèle utilisateur (si tu en as un)
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,  // Référence vers le modèle Question
    ref: 'Question',
    required: true
  }],
  date: {
    type: Date,
    default: Date.now,  // Ajoute une valeur par défaut
    required: true
  },
  // reponses: { 
  //   type: Map, 
  //   of: String,  // Stocke les réponses sous forme { questionId: "réponse choisie" }
  //   required: false 
  // },
  scores: {
    SleepQuality: Number,
    Productivity: Number,
    Stress: Number,
    Excitement: Number,
    SocialInteraction: Number
  },
  result: {
    type: Map,
    of: Number,
    required: false
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
