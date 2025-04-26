const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Route pour la prédiction
router.post('/', (req, res) => {
  console.log('Requête reçue pour la prédiction');  // Message de débogage

  const { depression, anxiety, happiness, loneliness, anger, activity_progress, time_spent } = req.body;
  console.log('Données reçues:', { depression, anxiety, happiness, loneliness, anger, activity_progress, time_spent });  // Message de débogage

  // Lancer le script Python avec les paramètres
  const pythonProcess = spawn('python', [
    path.join(__dirname, '../python/predict.py'), // Chemin vers predict.py
    depression, 
    anxiety, 
    happiness, 
    loneliness, 
    anger, 
    activity_progress, 
    time_spent
  ]);

  let responseSent = false;

  pythonProcess.stdout.on('data', (data) => {
    console.log('Données du script Python:', data.toString());  // Message de débogage

    if (!responseSent) {
      try {
        const prediction = JSON.parse(data.toString());
        console.log('Prédiction reçue:', prediction);  // Message de débogage
        res.status(200).json({
          message: 'Prédiction réussie',
          predicted_probabilities: prediction.predicted_probabilities,
          states: prediction.states
        });
        responseSent = true;
      } catch (error) {
        console.error('Erreur lors de la conversion des données du script Python:', error);  // Message de débogage
        res.status(500).json({ error: 'Erreur de conversion des données' });
        responseSent = true;
      }
    }
  });

  pythonProcess.stderr.on('data', (error) => {
    const errorMsg = error.toString();
    console.warn('⚠️ Warning du script Python :', errorMsg);
  
    // Si ce n’est qu’un warning, on n’envoie pas une erreur HTTP
    if (!responseSent && errorMsg.toLowerCase().includes('warning')) {
      return; // on ignore les warnings
    }
  
    if (!responseSent) {
      res.status(500).json({ error: 'Erreur de prédiction (script Python)', details: errorMsg });
      responseSent = true;
    }
  });
  

  pythonProcess.on('error', (err) => {
    console.error(`Erreur de lancement du script Python: ${err}`);  // Message de débogage
    if (!responseSent) {
      res.status(500).json({ error: 'Erreur de lancement de script Python' });
      responseSent = true;
    }
  });
});

module.exports = router;
