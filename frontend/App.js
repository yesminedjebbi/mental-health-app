import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native'; 
import Signup from './src/components/Signup';
import Login from './src/components/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FirstScreen from './src/components/FirstScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <SafeAreaView style={styles.container}>
    //   <FirstScreen />
    // </SafeAreaView>
    <NavigationContainer>
    <Stack.Navigator initialRouteName="FirstScreen">
    <Stack.Screen 
        name="FirstScreen" 
        component={FirstScreen}
        options={{ headerShown: false }} // Cache l'en-tête si besoin
      />
      <Stack.Screen 
        name="Signup" 
        component={Signup}
        options={{ headerShown: false }} // Cache l'en-tête si besoin
      />
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ title: 'Login' }} // Personnalise le titre
      />
    </Stack.Navigator>
  </NavigationContainer>
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
