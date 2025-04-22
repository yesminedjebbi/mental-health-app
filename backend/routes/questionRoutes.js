const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Créer une nouvelle question
router.post('/questions', questionController.createQuestion);

// Obtenir toutes les questions
router.get('/questions', questionController.getQuestions);



module.exports = router;
