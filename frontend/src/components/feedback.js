import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icônes étoiles

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [bounceAnim] = useState(new Animated.Value(1)); // Valeur d'animation

  useEffect(() => {
    // Animation de rebond au chargement de la page
    Animated.loop(
      Animated.sequence([
        Animated.spring(bounceAnim, {
          toValue: 1.1, // Rebond vers le haut
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1, // Revenir à la taille originale
          friction: 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  const handleStarPress = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0 || feedbackText.trim() === '') {
      Alert.alert('Attention', 'Please fill in your opinion');
      return;
    }

    // Ici tu pourrais envoyer à ton backend via axios.post par exemple
    console.log('Feedback submitted:', { rating, feedbackText });

    Alert.alert('Thank you !', 'Your feedback has been sent');
    setRating(0);
    setFeedbackText('');
  };

  return (
    <View style={styles.container}>
      {/* Texte animé avec effet de rebond */}
      <Animated.Text style={[styles.title, { transform: [{ scale: bounceAnim }] }]}>
        Tell us what you think — we’re all ears!
      </Animated.Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity key={value} onPress={() => handleStarPress(value)}>
            <Ionicons
              name={value <= rating ? 'star' : 'star-outline'}
              size={40}
              color="#FFD700"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Your feedback here..."
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={5}
        value={feedbackText}
        onChangeText={setFeedbackText}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center', // Centre le contenu verticalement
    alignItems: 'center',     // Centre le contenu horizontalement
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 40,
    marginBottom: 30,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  star: {
    marginHorizontal: 5,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  button: {
    backgroundColor: '#96d2d8',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FeedbackPage;