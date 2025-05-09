const Question = require('../models/question');

// Créer une nouvelle question
exports.createQuestion = async (req, res) => {
    const { categorie, text, type, options,ponderations } = req.body;

    try {
        const newQuestion = new Question({ categorie, text, type, options,ponderations });
        await newQuestion.save();
        res.status(201).json({ message: 'Question created successfully', question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: 'Error creating question', error });
    }
};

// Obtenir toutes les questions
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error });
    }
};




