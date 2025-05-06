const Question = require('../models/question');
const Quiz=require('../models/quiz');
const User=require('../models/user');
const runModel=require('../python/runPython');

const createQuiz=async (req,res)=>{
      try{     
        const {userId}=req.body;
        const questions= await Question.find();
        if (questions.length === 0) {
            return res.status(400).json({ message: "Aucune question disponible." });
        }
        const quiz=new Quiz({
            userId,
            questions:questions.map(q=>q.id),
            date: new Date(), 

        })
        await quiz.save();
        res.status(201).json({ message: "Quiz créé avec succès", quizId: quiz._id, questions });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du quiz", error });
    }
};
// const getResultHistory=async (req,res)=>{
//       try{
//         const {userId}=req.params;
//         const quizzes = await Quiz.find({ userId })
//         .sort({ date: 1 }) 
//         .select('date result'); 

//         res.status(200).json(quizzes);
//       }catch(error){
//         console.error("Erreur lors de la récupération de l'historique :", error);
//         res.status(500).json({ message: "Erreur serveur" });
//       }
// };
const getQuiz=async(req,res)=>{
  try{
    const {userId}=req.params;
  const lastQuiz = await Quiz.findOne({ userId }).sort({ createdAt: -1 }).populate('questions');
  if (!lastQuiz) {
    return res.status(404).json({ message: 'Aucun quiz trouvé pour cet utilisateur' });
  }

  res.status(200).json(lastQuiz);
} catch (error) {
  console.error('Erreur lors de la récupération du dernier quiz:', error);
  res.status(500).json({ message: 'Erreur serveur' });
}

};
// Controller pour soumettre les réponses et calculer le score
const submitQuizAnswers = async (req, res) => {
    try {
      
      const { userId, answers } = req.body; // quizId et réponses des utilisateurs
      const quiz = await Quiz.findOne({ userId }).sort({ createdAt: -1 }).populate('questions');
      if (!quiz) {
        return res.status(404).json({ message: "Quiz non trouvé." });
      }
      console.log("Réponses reçues:", answers);

  
      // Calculer le score basé sur les réponses
      let scores = await calculateScores(quiz.questions, answers);
      let customParams = await calculateCustomizationParameter(userId);
      console.log("customParams: ",customParams);
      let features = [...Object.values(scores), ...customParams];
      let reshapeFeatures = [features];
      console.log('Features envoyées au modèle (2D):', reshapeFeatures);

      const predictionResult = await runModel({ features: reshapeFeatures});
      console.log("Résultat prédit par le modèle :", predictionResult);


  
      // Enregistrer le résultat dans le quiz
      quiz.scores = scores;
      quiz.result = predictionResult;
      await quiz.save();
      await User.findByIdAndUpdate(
        userId,
        {
          mentalHealth: predictionResult,
          $push: {
            historiqueEtatMental: {
              date: new Date(),
              etat: predictionResult
            }
          }
        }
      );
  
      res.status(200).json({ message: "Réponses soumises avec succès", scores });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la soumission des réponses", error });
    }
  };

// Fonction pour calculer les scores des catégories
async function calculateScores(questions, answers) {
    let scores = {
        SleepQuality: 0,
      Productivity: 0,
      Stress: 0,
      Excitement: 0,
      SocialInteraction:0,
    };
    
  
    // Calculer le score pour chaque question en fonction de sa catégorie
    questions.forEach(question => {
      const answer = answers[question._id]; 
      console.log("Question:", question.categorie, "Answer:", answer); // Récupérer la réponse de l'utilisateur pour cette question
      if (answer) {
        const score = calculateScore(question, answer);
        console.log(score);
        scores[question.categorie] += score; 
        console.log(scores[question.categorie]) 
      }
    });
  
    // Normaliser les scores
    for (let categorie in scores) {
      scores[categorie] = (scores[categorie] / questions.filter(q => q.categorie === categorie).length)*100;
    }
  
    return scores;  
  }
  
  // Fonction pour calculer le score individuel de chaque réponse
  function calculateScore(question, answer) {
      // Si la question est une échelle (de 1-5)
    if (answer >= 1 && answer <= 5) {
      return answer * (question.poids); // Simplement retourner la valeur de la réponse pour l'instant
    }
    // Si la question a des options de réponse (choix multiples)
    if (question.options!=[]) {
      const answerIndex = question.options.indexOf(answer);
      if (answerIndex === -1) return 0;  
      return question.ponderations[answerIndex] * (question.poids) ; // Retourne la pondération en fonction de l'index de la réponse
    }
  
    return 0; // Si la réponse est invalide
  };
  const calculateCustomizationParameter = async (userId) => {
    const user = await User.findById(userId).select('historiqueEtatMental');
  
    if (!user || user.historiqueEtatMental.length === 0) {
      return [0, 0, 0, 0, 0];
    }
  
    let Quizes = new Array(5).fill(0);
    const historique = user.historiqueEtatMental;
  
    historique.forEach(entry => {
      if (!entry.etat || entry.etat.size === 0) return;
      
      const result = Array.from(entry.etat.values()).map(parseFloat);
  
      for (let i = 0; i < result.length; i++) {
        Quizes[i] += result[i] || 0;
      }
    });
  
    // Calculer la moyenne
    for (let i = 0; i < Quizes.length; i++) {
      Quizes[i] = Quizes[i] / historique.length;
    }
  
    return Quizes;
  };
  
 
  
  
 module.exports={createQuiz,submitQuizAnswers,getQuiz,calculateCustomizationParameter};
