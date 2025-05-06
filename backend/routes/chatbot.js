const express = require('express');
const axios = require('axios');
const router = express.Router();

// Remplace ici par ton URL ngrok pointing vers Flask
const FLASK_URL = "https://0c6a-34-85-205-81.ngrok-free.app/api/chatbot";

router.post('/api/chatbot', async (req, res) => {
  try { 
    const userMessage = req.body.message;

    const response = await axios.post(FLASK_URL, {
      message: userMessage,
    });

    const { response: botReply, emotion, sentiment ,activity_suggestion } = response.data;

    res.json({ reply: botReply, emotion, sentiment,activity_suggestion  });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erreur lors de l'analyse du message." });
  }
});

module.exports = router;