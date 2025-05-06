import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native'; 
import Signup from './src/components/Signup';
import Login from './src/components/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FirstScreen from './src/components/FirstScreen';
import Quiz from './src/components/quizPage';
import HomePage from './src/components/Home';
import JournalScreen from './src/components/Journal';
import JournalEntryScreen from './src/components/JournalEntryScreen';
import Chatbot from './src/components/chatbot';
import InterestSelectionScreen from './src/components/interests';
import AllActivities from './src/components/AllActivities';
import RecommendedActivitiesScreen from './src/components/recommendations';
import ProfilePictureSelector from './src/components/choosepic';
import ProfilePage from './src/components/profile';
import SettingsPage from './src/components/settings';
import FeedbackPage from './src/components/feedback';
import ActivitiesScreen from './src/components/activities';
import MeditationScreen from './src/components/meditation';
import BreathingScreen from './src/components/breathing_exercices';
import PodcastScreen from './src/components/podcasts';
import MusicPage from './src/components/music';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <SafeAreaView style={styles.container}>
    //   < RecommendedActivitiesScreen/>
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
        options={{  headerShown: false }} // Personnalise le titre
      />
      <Stack.Screen 
          name="Quiz" 
          component={Quiz} 
          options={{ headerShown: false }} 
        />
           <Stack.Screen 
          name="Home" 
          component={HomePage} 
          options={{ headerShown: false }} 
        />
           <Stack.Screen 
          name="Journal" 
          component={JournalScreen} 
          options={{ headerShown: false }} 
        />  
         <Stack.Screen 
          name="JournalEntry" 
          component={JournalEntryScreen} 
          options={{ headerShown: false }} 
        /> 
         <Stack.Screen 
          name="InterestPage" 
          component={InterestSelectionScreen} 
          options={{ headerShown: false }} 
        /> 
         <Stack.Screen 
          name="ChoosePic" 
          component={ProfilePictureSelector} 
          options={{ headerShown: false }} 
        /> 
         <Stack.Screen 
          name="Profile" 
          component={ProfilePage} 
          options={{ headerShown: false }} 
        /> 
         <Stack.Screen 
          name="chatbot" 
          component={Chatbot} 
          options={{ headerShown: false }} 
        /> 
         <Stack.Screen 
          name="recomm" 
          component={RecommendedActivitiesScreen} 
          options={{ headerShown: false }} 
        /> 
      
         <Stack.Screen 
          name="settings" 
          component={SettingsPage} 
          options={{ headerShown: false }} 
        /> 
         <Stack.Screen 
          name="feedback" 
          component={FeedbackPage} 
          options={{ headerShown: false }} 
        /> 
         <Stack.Screen name="Activities" component={ActivitiesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Meditation" component={MeditationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Breathing" component={BreathingScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Podcasts" component={PodcastScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Music" component={MusicPage} options={{ headerShown: false }} />
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
