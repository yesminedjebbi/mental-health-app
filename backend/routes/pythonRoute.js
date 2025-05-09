// routes/route.js
const express  = require('express');
const router   = express.Router();
const runModel = require('../python/runPython');

router.post('/predict', async (req, res) => {
  try {
    const features = req.body.features;

    // Validation : features doit être un array 2D et features[0] un array de 10 valeurs
    if (
      !Array.isArray(features) ||
      features.length === 0 ||
      !Array.isArray(features[0]) ||
      features[0].length !== 10
    ) {
      return res.status(400).json({
        error: 'Il faut un tableau 2D "features" avec exactement 10 valeurs dans chaque sous-tableau.'
      });
    }

    // Exécution du modèle
    const result = await runModel({ features });

    // Renvoi du résultat
    return res.json(result);

  } catch (err) {
    console.error('Erreur dans runModel :', err);
    return res.status(500).json({ error: 'Erreur dans la prédiction' });
  }
});

module.exports = router;
