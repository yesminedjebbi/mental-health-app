from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- ADD THIS
import pickle
import numpy as np
import pandas as pd

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # <-- ADD THIS (allows Expo frontend to connect)

# Load the saved model and encoders
with open('multi_target_rf.pkl', 'rb') as model_file:
    multi_target_rf = pickle.load(model_file)

with open('mlb_interests.pkl', 'rb') as interests_file:
    mlb_interests = pickle.load(interests_file)

with open('mlb_queries.pkl', 'rb') as queries_file:
    mlb_queries = pickle.load(queries_file)

# Define the prediction route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Extract emotion features
        emotion_features = ['happiness', 'depression', 'anxiety', 'loneliness', 'anger']
        emotion_values = [[data[feature] for feature in emotion_features]]
        emotions_df = pd.DataFrame(emotion_values, columns=emotion_features)

        # One-hot encode interests
        interests_list = [data['interests']]  # needs to be list of lists
        interests_encoded = mlb_interests.transform(interests_list)
        interests_df = pd.DataFrame(interests_encoded, columns=mlb_interests.classes_)

        # Combine features
        input_df = pd.concat([emotions_df, interests_df], axis=1)

        # Make prediction
        prediction = multi_target_rf.predict(input_df)

        # Decode prediction into labels
        predicted_queries = mlb_queries.inverse_transform(prediction)[0]

        return jsonify({'predicted_queries': predicted_queries})

    except Exception as e:
        return jsonify({'error': str(e)})

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)  # <-- UPDATE THIS