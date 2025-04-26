import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import ProfilePictureSelector from './src/choosepic';
import ProfilePage from './src/profile';
import FeedbackPage from './src/feedback'; 
import SettingsPage from './src/settings'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProfilePictureSelector">
        <Stack.Screen
          name="ProfilePictureSelector"
          component={ProfilePictureSelector}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfilePage"
          component={ProfilePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Feedback"
          component={FeedbackPage}  // Lien vers la page Feedback
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="settings"
          component={SettingsPage}  // Lien vers la page Feedback
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
