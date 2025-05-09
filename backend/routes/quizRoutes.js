const express = require('express');
const router = express.Router();
const quizcontroller=require('../controllers/quizController');

// Créer un quiz
router.post('/', quizcontroller.createQuiz);
router.get('/:userId',quizcontroller.getQuiz);
router.post('/submit',quizcontroller.submitQuizAnswers);
module.exports = router;