
import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import Chatbot from './src/chatbot';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}></Text>
      <Chatbot />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color:'black',
  },
});

export default App;
