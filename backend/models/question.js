const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  categorie: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: false
  },
  ponderations: {  // champ pour stocker les pondérations des réponses
    type: [Number],
    required: false
  },
  poids:{
    type:Number,
    require:true
  }
});

const Question = mongoose.model('Question', questionSchema);
module.exports=Question;
