import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

const App = () => {
  const [aiOutput, setAiOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAndSendData = async () => {
    try {
      setLoading(true);

      // 1. Fetch mental state
      const mentalStateRes = await fetch('http://192.168.1.13:5000/api/mentalstate/12345');
      const mentalState = await mentalStateRes.json();

      // 2. Fetch interests
      const interestsRes = await fetch('http://192.168.1.13:5000/api/interests/12345');
      const interestsData = await interestsRes.json();

      // 3. Combine into the correct format
      const combinedInput = {
        ...mentalState,
        interests: interestsData.interests
      };

      console.log('Sending to AI model:', combinedInput);

      // 4. Send to the Flask AI model
      const aiRes = await fetch('http://192.168.1.13:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedInput),
      });

      const aiData = await aiRes.json();

      // 5. Save AI output
      setAiOutput(aiData);

    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSendData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Recommendations</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {aiOutput ? (
        <Text style={styles.outputText}>{JSON.stringify(aiOutput, null, 2)}</Text>
      ) : (
        !loading && <Text>No output yet.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  outputText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'left',
    width: '100%',
  },
});

export default App;
