import React from 'react';
import { StyleSheet, SafeAreaView, View,Text } from 'react-native'; 


export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>hello</Text>
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
