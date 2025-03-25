import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native'; 
import Signup from './src/components/Signup';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Signup />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
