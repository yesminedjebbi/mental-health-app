
const express = require('express');
const router = express.Router();
const runModel = require('../python/runPython');

router.post('/predict', (req, res) => {
  const features = req.body.features;

  if (!features || features.length !== 10) {
    return res.status(400).json({ error: 'Il faut un tableau de 10 valeurs.' });
  }

  runModel(features, (err, result) => {
    if (err) {
      console.error('Erreur dans runModel :', err);
      return res.status(500).json({ error: 'Erreur dans la prédiction' });
    }

    res.json(result);
  });
});

module.exports = router;
