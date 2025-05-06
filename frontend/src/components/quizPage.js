import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function Quiz({ route , navigation }) {
  const { userId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [categoryScores, setCategoryScores] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(`http://192.168.1.6:5000/api/quiz/${userId}`);
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Erreur lors du chargement des questions", error);
      }
    }
    fetchQuestions();
  }, [userId]);

  const handleAnswerSelect = (questionId, answerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerValue }));
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== questions.length) {
      Alert.alert("Incomplete Quiz", "Please answer all questions before submitting.");
      return;
    }

    try {
      const response = await fetch('http://192.168.1.6:5000/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers }),
      });

      const data = await response.json();
      setCategoryScores(data.scores);
      navigation.navigate("Home", { userId:userId });
      // Alert.alert("scores:", JSON.stringify(data.scores));
      
    } catch (error) {
      console.error("Erreur lors de la soumission", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧠 Daily Mental Health Quiz</Text>

      {questions.length > 0 ? (
        questions.map((item) => (
          <View key={item._id} style={styles.card}>
            <Text style={styles.question}>{item.text}</Text>

            {item.type === "scale" ? (
              <View style={styles.scaleContainer}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleAnswerSelect(item._id, value)}
                    style={[styles.scaleButton, answers[item._id] === value && styles.selectedButton]}
                  >
                    <Text style={styles.buttonText}>{value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.optionsContainer}>
                {item.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAnswerSelect(item._id, option)}
                    style={[styles.optionButton, answers[item._id] === option && styles.selectedButton]}
                  >
                    <Text style={styles.buttonText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noQuiz}>NO quiz Available Today</Text>
      )}

      <TouchableOpacity onPress={submitQuiz} style={styles.submitButton}>
        <Text style={styles.submitText} >Submit</Text>
      </TouchableOpacity>

      {/* {categoryScores && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>📊 scores :</Text>
          {Object.entries(categoryScores).map(([category, score]) => (
            <Text key={category} style={styles.scoreText}>
              {category} : {score}%
            </Text>
          ))}
        </View>
      )}  */}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F7FA',
    marginTop:30,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#6495ED',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  scaleButton: {
    backgroundColor: '#E5EFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#E5EFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  selectedButton: {
    backgroundColor: '#6495ED',
  },
  buttonText: {
    color: '#000',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#6495ED',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
    bottom: 40,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  scoreContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#6495ED',
  },
  scoreText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  noQuiz: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#6495ED',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
});
