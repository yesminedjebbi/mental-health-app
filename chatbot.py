from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
import random
import numpy as np  # Assure-toi que numpy est bien importé avant d'utiliser le modèle

app = Flask(__name__)
CORS(app)

# Load model with more emotions
emotion_analyzer = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions")

# Emotion-based messages
emotion_responses = {
    "joy": [
        "That's wonderful to hear!",
        "Keep that smile going!",
        "You’re shining today!"
    ],
    "sadness": [
        "I’m here for you",
        "It’s okay to feel sad sometimes",
        "Would you like to talk about it?"
    ],
    "anger": [
        "Take a deep breath. I'm here for you",
        "Want to try calming down together?",
        "Let it out, I’m listening"
    ],
    "fear": [
        "You're safe here. Want to share what’s scaring you?",
        "We can face this together",
        "Let's take a calming breath"
    ],
    "surprise": [
        "Oh wow, that sounds unexpected!",
        "Want to tell me more about it?",
        "I love hearing about surprises!"
    ],
    "neutral": [
        "I'm here if you want to chat",
        "How's your day going so far?",
        "Even quiet days matter"
    ],
    "stress": [
        "Take a deep breath. It’s okay to feel overwhelmed",
        "Let’s focus on what you can control",
        "You’re not alone, I’m here for you"
    ],
    "disappointment": [
        "It’s tough when things don’t go as expected",
        "I understand how you feel",
        "Would you like to share what happened?"
    ]
}

# Emotion-based activities
emotion_activities = {
    "joy": [
        "Do something you love today!",
        "Share a happy moment with someone you like!",
        "Try learning something new; it will bring you even more joy!"
    ],
    "sadness": [
        "Would you like to try a relaxation session to calm your mind?",
        "Try visualizing a calm and peaceful place.",
        "Listening to soothing sounds could help you feel better."
    ],
    "anger": [
        "Go for a brisk walk or stretch",
        "Try deep breathing for a few minutes",
        "Listen to calming music"
    ],
    "fear": [
        "Picture a calm and safe place",
        "Breathe deeply and slowly",
        "Talk to someone you trust"
    ],
    "surprise": [
        "Reflect on what surprised you",
        "Write down the unexpected event",
        "Share your surprise with someone"
    ],
    "neutral": [
        "Take a short break and relax",
        "Listen to soft music",
        "Do something creative"
    ],
    "stress": [
        "Try a short meditation session",
        "Write down your worries to clear your mind",
        "Take a walk outside to refresh yourself"
    ],
    "disappointment": [
        "Talk to someone you trust about what happened",
        "Write down how you’re feeling and why",
        "Give yourself some space to process it"
    ]
}

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    message = data.get('message', '')

    # Emotion classification
    emotion = emotion_analyzer(message)[0]['label']

    # Random response based on emotion
    response = random.choice(emotion_responses.get(emotion, ["I'm here if you want to talk"]))

    # Random activity suggestion based on emotion
    activity = random.choice(emotion_activities.get(emotion, ["Take care of yourself and do what makes you feel better!"]))

    return jsonify({
        "response": response,
        "emotion": emotion,
        "activity_suggestion": activity
    })

if __name__ == '__main__':
    app.run(debug=True)
