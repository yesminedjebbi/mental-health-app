import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActivitiesScreen from "./activities";
import MeditationScreen from "./meditation";
import BreathingScreen from "./breathing_exercices";
import MusicPage from "./music";
import PodcastScreen from "./podcasts";


const Stack = createNativeStackNavigator();

export default function AllActivities() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Activities">
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}