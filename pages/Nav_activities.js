import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActivitiesScreen from "./pages/activities";

// Import your other activity pages here:
import MeditationScreen from "./pages/meditation";
import BreathingScreen from "./pages/breathing_exercices";
import PodcastsScreen from "./pages/podcasts";
import MusicScreen from "./pages/music";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Activities">
        <Stack.Screen name="Activities" component={ActivitiesScreen} />
        <Stack.Screen name="Meditation" component={MeditationScreen} />
        <Stack.Screen name="Breathing" component={BreathingScreen} />
        <Stack.Screen name="Podcasts" component={PodcastsScreen} />
        <Stack.Screen name="Music" component={MusicScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
