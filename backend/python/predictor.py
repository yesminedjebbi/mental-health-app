import joblib
import numpy as np
import sys
import json
import os


#Charger le modèle XGBoost sauvegardé
model = joblib.load(os.path.join(os.path.dirname(__file__), 'model_xgb.pkl'))

#Lire les données JSON depuis l'entrée standard (envoyées par runPython.js)
try:
    input_data = json.loads(sys.stdin.read())
    features = np.array(input_data['features'])  # Format: [[f1, f2, ..., f10]]
except Exception as e:
    print(json.dumps({'error': f'Erreur lors de la lecture des données: {str(e)}'}))
    sys.exit(1)

# Faire la prédiction
try:
    prediction = model.predict(features)[0]  # Résultat : [happiness, depression, ...]
except Exception as e:
    print(json.dumps({'error': f'Erreur lors de la prédiction: {str(e)}'}))
    sys.exit(1)

emotions = ['Happiness', 'Depression', 'Anxiety', 'Loneliness', 'Anger']
result = {emotions[i]: float(round(prediction[i], 2)) for i in range(len(emotions))}


# Retourner le résultat au format JSON
print(json.dumps(result))
