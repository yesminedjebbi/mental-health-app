import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

const activities = [
  {
    id: "Podcasts",
    title: "Podcasts",
    description: "Discover positive mental health content.",
    bgColor: "#D7ECEF",
    icon: require("../assets/podcast.png"),
  },
  {
    id: "Meditation",
    title: "Meditation",
    description: "Relax your mind with guided meditation.",
    bgColor: "#E4F3E3",
    icon: require("../assets/meditation.png"),
  },
  {
    id: "Breathing",
    title: "Breathing exercises",
    description: "Try deep breathing to reduce stress.",
    bgColor: "#F3E9EA",
    icon: require("../assets/breathing.png"),
  },
  {
    id: "Music",
    title: "Music",
    description: "Listen to some relaxing music.",
    bgColor: "#FDF0CC",
    icon: require("../assets/music.png"),
  },
];

const recommendedIds = ["Meditation", "Breathing", "Music", "Podcasts"];
const recommendedActivities = activities.filter((activity) =>
  recommendedIds.includes(activity.id)
);

const ActivitiesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Text style={styles.header}>Activities</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {recommendedActivities.map((activity, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: activity.bgColor }]}
            onPress={() => navigation.navigate(activity.id)}
          >
            <View>
              <Text style={styles.title}>{activity.title}</Text>
              <Text style={styles.description}>{activity.description}</Text>
            </View>
            <Image source={activity.icon} style={styles.icon} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#4A90E2",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  card: {
    borderRadius: 60,
    padding: 20,
    paddingTop: 0,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    height: 140,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    maxWidth: 200,
  },
  icon: {
    marginTop: 20,
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  circle: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 150,
    height: 150,
    backgroundColor: "#E3F2FD",
    borderRadius: 70.5,
  },
});

export default ActivitiesScreen;
