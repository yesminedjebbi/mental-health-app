#pour la partie prédiction de l'état mental futur
import joblib
import numpy as np
import sys
import json
import os

# Charger le modèle
model = joblib.load(os.path.join(os.path.dirname(__file__),'mental_health_model_xgb.pkl'))

# Lire les arguments passés par Node.js
args = list(map(float, sys.argv[1:]))  # Convertir en float
new_input = np.array([args])  # Mettre en 2D

# Faire la prédiction
prediction = model.predict(new_input)

# Définir les états
states = ['depression', 'anxiety', 'happiness', 'loneliness', 'anger']

# Construire le JSON à retourner
result = {
    "states": states,
    "predicted_probabilities": prediction[0].tolist()
}

# Afficher le JSON (stdout → Node.js va l'intercepter)
print(json.dumps(result))